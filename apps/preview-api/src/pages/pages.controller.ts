import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AssignSlotDto } from "./dto/assign-slot.dto.js";
import { PagesService } from "./pages.service.js";

@Controller("pages")
export class PagesController {
    constructor(private readonly pages: PagesService) {}

    @Get("home")
    getHome() {
        return this.pages.getHome();
    }

    @Put("home/:slot")
    @UseGuards(JwtAuthGuard)
    assign(@Param("slot") slot: string, @Body() dto: AssignSlotDto) {
        return this.pages.assign(slot, dto.mediaId);
    }

    @Delete("home/:slot")
    @UseGuards(JwtAuthGuard)
    clear(@Param("slot") slot: string) {
        return this.pages.clear(slot);
    }
}
