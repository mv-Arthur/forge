import {
    IsBoolean,
    IsIn,
    IsOptional,
    IsString,
    Validate,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from "class-validator";
import {
    LEAD_SOURCES,
    MIN_PHONE_DIGITS,
    countPhoneDigits,
} from "@forge/shared";
import type { LeadRequest, LeadSource } from "@forge/shared";

@ValidatorConstraint({ name: "phoneDigits", async: false })
class PhoneDigitsConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        return (
            typeof value === "string" &&
            countPhoneDigits(value) >= MIN_PHONE_DIGITS
        );
    }

    defaultMessage(): string {
        return `phone must contain at least ${MIN_PHONE_DIGITS} digits`;
    }
}

export class CreateLeadDto implements LeadRequest {
    @IsIn(LEAD_SOURCES)
    source!: LeadSource;

    @IsString()
    @Validate(PhoneDigitsConstraint)
    phone!: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsString()
    preferredTime?: string;

    @IsOptional()
    @IsString()
    project?: string;

    @IsOptional()
    @IsBoolean()
    consent?: boolean;
}
