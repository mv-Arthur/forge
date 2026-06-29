import { IsInt, IsOptional, IsString, Min } from "class-validator";
import type { Partner } from "@forge/shared";

export class CreatePartnerDto implements Partner {
    @IsString() slug!: string;
    @IsInt() @Min(0) order!: number;
    @IsString() name!: string;
    @IsString() category!: string;

    @IsOptional()
    @IsString()
    href?: string;
}
