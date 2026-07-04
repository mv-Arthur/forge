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
import { BuiltObjectsService } from "./built-objects.service.js";
import { CreateBuiltObjectDto } from "./dto/create-built-object.dto.js";
import { UpdateBuiltObjectDto } from "./dto/update-built-object.dto.js";

@Controller("built-objects")
export class BuiltObjectsController {
    constructor(private readonly builtObjects: BuiltObjectsService) {}

    @Get()
    list() {
        return this.builtObjects.list();
    }

    @Get(":id")
    getOne(@Param("id") id: string) {
        return this.builtObjects.getBySlug(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateBuiltObjectDto) {
        return this.builtObjects.create(dto);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(@Param("id") id: string, @Body() dto: UpdateBuiltObjectDto) {
        return this.builtObjects.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("id") id: string) {
        return this.builtObjects.remove(id);
    }
}
