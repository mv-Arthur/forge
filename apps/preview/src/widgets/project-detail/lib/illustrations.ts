export type DetailFacade = {
    id: string;
    label: string;
    src: string;
    sectionSrc?: string;
};

export type DetailIllustrations = {
    plan: { src: string; floor: string };
    facades: DetailFacade[];
};

const BRIG: DetailIllustrations = {
    plan: {
        src: "/media/detail/brig/plan.jpg",
        floor: "1 этаж",
    },
    facades: [
        {
            id: "front",
            label: "Передний",
            src: "/media/detail/brig/facade-front.jpg",
        },
        {
            id: "back",
            label: "Задний",
            src: "/media/detail/brig/facade-back.jpg",
        },
        {
            id: "left",
            label: "Левый боковой",
            src: "/media/detail/brig/facade-left.jpg",
        },
        {
            id: "right",
            label: "Правый боковой",
            src: "/media/detail/brig/facade-right.jpg",
        },
    ],
};

const BY_SLUG: Record<string, DetailIllustrations> = {
    brig: BRIG,
};

export function getDetailIllustrations(
    slug: string,
): DetailIllustrations | null {
    return BY_SLUG[slug] ?? null;
}
