import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { CreateProjectDto } from "./dto/create-project.dto.js";
import { ListProjectsQueryDto } from "./dto/list-projects-query.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";
import { ProjectsService } from "./projects.service.js";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projects: ProjectsService) {}

    @Get()
    list(@Query() query: ListProjectsQueryDto) {
        return this.projects.list(query);
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.projects.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateProjectDto) {
        return this.projects.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateProjectDto) {
        return this.projects.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.projects.remove(slug);
    }
}
