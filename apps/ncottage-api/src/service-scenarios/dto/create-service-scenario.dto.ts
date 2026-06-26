import { Type } from "class-transformer";
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";
import type { ServiceScenario, ServiceScenarioPlan } from "@forge/shared";

class ScenarioPlanDto implements ServiceScenarioPlan {
    @IsString() title!: string;
    @IsString() resultLabel!: string;
    @IsString() visualTitle!: string;
    @IsString() visualCaption!: string;
    @IsString() image!: string;
    @IsString() startLabel!: string;
    @IsOptional() @IsString() startText?: string;
    @IsString() nextLabel!: string;
    @IsString() nextText!: string;
    @IsString() optionalLabel!: string;
    @IsString() optionalText!: string;
    @IsString() ctaText!: string;
}

export class CreateServiceScenarioDto implements ServiceScenario {
    @IsString() slug!: string;

    @IsInt()
    @Min(0)
    order!: number;

    @IsString() title!: string;
    @IsString() description!: string;
    @IsString() questionLabel!: string;

    @IsOptional() @IsString() pain?: string;
    @IsOptional() @IsString() promise?: string;
    @IsOptional() @IsString() outcome?: string;
    @IsOptional() @IsString() cta?: string;

    @IsString() nextStep!: string;

    @IsArray() @IsString({ each: true }) serviceSlugs!: string[];
    @IsArray() @IsString({ each: true }) primaryServiceSlugs!: string[];
    @IsArray() @IsString({ each: true }) nextServiceSlugs!: string[];
    @IsArray() @IsString({ each: true }) optionalServiceSlugs!: string[];

    @ValidateNested()
    @Type(() => ScenarioPlanDto)
    plan!: ScenarioPlanDto;
}
