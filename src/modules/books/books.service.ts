import { NestHelper } from '@common/helpers/nest.helper';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { AuthorsService } from '../authors/authors.service';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dtos/createBook.dto';
import { QueryBookDto } from './dtos/queryBook.dto';
import { UpdateBookDto } from './dtos/updateBook.dto';
import { IBook, IBooksRes } from './interfaces/book.interface';
import { Book } from './schemas/books.schema';

@Injectable()
export class BooksService {
    constructor(
        private readonly booksRepository: BooksRepository,
        private readonly authorsService: AuthorsService
    ) { }

    /**
     * Create a new book
     */
    async create(createBookDto: CreateBookDto): Promise<Book> {
        const author = await this.authorsService.findOne(createBookDto.authorId);

        if (!author) {
            throw new BadRequestException(`Author with ID ${createBookDto.authorId} not found`);
        }

        const authorObjectId = NestHelper.getInstance().getObjectId(author._id);

        const bookPayload: Partial<Book> = {
            title: createBookDto.title,
            isbn: createBookDto.isbn ?? "",
            publicationDate: createBookDto.publicationDate ? new Date(createBookDto.publicationDate) : undefined,
            genre: createBookDto.genre ?? undefined,
            authorId: authorObjectId
        }

        const book = await this.booksRepository.create(bookPayload);

        return book;
    }

    /**
     * Get a list of all books with pagination, search, and filtering
     */
    async findAll(queryDto: QueryBookDto): Promise<IBooksRes> {

        const { page = 1, limit = 10, title, isbn, authorId } = queryDto;
        const skip = (page - 1) * limit;

        // Build search filter
        const filter: any = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (isbn) {
            filter.isbn = { $regex: isbn, $options: 'i' };
        }
        if (authorId) {
            filter.authorId = NestHelper.getInstance().getObjectId(authorId);
        }

        const aggregate: PipelineStage[] = [
            { $match: filter },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$authorId',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $count: 'count' },
                    ],
                },
            },
        ];

        const [result] = await this.booksRepository.runAggregate(aggregate);

        const data = result?.data ?? [];
        const count = result?.totalCount?.[0]?.count ?? 0;

        return { data, count };
    }

    /**
     * Find a single book by ID with author information
     */
    async findOne(id: string, expand: string): Promise<IBook> {
        const book = await this.booksRepository.findById(id, expand);
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    /**
     * Update an existing book by ID
     */
    async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
        const updateData: any = { ...updateBookDto };

        if (updateBookDto?.authorId) {
            const author = await this.authorsService.findOne(updateBookDto.authorId);
            if (!author) {
                throw new BadRequestException(`Author with ID ${updateBookDto.authorId} not found`);
            }
            updateData.authorId = NestHelper.getInstance().getObjectId(author._id);
        }

        if (updateBookDto.publicationDate) {
            updateData.publicationDate = new Date(updateBookDto.publicationDate);
        }

        const book = await this.booksRepository.update(id, updateData);
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }

        return book;
    }

    /**
     * Delete a book by ID
     */
    async remove(id: string): Promise<void> {
        const result = await this.booksRepository.delete(id);
        if (!result) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
    }
}
