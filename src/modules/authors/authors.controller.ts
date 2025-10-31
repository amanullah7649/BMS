import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { QueryAuthorDto } from './dtos/query-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { IPaginatedAuthorsResponse } from './interfaces/author.interface';
import { Author } from './schemas/author.schema';

@Controller('authors')
export class AuthorsController {

    constructor(
        private readonly authorsService: AuthorsService
    ) { }

    @Post()
    async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
        return this.authorsService.create(createAuthorDto);
    }

    @Get()
    async findAll(@Query() queryDto: QueryAuthorDto): Promise<IPaginatedAuthorsResponse> {
        return this.authorsService.findAll(queryDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Author> {
        return this.authorsService.findById(id);
    }


    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAuthorDto: UpdateAuthorDto,
    ): Promise<Author> {
        return this.authorsService.update(id, updateAuthorDto);
    }


    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.authorsService.remove(id);
    }
}
