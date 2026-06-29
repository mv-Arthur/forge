import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Query,
    Res,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { MediaService } from "./media.service.js";
import { StorageService } from "./storage.service.js";

// Публичный доступ к файлам по стабильному ключу. Картинки лежат в публичном
// бакете (редирект на прямой url); не-картинки — в приватном, отдаются по
// временному signed URL. Так приватные PDF не лежат в world-readable бакете.
@Controller("media")
export class MediaPublicController {
    constructor(
        private readonly media: MediaService,
        private readonly storage: StorageService
    ) {}

    @Get("raw")
    async raw(
        @Query("key") key: string,
        @Res() reply: FastifyReply
    ): Promise<void> {
        if (!key) throw new BadRequestException("key обязателен");
        const row = await this.media.findByKey(key);
        if (!row) throw new NotFoundException("Media not found");

        const url = this.storage.isPublicType(row.mime)
            ? this.storage.urlFor(row.key)
            : await this.storage.signedDownloadUrl(
                  row.key,
                  row.filename,
                  row.mime
              );
        reply.code(302).header("location", url).send();
    }
}
