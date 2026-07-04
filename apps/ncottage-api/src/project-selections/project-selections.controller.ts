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
import { CreateProjectSelectionDto } from "./dto/create-project-selection.dto.js";
import { UpdateProjectSelectionDto } from "./dto/update-project-selection.dto.js";
import { ProjectSelectionsService } from "./project-selections.service.js";

@Controller("project-selections")
export class ProjectSelectionsController {
    constructor(private readonly selections: ProjectSelectionsService) {}

    @Get()
    list() {
        return this.selections.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.selections.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateProjectSelectionDto) {
        return this.selections.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(
        @Param("slug") slug: string,
        @Body() dto: UpdateProjectSelectionDto
    ) {
        return this.selections.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.selections.remove(slug);
    }
}
