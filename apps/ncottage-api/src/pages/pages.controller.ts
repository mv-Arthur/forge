import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UpdatePageMetaDto } from "./dto/update-page-meta.dto.js";
import { PagesService } from "./pages.service.js";

@Controller("pages")
export class PagesController {
    constructor(private readonly pages: PagesService) {}

    @Get()
    list() {
        return this.pages.list();
    }

    @Get(":key")
    getOne(@Param("key") key: string) {
        return this.pages.getByKey(key);
    }

    @Put(":key/meta")
    @UseGuards(JwtAuthGuard)
    updateMeta(@Param("key") key: string, @Body() dto: UpdatePageMetaDto) {
        return this.pages.updateMeta(key, dto);
    }

    @Put(":key/sections/:id")
    @UseGuards(JwtAuthGuard)
    updateSection(
        @Param("key") key: string,
        @Param("id") id: string,
        @Body() data: unknown
    ) {
        return this.pages.updateSection(key, id, data);
    }
}
