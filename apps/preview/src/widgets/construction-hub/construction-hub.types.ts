import type { ReactNode } from "react";
import type { ConstructionHubPayload } from "@/types/services";
import type { TechFamily } from "@/lib/techFamily";

export type ConstructionBenefitId =
    | "term"
    | "noshrink"
    | "factory"
    | "winter"
    | "light"
    | "range"
    | "warm"
    | "local"
    | "supply"
    | "finish"
    | "brick"
    | "lineup";

export type ConstructionBenefit = {
    id: ConstructionBenefitId;
    title: string;
    text: string;
};

export type ConstructionStage = {
    id: string;
    title: string;
    text: string;
    image: string;
};

export type ConstructionHubProps = {
    payload: ConstructionHubPayload;
    serial: ReactNode;
    form: ReactNode;
};

export type { ConstructionHubPayload, TechFamily };
