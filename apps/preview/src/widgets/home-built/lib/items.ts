import type { EnrichedBuiltObject } from "@/types/catalog";
import { routes } from "@/lib/routes";
import type { HomeBuiltItem } from "../home-built.types";

const STRIP_COVERS: { slug: string; image: string }[] = [
    {
        slug: "dom-iz-gazobetona-p-lintulovo",
        image: "/media/built-strip/01.jpg",
    },
    {
        slug: "dvuhetazhnyi-dom-iz-gazobetonnyh-blokov-v-kp-petergofskie-dachi",
        image: "/media/built-strip/02.jpg",
    },
    {
        slug: "dom-iz-kirpicha-v-p-romanovka",
        image: "/media/built-strip/03.jpg",
    },
    {
        slug: "karkasniy-dom-v-p-pobeda",
        image: "/media/built-strip/04.jpg",
    },
    {
        slug: "dom-iz-gazobetona-s-garazhom-der-oliki",
        image: "/media/built-strip/05.jpg",
    },
    {
        slug: "odnoetazhnyj-dom-iz-sip-v-kp-ladoga",
        image: "/media/built-strip/06.jpg",
    },
    {
        slug: "sip-dom-v-p-losevo",
        image: "/media/built-strip/07.jpg",
    },
];

export function buildBuiltStripItems(
    objects: EnrichedBuiltObject[],
    slots: Record<string, string> = {}
): HomeBuiltItem[] {
    const bySlug = new Map(objects.map((o) => [o.slug, o]));
    return STRIP_COVERS.flatMap(({ slug, image }, index) => {
        const object = bySlug.get(slug);
        if (!object) return [];
        return [
            {
                slug,
                href: routes.worksGallery(),
                image: slots[`built.${index}`] ?? image,
                alt: object.displayTitle || object.locationLabel || "Дом",
            },
        ];
    });
}
