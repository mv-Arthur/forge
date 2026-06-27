import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { ListMediaQueryDto } from "./dto/list-media-query.dto.js";
import { MediaService } from "./media.service.js";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];
// SVG исполняет скрипты при inline-просмотре (stored XSS), поэтому запрещён,
// несмотря на префикс image/.
const BLOCKED_MIMES = ["image/svg+xml"];

function fieldStr(field: unknown): string | undefined {
    const one = Array.isArray(field) ? field[0] : field;
    const value = (one as { value?: unknown } | undefined)?.value;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

@Controller("media")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
    constructor(private readonly media: MediaService) {}

    @Get()
    list(@Query() query: ListMediaQueryDto) {
        return this.media.list({
            folder: query.folder,
            type: query.type,
            skip: query.skip ?? 0,
            take: query.take ?? 50,
        });
    }

    @Post()
    async upload(@Req() req: FastifyRequest) {
        const file = await req.file({
            limits: { fileSize: MAX_UPLOAD_BYTES },
        });
        if (!file) {
            throw new BadRequestException("Файл не передан");
        }
        if (
            BLOCKED_MIMES.includes(file.mimetype) ||
            !ALLOWED_MIME_PREFIXES.some((prefix) =>
                file.mimetype.startsWith(prefix)
            )
        ) {
            throw new BadRequestException(
                "Недопустимый тип файла (растровые изображения и PDF; SVG не поддерживается)"
            );
        }

        const buffer = await file.toBuffer();
        if (file.file.truncated) {
            throw new BadRequestException("Файл превышает 15 МБ");
        }

        return this.media.upload({
            buffer,
            filename: file.filename,
            mime: file.mimetype,
            folder: fieldStr(file.fields.folder),
            alt: fieldStr(file.fields.alt),
        });
    }

    @Delete(":id")
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("id") id: string) {
        return this.media.remove(id);
    }
}
