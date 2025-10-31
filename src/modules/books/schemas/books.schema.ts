import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Author } from "src/modules/authors/schemas/author.schema";


@Schema({ timestamps: true })
export class Book extends Document {

    @Prop({
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title must not exceed 100 characters"],
    })
    title: string;

    @Prop({
        type: String,
        required: [true, "ISBN is required"],
        trim: true,
        maxlength: [50, "ISBN must not exceed 50 characters"],
    })
    isbn: string;

    @Prop({
        type: Date,
        required: false,
        default: null,
    })
    publicationDate?: Date;
    @Prop({
        type: String,
        required: [true, "Publisher is required"],
        trim: true,
        maxlength: [100, "Publisher must not exceed 100 characters"],
    })
    genre: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Author.name,
        required: [true, "Author is required"],
    })
    author: Author;

}


export const BookSchema = SchemaFactory.createForClass(Book);