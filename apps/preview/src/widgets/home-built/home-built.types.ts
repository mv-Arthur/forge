export type HomeBuiltItem = {
    slug: string;
    href: string;
    image: string;
    alt: string;
};

export type HomeBuiltStat = {
    value: string;
    hint: string;
};

import type { RefObject } from "react";

export type HomeBuiltViewProps = {
    heading: string;
    seeLabel: string;
    seeHref: string;
    stats: HomeBuiltStat[];
    items: HomeBuiltItem[];
    trackRef: RefObject<HTMLDivElement | null>;
    onPrev: () => void;
    onNext: () => void;
    showPrev: boolean;
    showNext: boolean;
};
