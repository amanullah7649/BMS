import { PaginationDto } from '@common/dtos/pagination.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object for query parameters when fetching authors
 */
export class QueryAuthorDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  readonly lastName?: string;
}
