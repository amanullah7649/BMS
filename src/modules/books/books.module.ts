import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from '../authors/authors.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema
      }
    ]),
    AuthorsModule
  ],
  providers: [BooksService, BooksRepository],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BooksModule { }
