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
import { CreatePromoDto } from "./dto/create-promo.dto.js";
import { UpdatePromoDto } from "./dto/update-promo.dto.js";
import { PromosService } from "./promos.service.js";

@Controller("promos")
export class PromosController {
    constructor(private readonly promos: PromosService) {}

    @Get()
    list() {
        return this.promos.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.promos.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreatePromoDto) {
        return this.promos.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdatePromoDto) {
        return this.promos.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.promos.remove(slug);
    }
}
