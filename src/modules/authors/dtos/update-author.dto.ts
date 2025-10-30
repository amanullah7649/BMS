import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for updating an existing author
 */
export class UpdateAuthorDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MaxLength(50)
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MaxLength(50)
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @MaxLength(500)
  readonly bio?: string;

  @IsDateString()
  @IsOptional()
  readonly birthDate?: string;
}
