import { Gallery } from "./Gallery";
import type { EnrichedBuiltObject } from "@/lib/types";
import { photosWord } from "@/lib/format";

/**
 * Flat photo gallery of real object photos — no invented stage chronology.
 */
export function PhotoChronicle({ object }: { object: EnrichedBuiltObject }) {
    const total = object.gallery.length;

    if (total === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/40 p-8 text-center text-ink-500">
                Фотохроника пока не загружена
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-ink-150 bg-white p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <div className="eyebrow">Фотохроника</div>
                    <h2 className="mt-1 font-display text-h2">
                        Фото объекта
                    </h2>
                    <p className="mt-1 text-[13px] text-ink-500">
                        {total} {photosWord(total)}
                    </p>
                </div>
                {object.status === "in-progress" ? (
                    <span className="badge badge-progress">строится</span>
                ) : (
                    <span className="badge badge-built">сдан</span>
                )}
            </div>

            <Gallery
                images={object.gallery}
                alt={object.displayTitle}
                aspectClass="aspect-[16/10]"
                priority
            />
        </div>
    );
}
