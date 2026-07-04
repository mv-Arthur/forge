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
import { CreateServiceScenarioDto } from "./dto/create-service-scenario.dto.js";
import { UpdateServiceScenarioDto } from "./dto/update-service-scenario.dto.js";
import { ServiceScenariosService } from "./service-scenarios.service.js";

@Controller("service-scenarios")
export class ServiceScenariosController {
    constructor(private readonly scenarios: ServiceScenariosService) {}

    @Get()
    list() {
        return this.scenarios.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.scenarios.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateServiceScenarioDto) {
        return this.scenarios.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateServiceScenarioDto) {
        return this.scenarios.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.scenarios.remove(slug);
    }
}
