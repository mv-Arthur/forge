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
import { CreatePartnerDto } from "./dto/create-partner.dto.js";
import { UpdatePartnerDto } from "./dto/update-partner.dto.js";
import { PartnersService } from "./partners.service.js";

@Controller("partners")
export class PartnersController {
    constructor(private readonly partners: PartnersService) {}

    @Get()
    list() {
        return this.partners.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.partners.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreatePartnerDto) {
        return this.partners.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdatePartnerDto) {
        return this.partners.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.partners.remove(slug);
    }
}
