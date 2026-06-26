import { IsString } from "class-validator";

export class UpdatePageMetaDto {
    @IsString() title!: string;
    @IsString() seoTitle!: string;
    @IsString() seoDescription!: string;
}
