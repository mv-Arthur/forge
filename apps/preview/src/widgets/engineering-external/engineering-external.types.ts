import type { ReactNode } from "react";

export type EngineeringExternalStat = {
    value: string;
    hint: string;
};

export type EngineeringWhenItem = {
    id: string;
    title: string;
    text: string;
};

export type EngineeringServiceItem = {
    id: string;
    title: string;
    text: string;
};

export type EngineeringServiceGroup = {
    id: string;
    title: string;
    items: EngineeringServiceItem[];
};

export type EngineeringStep = {
    n: string;
    title: string;
    items: string[];
};

export type EngineeringPrinciple = {
    id: string;
    title: string;
    text: string;
};

export type EngineeringWhyItem = {
    id: string;
    title: string;
    text: string;
};

export type EngineeringExternalProps = {
    stats: EngineeringExternalStat[];
    form: ReactNode;
};
