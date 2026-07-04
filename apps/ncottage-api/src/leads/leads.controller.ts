import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ClientIpThrottlerGuard } from "../common/client-ip-throttler.guard.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto.js";
import { LeadsService } from "./leads.service.js";

@Controller("leads")
export class LeadsController {
    constructor(private readonly leads: LeadsService) {}

    // Публичная форма: жёсткий лимит против флуда БД и канала доставки.
    @Post()
    @UseGuards(ClientIpThrottlerGuard)
    @Throttle({ default: { limit: 8, ttl: 60_000 } })
    async create(@Body() dto: CreateLeadDto) {
        await this.leads.create(dto);
        return { ok: true };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    list() {
        return this.leads.list();
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    updateStatus(@Param("id") id: string, @Body() dto: UpdateLeadStatusDto) {
        return this.leads.updateStatus(id, dto.status);
    }

    @Post(":id/redeliver")
    @UseGuards(JwtAuthGuard)
    redeliver(@Param("id") id: string) {
        return this.leads.redeliver(id);
    }
}
