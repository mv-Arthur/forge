import { IsOptional, IsString } from "class-validator";
import type { Partner } from "@forge/shared";

export class CreatePartnerDto implements Partner {
    @IsString() slug!: string;
    @IsString() name!: string;
    @IsString() category!: string;

    @IsOptional()
    @IsString()
    href?: string;
}
