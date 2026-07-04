import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { SettingsService } from "./settings.service.js";

@Controller("settings")
export class SettingsController {
    constructor(private readonly settings: SettingsService) {}

    @Get()
    getAll() {
        return this.settings.getAll();
    }

    @Get(":key")
    get(@Param("key") key: string) {
        return this.settings.get(key);
    }

    @Put(":key")
    @UseGuards(JwtAuthGuard)
    update(@Param("key") key: string, @Body() value: unknown) {
        return this.settings.upsert(key, value);
    }
}
