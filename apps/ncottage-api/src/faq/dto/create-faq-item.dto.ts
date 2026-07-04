import { IsInt, IsString, Min } from "class-validator";
import type { FaqItem } from "@forge/shared";

export class CreateFaqItemDto implements FaqItem {
    @IsString() slug!: string;
    @IsInt() @Min(0) order!: number;
    @IsString() question!: string;
    @IsString() answer!: string;
    @IsString() group!: string;
}
