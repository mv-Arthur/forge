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
import { CreateVacancyDto } from "./dto/create-vacancy.dto.js";
import { UpdateVacancyDto } from "./dto/update-vacancy.dto.js";
import { VacanciesService } from "./vacancies.service.js";

@Controller("vacancies")
export class VacanciesController {
    constructor(private readonly vacancies: VacanciesService) {}

    @Get()
    list() {
        return this.vacancies.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.vacancies.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateVacancyDto) {
        return this.vacancies.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateVacancyDto) {
        return this.vacancies.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.vacancies.remove(slug);
    }
}
