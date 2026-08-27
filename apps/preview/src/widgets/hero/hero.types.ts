import type { StaticImageData } from "next/image";
import type {
    HeroAttributeIconId,
    HeroAttributePayload,
    HeroCardImageId,
    HeroPayload,
} from "@/server/hero/types";

export type {
    HeroAttributeIconId,
    HeroAttributePayload,
    HeroCardImageId,
    HeroPayload,
};

export type HeroPromoCard = {
    href: string;
    image: StaticImageData;
    title: string;
    subtitle?: string;
    cta: string;
};

export type HeroContent = {
    heading: string;
    lead: string;
    cards: HeroPromoCard[];
    attributes: HeroAttributePayload[];
};

export type HeroPromoBind = {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    tabIndex?: 0;
};

export type HeroSliderBind = {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onClickCapture: (e: React.MouseEvent) => void;
};

export type HeroViewProps = HeroContent & {
    index: number;
    onSelect: (i: number) => void;
    promo: HeroPromoBind;
    slider: HeroSliderBind;
};
