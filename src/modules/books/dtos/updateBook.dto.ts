import { Transform } from 'class-transformer';
import { IsDateString, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for updating an existing book
 */
export class UpdateBookDto {
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @MaxLength(100)
    readonly title?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @MaxLength(50)
    readonly isbn?: string;

    @IsDateString()
    @IsOptional()
    readonly publicationDate?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @MaxLength(100)
    readonly genre?: string;

    @IsMongoId()
    @IsOptional()
    readonly authorId?: string;
}
