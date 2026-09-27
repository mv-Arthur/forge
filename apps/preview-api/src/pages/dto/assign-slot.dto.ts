import { IsString, MinLength } from "class-validator";

export class AssignSlotDto {
    @IsString()
    @MinLength(1)
    mediaId!: string;
}
