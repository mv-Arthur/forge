import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class ListProjectsQueryDto {
    @IsOptional()
    @IsString()
    technology?: string;

    @IsOptional()
    @IsString()
    livingType?: string;

    @IsOptional()
    @Transform(({ value }) => value === "true" || value === true)
    @IsBoolean()
    featured?: boolean;
}
