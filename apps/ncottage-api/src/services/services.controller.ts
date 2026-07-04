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
import { CreateServiceDto } from "./dto/create-service.dto.js";
import { UpdateServiceDto } from "./dto/update-service.dto.js";
import { ServicesService } from "./services.service.js";

@Controller("services")
export class ServicesController {
    constructor(private readonly services: ServicesService) {}

    @Get()
    list() {
        return this.services.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.services.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateServiceDto) {
        return this.services.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateServiceDto) {
        return this.services.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.services.remove(slug);
    }
}
