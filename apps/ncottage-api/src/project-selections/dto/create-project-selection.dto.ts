import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";
import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    SELECTION_GROUPS,
} from "@forge/shared";
import type {
    ProjectFeature,
    ProjectLivingType,
    ProjectSelection,
    ProjectStyle,
    SelectionFilter,
    SelectionGroup,
} from "@forge/shared";

class SelectionFilterDto implements SelectionFilter {
    @IsIn(["all", "match"]) mode!: "all" | "match";

    @IsOptional() @IsBoolean() matchAny?: boolean;

    @IsOptional() @IsIn(PROJECT_LIVING_TYPES) livingType?: ProjectLivingType;
    @IsOptional() @IsInt() @Min(1) floors?: number;
    @IsOptional() @IsInt() @Min(1) areaMax?: number;
    @IsOptional() @IsIn(PROJECT_STYLES) style?: ProjectStyle;

    @IsOptional()
    @IsArray()
    @IsIn(PROJECT_STYLES, { each: true })
    styleIn?: ProjectStyle[];

    @IsOptional()
    @IsArray()
    @IsIn(PROJECT_FEATURES, { each: true })
    featuresAll?: ProjectFeature[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    descriptionIncludes?: string[];
}

export class CreateProjectSelectionDto implements ProjectSelection {
    @IsString() slug!: string;
    @IsIn(SELECTION_GROUPS) group!: SelectionGroup;
    @IsString() title!: string;
    @IsString() shortTitle!: string;
    @IsString() description!: string;
    @IsString() metaDescription!: string;

    @ValidateNested()
    @Type(() => SelectionFilterDto)
    filter!: SelectionFilterDto;
}
