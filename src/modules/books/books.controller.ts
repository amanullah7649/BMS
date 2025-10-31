import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/createBook.dto';
import { QueryBookDto } from './dtos/queryBook.dto';
import { UpdateBookDto } from './dtos/updateBook.dto';
import { IBook, IBooksRes } from './interfaces/book.interface';
import { Book } from './schemas/books.schema';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return await this.booksService.create(createBookDto);
    }

    @Get()
    async findAll(@Query() queryDto: QueryBookDto): Promise<IBooksRes> {
        return await this.booksService.findAll(queryDto);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Query('expand') expand: string
    ): Promise<IBook> {
        return await this.booksService.findOne(id, expand);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBookDto: UpdateBookDto,
    ): Promise<Book> {
        return await this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return await this.booksService.remove(id);
    }

}
