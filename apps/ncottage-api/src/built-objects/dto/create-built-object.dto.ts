import { Type } from "class-transformer";
import {
    IsInt,
    IsOptional,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested,
} from "class-validator";
import type { BuiltObject } from "@forge/shared";

class CoordsDto {
    @IsNumber() @Min(-90) @Max(90) lat!: number;
    @IsNumber() @Min(-180) @Max(180) lng!: number;
}

export class CreateBuiltObjectDto implements BuiltObject {
    @IsString() id!: string;
    @IsString() title!: string;
    @IsString() image!: string;
    @IsString() href!: string;

    @IsOptional() @IsInt() @Min(0) area?: number;
    @IsOptional() @IsString() location?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CoordsDto)
    coords?: CoordsDto;
}
