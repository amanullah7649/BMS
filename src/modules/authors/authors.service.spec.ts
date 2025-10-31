import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorRepository } from './author.repository';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { QueryAuthorDto } from './dtos/query-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { Author } from './schemas/author.schema';

const mockAuthor = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Test bio',
  birthDate: new Date('1980-05-20'),
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Author;
const mockAuthorRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  runAggregate: jest.fn(),
};

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepository: AuthorRepository;

  beforeEach(async () => {


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: AuthorRepository,
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorRepository = module.get<AuthorRepository>(AuthorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an author successfully', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        birthDate: '1980-05-20',
      };

      jest.spyOn(authorRepository, 'create').mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(authorRepository.create).toHaveBeenCalledWith({
        ...createAuthorDto,
        birthDate: new Date(createAuthorDto.birthDate),
      });
    });

    it('should create an author with empty strings for optional fields', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const authorWithoutOptionalFields = {
        ...mockAuthor,
        firstName: 'Jane',
        lastName: 'Smith',
        bio: '',
        birthDate: undefined,
      } as unknown as Author;

      jest.spyOn(authorRepository, 'create').mockResolvedValue(authorWithoutOptionalFields);

      const result = await service.create(createAuthorDto);

      expect(result).toEqual(authorWithoutOptionalFields);
      expect(authorRepository.create).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        bio: '',
        birthDate: undefined,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated authors with default pagination', async () => {
      const queryDto: QueryAuthorDto = {};
      const mockResult = [
        {
          data: [mockAuthor],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockAuthor],
        count: 1,
      });
      expect(authorRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $facet: expect.any(Object),
          }),
        ]),
      );
    });

    it('should return paginated authors with custom pagination', async () => {
      const queryDto: QueryAuthorDto = {
        page: 2,
        limit: 20,
      };
      const mockResult = [
        {
          data: [mockAuthor],
          totalCount: [{ count: 25 }],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockAuthor],
        count: 25,
      });
      expect(authorRepository.runAggregate).toHaveBeenCalled();
    });

    it('should filter by firstName when provided', async () => {
      const queryDto: QueryAuthorDto = {
        firstName: 'John',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockAuthor],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(authorRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              firstName: { $regex: 'John', $options: 'i' },
            },
          }),
        ]),
      );
    });

    it('should filter by lastName when provided', async () => {
      const queryDto: QueryAuthorDto = {
        lastName: 'Doe',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockAuthor],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(authorRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              lastName: { $regex: 'Doe', $options: 'i' },
            },
          }),
        ]),
      );
    });

    it('should filter by both firstName and lastName when provided', async () => {
      const queryDto: QueryAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          data: [mockAuthor],
          totalCount: [{ count: 1 }],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result.count).toBe(1);
      expect(authorRepository.runAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: {
              firstName: { $regex: 'John', $options: 'i' },
              lastName: { $regex: 'Doe', $options: 'i' },
            },
          }),
        ]),
      );
    });

    it('should return empty array and zero count when no results found', async () => {
      const queryDto: QueryAuthorDto = {};
      const mockResult = [
        {
          data: [],
          totalCount: [],
        },
      ];

      jest.spyOn(authorRepository, 'runAggregate').mockResolvedValue(mockResult);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [],
        count: 0,
      });
    });
  });

  describe('findById', () => {
    it('should return an author when found', async () => {
      const id = '507f1f77bcf86cd799439011';
      jest.spyOn(authorRepository, 'findById').mockResolvedValue(mockAuthor);

      const result = await service.findById(id);

      expect(result).toEqual(mockAuthor);
      expect(authorRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when author not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      jest.spyOn(authorRepository, 'findById').mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(id)).rejects.toThrow(
        `Author with ID ${id} not found`,
      );
      expect(authorRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an author successfully', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateAuthorDto: UpdateAuthorDto = {
        bio: 'Updated bio',
        firstName: 'Johnny',
      };
      const updatedAuthor = {
        ...mockAuthor,
        ...updateAuthorDto,
      } as unknown as Author;

      jest.spyOn(authorRepository, 'update').mockResolvedValue(updatedAuthor);

      const result = await service.update(id, updateAuthorDto);

      expect(result).toEqual(updatedAuthor);
      expect(authorRepository.update).toHaveBeenCalledWith(id, {
        bio: 'Updated bio',
        firstName: 'Johnny',
      });
    });

    it('should convert birthDate string to Date when provided', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateAuthorDto: UpdateAuthorDto = {
        birthDate: '1990-01-15',
      };
      const updatedAuthor = {
        ...mockAuthor,
        birthDate: new Date('1990-01-15'),
      } as unknown as Author;

      jest.spyOn(authorRepository, 'update').mockResolvedValue(updatedAuthor);

      const result = await service.update(id, updateAuthorDto);

      expect(result).toEqual(updatedAuthor);
      expect(authorRepository.update).toHaveBeenCalledWith(id, {
        birthDate: new Date('1990-01-15'),
      });
    });

    it('should throw NotFoundException when author not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateAuthorDto: UpdateAuthorDto = {
        bio: 'Updated bio',
      };
      jest.spyOn(authorRepository, 'update').mockResolvedValue(null);

      await expect(service.update(id, updateAuthorDto)).rejects.toThrow(
        new NotFoundException(`Author with ID ${id} not found`),
      );
      expect(authorRepository.update).toHaveBeenCalledWith(id, {
        bio: 'Updated bio',
      });
    });
  });

  describe('remove', () => {
    it('should delete an author successfully', async () => {
      const id = '507f1f77bcf86cd799439011';
      jest.spyOn(authorRepository, 'delete').mockResolvedValue(mockAuthor as unknown as boolean);

      await service.remove(id);

      expect(authorRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when author not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      jest.spyOn(authorRepository, 'delete').mockResolvedValue(null as unknown as boolean);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow(
        `Author with ID ${id} not found`,
      );
      expect(authorRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
