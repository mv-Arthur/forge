import { Body, Controller, Post } from "@nestjs/common";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import { LeadsService } from "./leads.service.js";

@Controller("leads")
export class LeadsController {
    constructor(private readonly leads: LeadsService) {}

    @Post()
    async create(@Body() dto: CreateLeadDto) {
        await this.leads.create(dto);
        return { ok: true };
    }
}
