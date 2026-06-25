import { IsArray, IsString } from "class-validator";
import type { Promo } from "@forge/shared";

export class CreatePromoDto implements Promo {
    @IsString() slug!: string;
    @IsString() title!: string;
    @IsString() shortTitle!: string;
    @IsString() eyebrow!: string;
    @IsString() lead!: string;
    @IsString() price!: string;
    @IsString() priceNote!: string;
    @IsString() period!: string;
    @IsString() projectsHref!: string;

    @IsArray()
    @IsString({ each: true })
    terms!: string[];

    @IsArray()
    @IsString({ each: true })
    includes!: string[];

    @IsArray()
    @IsString({ each: true })
    details!: string[];
}
