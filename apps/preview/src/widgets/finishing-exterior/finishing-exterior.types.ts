import type { ReactNode } from "react";

export type ExteriorChip = {
    id: string;
    label: string;
};

export type ExteriorMethod = {
    id: string;
    n: string;
    title: string;
    text: string;
    image: string;
};

export type ExteriorWhenStep = {
    n: string;
    text: string;
};

export type FinishingExteriorProps = {
    form: ReactNode;
};
