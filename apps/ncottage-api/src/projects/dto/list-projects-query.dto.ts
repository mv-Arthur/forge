import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsOptional } from "class-validator";
import {
    PROJECT_LIVING_TYPES,
    type ProjectLivingType,
    TECHNOLOGIES,
    type Technology,
} from "@forge/shared";

export class ListProjectsQueryDto {
    @IsOptional()
    @IsIn(TECHNOLOGIES)
    technology?: Technology;

    @IsOptional()
    @IsIn(PROJECT_LIVING_TYPES)
    livingType?: ProjectLivingType;

    // "true"/"false" → boolean; любое другое значение остаётся как есть и
    // отвергается @IsBoolean (400), а не молча трактуется как false.
    @IsOptional()
    @Transform(({ value }) => {
        if (value === "true" || value === true) return true;
        if (value === "false" || value === false) return false;
        return value;
    })
    @IsBoolean()
    featured?: boolean;
}
