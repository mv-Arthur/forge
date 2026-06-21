import { Controller, Get, Param, Query } from "@nestjs/common";
import { ListProjectsQueryDto } from "./dto/list-projects-query.dto.js";
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
}
