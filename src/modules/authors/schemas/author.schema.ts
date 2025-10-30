import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Author Schema for MongoDB
 * Based on REQUIREMENT.md specifications
 */
@Schema({ timestamps: true })
export class Author extends Document {
    @Prop({
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name must not exceed 50 characters'],
    })
    firstName: string;

    @Prop({
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name must not exceed 50 characters'],
    })
    lastName: string;

    @Prop({
        required: false,
        trim: true,
        maxlength: [500, 'Bio must not exceed 500 characters'],
        default: null,
    })
    bio?: string;

    @Prop({
        required: false,
        type: Date,
        default: null,
    })
    birthDate?: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
