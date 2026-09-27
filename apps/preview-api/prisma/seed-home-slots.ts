import { stat } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import {
    folderFromKey,
    mimeFromExt,
    publicUrl,
} from "../src/media/media-path.ts";
import { HOME_SLOTS } from "../src/pages/home-slots.ts";

const prisma = new PrismaClient();

async function main() {
    const root = path.resolve(
        process.env.MEDIA_ROOT ?? "../preview/data/fixtures/media"
    );

    for (const def of HOME_SLOTS) {
        let media = def.defaultKey
            ? await prisma.media.findUnique({
                  where: { key: def.defaultKey },
              })
            : null;
        if (def.defaultKey) {
            try {
                const info = await stat(path.join(root, def.defaultKey));
                if (!media) {
                    media = await prisma.media.create({
                        data: {
                            key: def.defaultKey,
                            url: publicUrl(def.defaultKey),
                            filename: path.posix.basename(def.defaultKey),
                            mime: mimeFromExt(def.defaultKey),
                            size: info.size,
                            folder: folderFromKey(def.defaultKey),
                        },
                    });
                }
            } catch {
                // file missing on disk
            }
        }

        const existing = await prisma.pageSlot.findUnique({
            where: { page_slot: { page: "home", slot: def.slot } },
        });
        if (existing) {
            if (!existing.mediaId && media) {
                await prisma.pageSlot.update({
                    where: { page_slot: { page: "home", slot: def.slot } },
                    data: { mediaId: media.id },
                });
            }
            continue;
        }
        await prisma.pageSlot.create({
            data: {
                page: "home",
                slot: def.slot,
                mediaId: media?.id ?? null,
            },
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
