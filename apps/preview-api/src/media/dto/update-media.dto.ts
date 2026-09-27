import { IsOptional, IsString } from "class-validator";

export class UpdateMediaDto {
    @IsOptional()
    @IsString()
    alt?: string;

    @IsOptional()
    @IsString()
    folder?: string;

    @IsOptional()
    @IsString()
    filename?: string;
}
