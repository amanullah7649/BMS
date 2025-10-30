import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { QueryAuthorDto } from './dtos/query-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { IPaginatedAuthorsResponse } from './interfaces/author.interface';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private readonly AuthorModel: Model<Author>
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

    const author = await this.AuthorModel.create(authorPayload);
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

    const author = await this.AuthorModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

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

    const [result] = await this.AuthorModel.aggregate([
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
    ]).exec();

    const data = result?.data ?? [];
    const count = result?.totalCount?.[0]?.count ?? 0;

    return { data, count };
  }

  /**
   * Find a single author by ID
   */
  async findOne(id: string): Promise<Author> {
    const author = await this.AuthorModel.findById(id).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }



  /**
   * Delete an author by ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.AuthorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }


}
