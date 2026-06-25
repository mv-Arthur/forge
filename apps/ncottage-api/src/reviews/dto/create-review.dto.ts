import { IsBoolean, IsOptional, IsString } from "class-validator";

// id не принимаем от клиента — генерируется БД (cuid). Сид задаёт id явно.
export class CreateReviewDto {
    @IsString() author!: string;
    @IsString() date!: string;
    @IsString() text!: string;

    @IsOptional() @IsString() type?: string;
    @IsOptional() @IsString() image?: string;
    @IsOptional() @IsString() videoUrl?: string;
    @IsOptional() @IsBoolean() featured?: boolean;
}
