import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { toDto, type MediaDto } from "../media/media.types.js";
import { HOME_SLOTS, isHomeSlot } from "./home-slots.js";

export type SlotMedia = {
    url: string;
    key: string;
    alt?: string;
    id: string;
};

@Injectable()
export class PagesService {
    constructor(private readonly prisma: PrismaService) {}

    async getHome() {
        const rows = await this.prisma.pageSlot.findMany({
            where: { page: "home" },
            include: { media: true },
        });
        const bySlot = new Map(rows.map((row) => [row.slot, row]));
        const groups: {
            group: string;
            slots: {
                slot: string;
                label: string;
                cluster?: string;
                media: MediaDto | null;
            }[];
        }[] = [];
        const slots: Record<string, SlotMedia | null> = {};

        for (const def of HOME_SLOTS) {
            const row = bySlot.get(def.slot);
            const media = row?.media ? toDto(row.media) : null;
            slots[def.slot] = media
                ? {
                      url: media.url,
                      key: media.key,
                      alt: media.alt,
                      id: media.id,
                  }
                : null;
            const last = groups[groups.length - 1];
            if (!last || last.group !== def.group) {
                groups.push({ group: def.group, slots: [] });
            }
            groups[groups.length - 1].slots.push({
                slot: def.slot,
                label: def.label,
                cluster: def.cluster,
                media,
            });
        }

        return { slots, groups };
    }

    async assign(slot: string, mediaId: string) {
        if (!isHomeSlot(slot)) {
            throw new BadRequestException("Неизвестный слот");
        }
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
        });
        if (!media) throw new NotFoundException("Файл не найден");
        await this.prisma.pageSlot.upsert({
            where: { page_slot: { page: "home", slot } },
            create: { page: "home", slot, mediaId },
            update: { mediaId },
        });
        return this.getHome();
    }

    async clear(slot: string) {
        if (!isHomeSlot(slot)) {
            throw new BadRequestException("Неизвестный слот");
        }
        await this.prisma.pageSlot.upsert({
            where: { page_slot: { page: "home", slot } },
            create: { page: "home", slot, mediaId: null },
            update: { mediaId: null },
        });
        return this.getHome();
    }
}
