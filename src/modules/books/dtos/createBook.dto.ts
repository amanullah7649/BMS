import { IsDateString, IsISBN, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly title: string;

    @IsISBN()
    @IsNotEmpty()
    readonly isbn: string;

    @IsDateString()
    @IsOptional()
    readonly publishedDate?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    readonly genre: string;

    @IsString()
    @IsNotEmpty()
    readonly authorId: string;
}