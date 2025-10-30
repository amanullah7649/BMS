import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Author } from "./schemas/author.schema";


@Injectable()
export class AuthorRepository {
    constructor(
        @InjectModel(Author.name)
        private readonly authorModel: Model<Author>,
    ) { }

    async create(author: Partial<Author>): Promise<Author> {
        return this.authorModel.create(author);
    }

    async findAll(): Promise<Author[]> {
        return this.authorModel.find();
    }

    async runAggregate(aggregate: PipelineStage[]): Promise<any> {
        return this.authorModel.aggregate(aggregate);
    }

    async findOne(id: string): Promise<Author> {
        return this.authorModel.findById(id);
    }

    async update(id: string, author: Author): Promise<Author> {
        return this.authorModel.findByIdAndUpdate(id, author, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        return this.authorModel.findByIdAndDelete(id);
    }
}