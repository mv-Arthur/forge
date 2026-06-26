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
    TECHNOLOGIES,
} from "@forge/shared";
import type {
    Project,
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@forge/shared";

class SpecsDto {
    @IsString() dimensions!: string;
    @IsString() roofType!: string;
    @IsString() foundation!: string;
    @IsString() wallMaterial!: string;
    @IsString() buildTime!: string;
}

class RoomDto {
    @IsString() name!: string;
    @IsInt() @Min(0) area!: number;
}

class FloorPlanDto {
    @IsString() label!: string;
    @IsString() image!: string;
    @IsOptional() @IsInt() @Min(0) area?: number;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RoomDto)
    rooms?: RoomDto[];
}

class PackageIncludeDto {
    @IsString() label!: string;
    @IsString() value!: string;
}

class PackageDto {
    @IsString() name!: string;
    @IsInt() @Min(0) price!: number;
    @IsOptional() @IsString() tagline?: string;
    @IsOptional() @IsBoolean() highlighted?: boolean;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageIncludeDto)
    includes!: PackageIncludeDto[];
}

class OptionDto {
    @IsString() label!: string;
    @IsInt() @Min(0) price!: number;
    @IsOptional() @IsString() note?: string;
}

export class CreateProjectDto implements Project {
    @IsString() slug!: string;
    @IsString() name!: string;
    @IsIn(TECHNOLOGIES) technology!: Technology;
    @IsInt() @Min(0) area!: number;
    @IsInt() @Min(0) floors!: number;
    @IsInt() @Min(0) bedrooms!: number;
    @IsInt() @Min(0) bathrooms!: number;
    @IsInt() @Min(0) price!: number;
    @IsString() image!: string;

    @IsArray()
    @IsString({ each: true })
    images!: string[];

    @IsString() description!: string;

    @ValidateNested()
    @Type(() => SpecsDto)
    specs!: SpecsDto;

    @IsIn(PROJECT_STYLES) style!: ProjectStyle;

    @IsArray()
    @IsIn(PROJECT_FEATURES, { each: true })
    features!: ProjectFeature[];

    @IsIn(PROJECT_LIVING_TYPES) livingType!: ProjectLivingType;

    @IsBoolean() featured!: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FloorPlanDto)
    floorPlans?: FloorPlanDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PackageDto)
    packages?: PackageDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    options?: OptionDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    relatedObjectIds?: string[];

    @IsOptional()
    @IsString()
    pdfUrl?: string;

    @IsOptional() @IsString() seoTitle?: string;
    @IsOptional() @IsString() seoDescription?: string;
}
