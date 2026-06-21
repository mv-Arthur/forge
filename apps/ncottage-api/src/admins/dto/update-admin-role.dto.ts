import { IsIn } from "class-validator";
import { ROLES } from "@forge/shared";
import type { Role } from "@forge/shared";

export class UpdateAdminRoleDto {
    @IsIn(ROLES)
    role!: Role;
}
