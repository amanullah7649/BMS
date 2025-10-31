import { PaginationDto } from '@common/dtos/pagination.dto';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

/**
 * Data Transfer Object for query parameters when fetching books
 */
export class QueryBookDto extends PaginationDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    readonly title?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    readonly isbn?: string;

    @IsOptional()
    @IsMongoId()
    readonly authorId?: string;
}
