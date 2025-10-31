import { Author } from "src/modules/authors/schemas/author.schema";
import { Book } from "../schemas/books.schema";

/**
 * Paginated books response interface
 */
export interface IBooksRes {
    readonly data: Book[];
    readonly count: number;
}

export interface IBook extends Book {
    author?: Author;
}