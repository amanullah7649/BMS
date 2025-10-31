import { Injectable, NotFoundException } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { QueryAuthorDto } from './dtos/query-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { IPaginatedAuthorsResponse } from './interfaces/author.interface';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorRepository: AuthorRepository
  ) { }


  /**
   * Create a new author
   */
  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {

    const authorPayload = {

      firstName: createAuthorDto.firstName ?? "",
      lastName: createAuthorDto.lastName ?? "",
      bio: createAuthorDto.bio ?? "",
      birthDate: createAuthorDto.birthDate ? new Date(createAuthorDto.birthDate) : undefined,
    }

    const author = await this.authorRepository.create(authorPayload);
    return author;
  }
  /**
    * Update an existing author
    */
  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {

    const updateData: any = { ...updateAuthorDto };

    if (updateAuthorDto.birthDate) {
      updateData.birthDate = new Date(updateAuthorDto.birthDate);
    }

    const author = await this.authorRepository.update(id, updateData);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }


  async findAll(queryDto: QueryAuthorDto): Promise<IPaginatedAuthorsResponse> {

    const { page = 1, limit = 10, firstName, lastName } = queryDto;
    const skip = (page - 1) * limit;

    // Build search filter
    const filter: any = {};
    if (firstName) {
      filter.firstName = { $regex: firstName, $options: 'i' };
    }
    if (lastName) {
      filter.lastName = { $regex: lastName, $options: 'i' };
    }

    const aggregate: PipelineStage[] = [
      { $match: filter },
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
    ]

    const [result] = await this.authorRepository.runAggregate(aggregate);

    const data = result?.data ?? [];
    const count = result?.totalCount?.[0]?.count ?? 0;

    return { data, count };
  }

  /**
   * Find a single author by ID
   */
  async findById(id: string): Promise<Author> {


    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }



  /**
   * Delete an author by ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.authorRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }


}
