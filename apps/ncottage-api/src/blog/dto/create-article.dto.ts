import { Type } from "class-transformer";
import {
    IsArray,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import type { Article, ArticleSection } from "@forge/shared";

class SectionDto implements ArticleSection {
    @IsString() title!: string;

    @IsArray()
    @IsString({ each: true })
    body!: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    list?: string[];
}

export class CreateArticleDto implements Article {
    @IsString() slug!: string;
    @IsString() title!: string;
    @IsString() description!: string;
    @IsString() category!: string;
    @IsString() date!: string;
    @IsString() readTime!: string;
    @IsString() heroNote!: string;

    @IsOptional() @IsString() image?: string;

    @IsArray()
    @IsString({ each: true })
    highlights!: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SectionDto)
    sections!: SectionDto[];

    @IsArray()
    @IsString({ each: true })
    checklist!: string[];

    @IsArray()
    @IsString({ each: true })
    relatedSlugs!: string[];

    @IsOptional() @IsString() seoTitle?: string;
    @IsOptional() @IsString() seoDescription?: string;
}
