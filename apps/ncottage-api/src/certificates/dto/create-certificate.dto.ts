import { IsString } from "class-validator";
import type { Certificate } from "@forge/shared";

export class CreateCertificateDto implements Certificate {
    @IsString() slug!: string;
    @IsString() title!: string;
}
