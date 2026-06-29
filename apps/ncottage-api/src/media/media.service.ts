import { randomUUID } from "node:crypto";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { type Media as MediaRow, Prisma } from "@prisma/client";
import { imageSize } from "image-size";
import type { Media } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { StorageService } from "./storage.service.js";

export interface UploadInput {
    buffer: Buffer;
    filename: string;
    mime: string;
    folder?: string;
    alt?: string;
}

export interface ListMediaInput {
    folder?: string;
    type?: string;
    skip: number;
    take: number;
}

const MIME_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "application/pdf": ".pdf",
};

function extFor(filename: string, mime: string): string {
    const dot = filename.lastIndexOf(".");
    if (dot > 0 && dot < filename.length - 1) {
        return filename.slice(dot).toLowerCase();
    }
    return MIME_EXT[mime] ?? "";
}

function sanitizeFolder(folder: string): string {
    return folder
        .toLowerCase()
        .replace(/[^a-z0-9/_-]+/g, "-")
        .replace(/^\/+|\/+$/g, "")
        .replace(/\/{2,}/g, "/");
}

function toDomain(row: MediaRow): Media {
    return {
        id: row.id,
        key: row.key,
        url: row.url,
        filename: row.filename,
        mime: row.mime,
        size: row.size,
        width: row.width ?? undefined,
        height: row.height ?? undefined,
        alt: row.alt ?? undefined,
        folder: row.folder ?? undefined,
        createdAt: row.createdAt.toISOString(),
    };
}

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService
    ) {}

    async upload(input: UploadInput): Promise<Media> {
        const folder = input.folder ? sanitizeFolder(input.folder) : undefined;
        const key = `${folder ? `${folder}/` : ""}${randomUUID()}${extFor(
            input.filename,
            input.mime
        )}`;

        const url = await this.storage.put(key, input.buffer, input.mime);

        let width: number | undefined;
        let height: number | undefined;
        if (input.mime.startsWith("image/") && input.mime !== "image/svg+xml") {
            try {
                const dimensions = imageSize(input.buffer);
                width = dimensions.width;
                height = dimensions.height;
            } catch (error) {
                this.logger.warn(
                    `Could not read image size for ${input.filename}: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            }
        }

        const row = await this.prisma.media.create({
            data: {
                key,
                url,
                filename: input.filename,
                mime: input.mime,
                size: input.buffer.length,
                width,
                height,
                alt: input.alt,
                folder,
            },
        });
        return toDomain(row);
    }

    async list(
        input: ListMediaInput
    ): Promise<{ items: Media[]; total: number }> {
        const where: Prisma.MediaWhereInput = {};
        if (input.folder) where.folder = input.folder;
        if (input.type) where.mime = { startsWith: input.type };

        const [rows, total] = await this.prisma.$transaction([
            this.prisma.media.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.media.count({ where }),
        ]);
        return { items: rows.map(toDomain), total };
    }

    findByKey(key: string): Promise<MediaRow | null> {
        return this.prisma.media.findUnique({ where: { key } });
    }

    async remove(id: string): Promise<void> {
        const row = await this.prisma.media.findUnique({ where: { id } });
        if (!row) throw new NotFoundException("Media not found");
        // Удаление в хранилище не должно блокировать удаление записи.
        try {
            await this.storage.remove(row.key, row.mime);
        } catch (error) {
            this.logger.warn(
                `Failed to delete object ${row.key}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
        await this.prisma.media.delete({ where: { id } });
    }
}
