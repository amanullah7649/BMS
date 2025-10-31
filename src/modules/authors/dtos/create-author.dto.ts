import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new author
 */
export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly bio?: string;

  @IsDateString()
  @IsOptional()
  readonly birthDate?: string;
}
