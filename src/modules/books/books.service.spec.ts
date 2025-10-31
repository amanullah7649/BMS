import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AuthorsService } from '../authors/authors.service';
import { Author } from '../authors/schemas/author.schema';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/createBook.dto';
import { QueryBookDto } from './dtos/queryBook.dto';
import { UpdateBookDto } from './dtos/updateBook.dto';
import { Book } from './schemas/books.schema';

// Mock NestHelper
jest.mock('@common/helpers/nest.helper', () => {
  const mongoose = require('mongoose');
  return {
    NestHelper: {
      getInstance: jest.fn().mockReturnValue({
        getObjectId: jest.fn((id) => new mongoose.Types.ObjectId(id)),
      }),
    },
  };
});

const mockAuthor = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Test bio',
  birthDate: new Date('1980-05-20'),
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Author;

const mockBook = {
  _id: '507f1f77bcf86cd799439012',
  title: 'Test Book',
  isbn: '978-3-16-148410-0',
  publicationDate: new Date('2024-01-15'),
  genre: 'Fantasy',
  authorId: new Types.ObjectId('507f1f77bcf86cd799439011'),
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Book;

const mockBooksRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  runAggregate: jest.fn(),
};

const mockAuthorsService = {
  findById: jest.fn(),
};

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: BooksRepository;
  let authorsService: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BooksRepository,
          useValue: mockBooksRepository,
        },
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<BooksRepository>(BooksRepository);
    authorsService = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        publicationDate: '2024-01-15',
        genre: 'Fantasy',
        authorId: '507f1f77bcf86cd799439011',
      };

      jest.spyOn(authorsService, 'findById').mockResolvedValue(mockAuthor);
      jest.spyOn(booksRepository, 'create').mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(authorsService.findById).toHaveBeenCalledWith(createBookDto.authorId);
      expect(booksRepository.create).toHaveBeenCalledWith({
        title: createBookDto.title,
        isbn: createBookDto.isbn,
        publicationDate: new Date(createBookDto.publicationDate),
        genre: createBookDto.genre,
        authorId: expect.any(Types.ObjectId),
      });
    });

    it('should create a book without optional fields', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        genre: undefined,
        publicationDate: undefined,
        authorId: '507f1f77bcf86cd799439011',
      } as CreateBookDto;

      const bookWithoutOptionalFields = {
        ...mockBook,
        publicationDate: undefined,
        genre: undefined,
      } as unknown as Book;

      jest.spyOn(authorsService, 'findById').mockResolvedValue(mockAuthor);
      jest.spyOn(booksRepository, 'create').mockResolvedValue(bookWithoutOptionalFields);

      const result = await service.create(createBookDto);

      expect(result).toEqual(bookWithoutOptionalFields);
      expect(booksRepository.create).toHaveBeenCalledWith({
        title: createBookDto.title,
        isbn: createBookDto.isbn,
        publicationDate: undefined,
        genre: undefined,
        authorId: expect.any(Types.ObjectId),
      });
    });

    it('should throw BadRequestException when author not found', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        genre: 'Fiction',
        authorId: '507f1f77bcf86cd799439011',
      };

      jest.spyOn(authorsService, 'findById').mockResolvedValue(null);

      await expect(service.create(createBookDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createBookDto)).rejects.toThrow(
        `Author with ID ${createBookDto.authorId} not found`,
      );
      expect(authorsService.findById).toHaveBeenCalledWith(createBookDto.authorId);
      expect(booksRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated books with default pagination', async () => {
      const queryDto: QueryBookDto = {};
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockBook],
        count: 1,
      });
      expect(booksRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $facet: expect.any(Object),
          }),
        ]),
      );
    });

    it('should return paginated books with custom pagination', async () => {
      const queryDto: QueryBookDto = {
        page: 2,
        limit: 20,
      };
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 25 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockBook],
        count: 25,
      });
      expect(booksRepository.runAggregate).toHaveBeenCalled();
    });

    it('should filter by title when provided', async () => {
      const queryDto: QueryBookDto = {
        title: 'Test',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(booksRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              title: { $regex: 'Test', $options: 'i' },
            },
          }),
        ]),
      );
    });

    it('should filter by isbn when provided', async () => {
      const queryDto: QueryBookDto = {
        isbn: '978-3-16-148410-0',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(booksRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              isbn: { $regex: '978-3-16-148410-0', $options: 'i' },
            },
          }),
        ]),
      );
    });

    it('should filter by authorId when provided', async () => {
      const queryDto: QueryBookDto = {
        authorId: '507f1f77bcf86cd799439011',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(booksRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              authorId: expect.any(Types.ObjectId),
            },
          }),
        ]),
      );
    });

    it('should filter by multiple parameters when provided', async () => {
      const queryDto: QueryBookDto = {
        title: 'Test',
        isbn: '978',
        authorId: '507f1f77bcf86cd799439011',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockBook],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(booksRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              title: { $regex: 'Test', $options: 'i' },
              isbn: { $regex: '978', $options: 'i' },
              authorId: expect.any(Types.ObjectId),
            },
          }),
        ]),
      );
    });

    it('should return empty array and zero count when no results found', async () => {
      const queryDto: QueryBookDto = {};
      const mockResult = [
        {
          data: [],
          totalCount: [],
        },
      ];

      jest.spyOn(booksRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [],
        count: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a book when found', async () => {
      const id = '507f1f77bcf86cd799439012';
      const expand = 'author';
      jest.spyOn(booksRepository, 'findById').mockResolvedValue(mockBook as any);

      const result = await service.findOne(id, expand);

      expect(result).toEqual(mockBook);
      expect(booksRepository.findById).toHaveBeenCalledWith(id, expand);
    });

    it('should return a book without expand parameter', async () => {
      const id = '507f1f77bcf86cd799439012';
      const expand = '';
      jest.spyOn(booksRepository, 'findById').mockResolvedValue(mockBook as any);

      const result = await service.findOne(id, expand);

      expect(result).toEqual(mockBook);
      expect(booksRepository.findById).toHaveBeenCalledWith(id, expand);
    });

    it('should throw NotFoundException when book not found', async () => {
      const id = '507f1f77bcf86cd799439012';
      const expand = 'author';
      jest.spyOn(booksRepository, 'findById').mockResolvedValue(null);

      await expect(service.findOne(id, expand)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id, expand)).rejects.toThrow(
        `Book with ID ${id} not found`,
      );
      expect(booksRepository.findById).toHaveBeenCalledWith(id, expand);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const id = '507f1f77bcf86cd799439012';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        genre: 'Science Fiction',
      };
      const updatedBook = {
        ...mockBook,
        ...updateBookDto,
      } as unknown as Book;

      jest.spyOn(booksRepository, 'update').mockResolvedValue(updatedBook);

      const result = await service.update(id, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(booksRepository.update).toHaveBeenCalledWith(id, {
        title: 'Updated Book',
        genre: 'Science Fiction',
      });
    });

    it('should convert publicationDate string to Date when provided', async () => {
      const id = '507f1f77bcf86cd799439012';
      const updateBookDto: UpdateBookDto = {
        publicationDate: '2025-01-15',
      };
      const updatedBook = {
        ...mockBook,
        publicationDate: new Date('2025-01-15'),
      } as unknown as Book;

      jest.spyOn(booksRepository, 'update').mockResolvedValue(updatedBook);

      const result = await service.update(id, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(booksRepository.update).toHaveBeenCalledWith(id, {
        publicationDate: new Date('2025-01-15'),
      });
    });

    it('should update authorId when provided', async () => {
      const id = '507f1f77bcf86cd799439012';
      const newAuthorId = '507f1f77bcf86cd799439013';
      const updateBookDto: UpdateBookDto = {
        authorId: newAuthorId,
      };
      const newAuthor = {
        ...mockAuthor,
        _id: newAuthorId,
      } as unknown as Author;
      const updatedBook = {
        ...mockBook,
        authorId: new Types.ObjectId(newAuthorId),
      } as unknown as Book;

      jest.spyOn(authorsService, 'findById').mockResolvedValue(newAuthor);
      jest.spyOn(booksRepository, 'update').mockResolvedValue(updatedBook);

      const result = await service.update(id, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(authorsService.findById).toHaveBeenCalledWith(newAuthorId);
      expect(booksRepository.update).toHaveBeenCalledWith(id, {
        authorId: expect.any(Types.ObjectId),
      });
    });

    it('should throw BadRequestException when updating with non-existent author', async () => {
      const id = '507f1f77bcf86cd799439012';
      const updateBookDto: UpdateBookDto = {
        authorId: '507f1f77bcf86cd799439013',
      };

      jest.spyOn(authorsService, 'findById').mockResolvedValue(null);

      await expect(service.update(id, updateBookDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(id, updateBookDto)).rejects.toThrow(
        `Author with ID ${updateBookDto.authorId} not found`,
      );
      expect(authorsService.findById).toHaveBeenCalledWith(updateBookDto.authorId);
      expect(booksRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when book not found', async () => {
      const id = '507f1f77bcf86cd799439012';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };
      jest.spyOn(booksRepository, 'update').mockResolvedValue(null);

      await expect(service.update(id, updateBookDto)).rejects.toThrow(
        new NotFoundException(`Book with ID ${id} not found`),
      );
      expect(booksRepository.update).toHaveBeenCalledWith(id, {
        title: 'Updated Book',
      });
    });
  });

  describe('remove', () => {
    it('should delete a book successfully', async () => {
      const id = '507f1f77bcf86cd799439012';
      jest.spyOn(booksRepository, 'delete').mockResolvedValue(mockBook);

      await service.remove(id);

      expect(booksRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when book not found', async () => {
      const id = '507f1f77bcf86cd799439012';
      jest.spyOn(booksRepository, 'delete').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow(
        `Book with ID ${id} not found`,
      );
      expect(booksRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
