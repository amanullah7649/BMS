import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly isbn: string;

    @IsDateString()
    @IsOptional()
    readonly publicationDate?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    readonly genre: string;

    @IsString()
    @IsNotEmpty()
    readonly authorId: string;
}