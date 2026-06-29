import { IsOptional, IsString } from "class-validator";

// Правка метаданных уже загруженного файла. Сам объект в хранилище не трогаем.
export class UpdateMediaDto {
    @IsOptional() @IsString() alt?: string;
}
