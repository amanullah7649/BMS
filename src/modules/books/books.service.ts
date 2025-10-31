import { Injectable } from '@nestjs/common';
import { AuthorsService } from '../authors/authors.service';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
    constructor(
        private readonly booksRepository: BooksRepository,
        private readonly authorsService: AuthorsService
    ) { }
}
