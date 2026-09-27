import type { ReactNode } from "react";

export type FacadeChip = {
    id: string;
    label: string;
};

export type FacadeMaterial = {
    id: string;
    title: string;
    text: string;
    image: string;
};

export type FacadeCombo = {
    n: string;
    title: string;
    text: string;
};

export type FinishingFacadeProps = {
    form: ReactNode;
};
