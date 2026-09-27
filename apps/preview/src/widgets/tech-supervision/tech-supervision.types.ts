import type { ReactNode } from "react";

export type TechSupervisionChip = {
    id: string;
    label: string;
};

export type TechSupervisionWhyItem = {
    id: string;
    text: string;
};

export type TechSupervisionDifferId =
    | "client"
    | "hidden"
    | "acceptance"
    | "norms";

export type TechSupervisionDiffer = {
    id: TechSupervisionDifferId;
    title: string;
    text: string;
};

export type TechSupervisionAcceptance = {
    id: string;
    title: string;
    image: string;
};

export type TechSupervisionProps = {
    form: ReactNode;
};
