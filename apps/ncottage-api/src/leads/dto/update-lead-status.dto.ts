import { IsIn } from "class-validator";

export const LEAD_STATUSES = ["new", "contacted", "archived"] as const;
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export class UpdateLeadStatusDto {
    @IsIn(LEAD_STATUSES)
    status!: LeadStatusValue;
}
