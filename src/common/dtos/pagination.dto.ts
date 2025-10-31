import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Base pagination DTO with default values
 */
export abstract class PaginationDto {
    /**
     * Page number (default: 1)
     */
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return 1;
        const parsed = Number(value);
        return isNaN(parsed) ? 1 : parsed;
    })
    @IsInt()
    @Min(1)
    readonly page?: number;

    /**
     * Number of items per page (default: 10, max: 200)
     */
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return 10;
        const parsed = Number(value);
        return isNaN(parsed) ? 10 : parsed;
    })
    @IsInt()
    @Min(1)
    @Max(200)
    readonly limit?: number;
}
