import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { CreateFaqItemDto } from "./dto/create-faq-item.dto.js";
import { UpdateFaqItemDto } from "./dto/update-faq-item.dto.js";
import { FaqService } from "./faq.service.js";

@Controller("faq")
export class FaqController {
    constructor(private readonly faq: FaqService) {}

    @Get()
    list() {
        return this.faq.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.faq.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateFaqItemDto) {
        return this.faq.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateFaqItemDto) {
        return this.faq.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.faq.remove(slug);
    }
}
