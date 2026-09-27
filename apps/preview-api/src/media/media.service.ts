import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { imageSize } from "image-size";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import {
    keyFrom,
    mimeFromExt,
    nextFilename,
    publicUrl,
    sanitizeFilename,
    sanitizeFolder,
} from "./media-path.js";
import type {
    ListMediaInput,
    MediaDto,
    UpdateMediaInput,
    UploadInput,
} from "./media.types.js";
import { toDto } from "./media.types.js";
import { StorageService } from "./storage.service.js";

function probeSize(
    buffer: Buffer,
    mime: string
): { width?: number; height?: number } {
    if (!mime.startsWith("image/") || mime === "image/svg+xml") {
        return {};
    }
    try {
        const dim = imageSize(buffer);
        return { width: dim.width, height: dim.height };
    } catch {
        return {};
    }
}

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService
    ) {}

    async list(
        input: ListMediaInput
    ): Promise<{ items: MediaDto[]; total: number }> {
        const where: Prisma.MediaWhereInput = {};
        if (input.folder === "." || input.folder === "") {
            where.folder = null;
        } else if (input.folder) {
            where.folder = sanitizeFolder(input.folder);
        }
        if (input.type) where.mime = { startsWith: input.type };
        if (input.q) {
            where.OR = [
                { filename: { contains: input.q, mode: "insensitive" } },
                { key: { contains: input.q, mode: "insensitive" } },
                { alt: { contains: input.q, mode: "insensitive" } },
            ];
        }

        const [rows, total] = await this.prisma.$transaction([
            this.prisma.media.findMany({
                where,
                orderBy: [{ folder: "asc" }, { filename: "asc" }],
                skip: input.skip,
                take: input.take,
            }),
            this.prisma.media.count({ where }),
        ]);
        return { items: rows.map(toDto), total };
    }

    async folders(): Promise<{ path: string; count: number }[]> {
        const grouped = await this.prisma.media.groupBy({
            by: ["folder"],
            _count: { _all: true },
        });
        return grouped
            .map((row) => ({
                path: row.folder ?? "",
                count: row._count._all,
            }))
            .sort((a, b) => a.path.localeCompare(b.path));
    }

    async get(id: string): Promise<MediaDto> {
        const row = await this.prisma.media.findUnique({ where: { id } });
        if (!row) throw new NotFoundException("Файл не найден");
        return toDto(row);
    }

    async upload(input: UploadInput): Promise<MediaDto> {
        const folder = input.folder ? sanitizeFolder(input.folder) : null;
        const filename = sanitizeFilename(input.filename);
        const unique = await this.uniqueFilename(folder, filename);
        const key = keyFrom(folder, unique);
        const mime = mimeFromExt(unique);
        await this.storage.put(key, input.buffer);
        const size = probeSize(input.buffer, mime);
        const row = await this.prisma.media.create({
            data: {
                key,
                url: publicUrl(key),
                filename: unique,
                mime,
                size: input.buffer.length,
                width: size.width,
                height: size.height,
                alt: input.alt?.trim() || null,
                folder,
            },
        });
        return toDto(row);
    }

    async update(id: string, patch: UpdateMediaInput): Promise<MediaDto> {
        const row = await this.prisma.media.findUnique({ where: { id } });
        if (!row) throw new NotFoundException("Файл не найден");

        const nextFolder =
            patch.folder === undefined
                ? row.folder
                : patch.folder.trim()
                  ? sanitizeFolder(patch.folder)
                  : null;
        const nextFilename =
            patch.filename === undefined
                ? row.filename
                : sanitizeFilename(patch.filename);
        const nextKey = keyFrom(nextFolder, nextFilename);
        const alt =
            patch.alt === undefined
                ? row.alt
                : patch.alt.trim()
                  ? patch.alt.trim()
                  : null;

        if (nextKey !== row.key) {
            if (await this.storage.exists(nextKey)) {
                throw new ConflictException("Файл с таким путём уже есть");
            }
            await this.storage.move(row.key, nextKey);
        }

        const updated = await this.prisma.media.update({
            where: { id },
            data: {
                key: nextKey,
                url: publicUrl(nextKey),
                filename: nextFilename,
                folder: nextFolder,
                mime: mimeFromExt(nextFilename),
                alt,
            },
        });
        return toDto(updated);
    }

    async remove(id: string): Promise<void> {
        const row = await this.prisma.media.findUnique({ where: { id } });
        if (!row) throw new NotFoundException("Файл не найден");
        try {
            await this.storage.remove(row.key);
        } catch (error) {
            this.logger.warn(
                `Disk delete failed for ${row.key}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
        await this.prisma.media.delete({ where: { id } });
    }

    private async uniqueFilename(
        folder: string | null,
        filename: string
    ): Promise<string> {
        for (let attempt = 1; attempt < 100; attempt += 1) {
            const candidate = nextFilename(filename, attempt);
            const key = keyFrom(folder, candidate);
            if (!(await this.storage.exists(key))) return candidate;
        }
        throw new ConflictException("Не удалось подобрать имя файла");
    }
}
