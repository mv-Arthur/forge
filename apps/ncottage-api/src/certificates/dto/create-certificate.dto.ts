import { IsInt, IsOptional, IsString, Min } from "class-validator";
import type { Certificate } from "@forge/shared";

export class CreateCertificateDto implements Certificate {
    @IsString() slug!: string;
    @IsInt() @Min(0) order!: number;
    @IsString() title!: string;

    @IsOptional() @IsString() imageUrl?: string;
    @IsOptional() @IsString() fileUrl?: string;
}
