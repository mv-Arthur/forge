import { Type } from "class-transformer";
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";
import type {
    Service,
    ServiceDetailVariant,
    ServiceExample,
    ServiceFaqItem,
    ServiceSeoContent,
    ServiceTimingItem,
} from "@forge/shared";

class DetailVariantDto implements ServiceDetailVariant {
    @IsString() title!: string;
    @IsString() description!: string;
}

class TimingItemDto implements ServiceTimingItem {
    @IsString() label!: string;
    @IsString() value!: string;
    @IsString() description!: string;
}

class ExampleDto implements ServiceExample {
    @IsString() title!: string;
    @IsString() description!: string;
    @IsString() result!: string;
}

class FaqItemDto implements ServiceFaqItem {
    @IsString() question!: string;
    @IsString() answer!: string;
}

class SeoContentDto implements ServiceSeoContent {
    @IsString() priceNote!: string;
    @IsString() timingLead!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimingItemDto)
    timing!: TimingItemDto[];

    @IsString() examplesLead!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExampleDto)
    examples!: ExampleDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FaqItemDto)
    faq!: FaqItemDto[];
}

export class CreateServiceDto implements Service {
    @IsString() slug!: string;

    @IsInt()
    @Min(0)
    order!: number;

    @IsString() title!: string;
    @IsString() shortTitle!: string;
    @IsString() description!: string;
    @IsString() sourceTitle!: string;
    @IsString() eyebrow!: string;
    @IsString() lead!: string;
    @IsString() summary!: string;
    @IsString() image!: string;
    @IsString() cta!: string;

    @IsArray() @IsString({ each: true }) highlights!: string[];
    @IsArray() @IsString({ each: true }) scopes!: string[];
    @IsArray() @IsString({ each: true }) stages!: string[];
    @IsArray() @IsString({ each: true }) advantages!: string[];
    @IsArray() @IsString({ each: true }) fitFor!: string[];
    @IsArray() @IsString({ each: true }) includes!: string[];
    @IsArray() @IsString({ each: true }) notIncluded!: string[];
    @IsArray() @IsString({ each: true }) priceFactors!: string[];
    @IsArray() @IsString({ each: true }) deliverables!: string[];
    @IsArray() @IsString({ each: true }) quickFacts!: string[];

    @IsOptional() @IsString() detailPain?: string;
    @IsOptional() @IsString() detailPromise?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetailVariantDto)
    detailVariants!: DetailVariantDto[];

    @IsArray() @IsString({ each: true }) detailChecks!: string[];

    @IsOptional() @IsString() detailNextStep?: string;
    @IsOptional() @IsString() detailCta?: string;

    @IsArray() @IsString({ each: true }) relatedSlugs!: string[];
    @IsArray() @IsString({ each: true }) scenarioSlugs!: string[];

    @ValidateNested()
    @Type(() => SeoContentDto)
    seoContent!: SeoContentDto;
}
