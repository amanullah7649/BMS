import { NestHelper } from "@common/helpers/nest.helper";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Author } from "../authors/schemas/author.schema";
import { IBook } from "./interfaces/book.interface";
import { Book } from "./schemas/books.schema";

@Injectable()
export class BooksRepository {

    constructor(
        @InjectModel(Book.name)
        private readonly bookModel: Model<Book>
    ) { }


    async create(book: Partial<Book>): Promise<Book> {
        const newBook = new this.bookModel(book);
        return await newBook.save();
    }

    async findById(id: string, expand?: string): Promise<IBook | null> {

        if (!id) {
            return null;
        }

        const bookId = NestHelper.getInstance().getObjectId(id);
        const query = this.bookModel.findById(bookId);

        // Populate author if expand includes "author"
        const shouldExpandAuthor = expand?.split(',').includes('author');
        if (shouldExpandAuthor) {
            query.populate({
                path: 'authorId',
                model: Author.name,
                select: 'firstName lastName bio birthDate',
            });
        }

        const bookResponse = await query.lean().exec();

        if (!bookResponse) {
            return null;
        }
        const book: IBook = bookResponse as unknown as IBook;

        if (shouldExpandAuthor && bookResponse.authorId) {

            const author = bookResponse.authorId as unknown as Author;
            book.author = author;
            book.authorId = NestHelper.getInstance().getObjectId(author._id.toString());
        }

        return book;
    }


    async update(id: string, book: Partial<Book>): Promise<Book | null> {
        if (!id) {
            return null;
        }
        const bookId = NestHelper.getInstance().getObjectId(id);
        return await this.bookModel.findByIdAndUpdate(bookId, book, { new: true }).exec();
    }

    async delete(id: string): Promise<Book | null> {
        if (!id) {
            return null;
        }
        const bookId = NestHelper.getInstance().getObjectId(id);
        return await this.bookModel.findByIdAndDelete(bookId).exec();
    }

    async runAggregate(aggregate: PipelineStage[]): Promise<any> {
        return this.bookModel.aggregate(aggregate);
    }

}