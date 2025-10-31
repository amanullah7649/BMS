import { NestHelper } from "@common/helpers/nest.helper";
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

    async findById(id: string): Promise<Author | null> {

        if (!id) {
            return null;
        }
        const authId = NestHelper.getInstance().getObjectId(id);

        const authorDoc = await this.authorModel.findById(authId).lean().exec();
        if (!authorDoc) {
            return null;
        }
        return authorDoc as unknown as Author;
    }

    async update(id: string, author: Author): Promise<Author> {
        return this.authorModel.findByIdAndUpdate(id, author, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        return this.authorModel.findByIdAndDelete(id);
    }
}