import type { ReactNode } from "react";

export type PaintChip = {
    id: string;
    label: string;
};

export type PaintBenefitId = "materials" | "spec" | "estimate" | "prep";

export type PaintBenefit = {
    id: PaintBenefitId;
    title: string;
    text: string;
};

export type PaintRisk = {
    id: string;
    text: string;
};

export type PaintStep = {
    n: string;
    text: string;
};

export type PaintSwatch = {
    id: string;
    label: string;
    image: string;
};

export type PaintCoatingGroup = {
    id: string;
    title: string;
    text: string;
    cover: string;
    swatches: PaintSwatch[];
};

export type FinishingPaintProps = {
    form: ReactNode;
};
