import { IsArray, IsInt, IsString, Min } from "class-validator";
import type { Vacancy } from "@forge/shared";

export class CreateVacancyDto implements Vacancy {
    @IsString() slug!: string;
    @IsInt() @Min(0) order!: number;
    @IsString() title!: string;
    @IsString() intro!: string;
    @IsString() salary!: string;
    @IsString() experience!: string;

    @IsArray()
    @IsString({ each: true })
    requirements!: string[];

    @IsArray()
    @IsString({ each: true })
    conditions!: string[];
}
