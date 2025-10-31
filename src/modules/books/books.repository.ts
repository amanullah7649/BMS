import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

    async findById(id: string): Promise<Book> {
        return await this.bookModel.findById(id).exec();
    }

    async update(id: string, book: Partial<Book>): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
    }

    async delete(id: string): Promise<Book> {
        return await this.bookModel.findByIdAndDelete(id).exec();
    }

}