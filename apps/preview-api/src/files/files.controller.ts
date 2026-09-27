import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { mimeFromExt } from "../media/media-path.js";
import { StorageService } from "../media/storage.service.js";

@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly storage: StorageService) {}

    @Get()
    async get(@Query("key") key: string, @Res() reply: FastifyReply) {
        if (!key?.trim()) {
            throw new BadRequestException("key обязателен");
        }
        try {
            const buf = await this.storage.read(key);
            reply
                .header("Content-Type", mimeFromExt(key))
                .header("Cache-Control", "public, max-age=0, must-revalidate")
                .send(buf);
        } catch {
            throw new NotFoundException("Файл не найден");
        }
    }
}
