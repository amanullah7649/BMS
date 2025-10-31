import { Transform } from 'class-transformer';
import { IsDateString, IsISBN, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for updating an existing book
 */
export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  readonly title?: string;

  @IsISBN()
  @IsOptional()
  readonly isbn?: string;

  @IsDateString()
  @IsOptional()
  readonly publishedDate?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  readonly genre?: string;

  @IsMongoId()
  @IsOptional()
  readonly authorId?: string;
}
