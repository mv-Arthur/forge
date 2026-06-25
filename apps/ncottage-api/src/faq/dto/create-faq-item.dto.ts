import { IsString } from "class-validator";
import type { FaqItem } from "@forge/shared";

export class CreateFaqItemDto implements FaqItem {
    @IsString() slug!: string;
    @IsString() question!: string;
    @IsString() answer!: string;
    @IsString() group!: string;
}
