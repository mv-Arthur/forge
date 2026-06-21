import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListMediaQueryDto {
    @IsOptional()
    @IsString()
    folder?: string;

    // Префикс mime для фильтра по типу, напр. "image/" или "application/pdf".
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(200)
    take?: number;
}
