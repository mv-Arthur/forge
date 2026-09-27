import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ListMediaQueryDto } from "./dto/list-media-query.dto.js";
import { UpdateMediaDto } from "./dto/update-media.dto.js";
import { isAllowedExt } from "./media-path.js";
import { MediaService } from "./media.service.js";

const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;

function fieldStr(field: unknown): string | undefined {
    const one = Array.isArray(field) ? field[0] : field;
    const value = (one as { value?: unknown } | undefined)?.value;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

@Controller("media")
@UseGuards(JwtAuthGuard)
export class MediaController {
    constructor(private readonly media: MediaService) {}

    @Get()
    list(@Query() query: ListMediaQueryDto) {
        return this.media.list({
            folder: query.folder,
            q: query.q,
            type: query.type,
            skip: query.skip ?? 0,
            take: query.take ?? 200,
        });
    }

    @Get("folders")
    folders() {
        return this.media.folders();
    }

    @Get(":id")
    get(@Param("id") id: string) {
        return this.media.get(id);
    }

    @Post()
    async upload(@Req() req: FastifyRequest) {
        const file = await req.file({
            limits: { fileSize: MAX_UPLOAD_BYTES },
        });
        if (!file) {
            throw new BadRequestException("Файл не передан");
        }
        if (!isAllowedExt(file.filename)) {
            throw new BadRequestException("Недопустимый тип файла");
        }
        const buffer = await file.toBuffer();
        if (file.file.truncated) {
            throw new BadRequestException("Файл превышает 40 МБ");
        }
        return this.media.upload({
            buffer,
            filename: file.filename,
            mime: file.mimetype,
            folder: fieldStr(file.fields.folder),
            alt: fieldStr(file.fields.alt),
        });
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateMediaDto) {
        return this.media.update(id, dto);
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id") id: string) {
        return this.media.remove(id);
    }
}
