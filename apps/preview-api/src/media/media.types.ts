import type { Media as MediaRow } from "@prisma/client";

export interface MediaDto {
    id: string;
    key: string;
    url: string;
    filename: string;
    mime: string;
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    folder?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadInput {
    buffer: Buffer;
    filename: string;
    mime: string;
    folder?: string;
    alt?: string;
}

export interface ListMediaInput {
    folder?: string;
    q?: string;
    type?: string;
    skip: number;
    take: number;
}

export interface UpdateMediaInput {
    alt?: string;
    folder?: string;
    filename?: string;
}

export function toDto(row: MediaRow): MediaDto {
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
        updatedAt: row.updatedAt.toISOString(),
    };
}
