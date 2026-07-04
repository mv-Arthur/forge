import {
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";
import { ROLES } from "@forge/shared";
import type { Role } from "@forge/shared";

export class CreateAdminDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsIn(ROLES)
    role!: Role;

    @IsOptional()
    @IsString()
    name?: string;
}
