import type { ReactNode } from "react";

export type PopularTab = "serial" | "individual";

export type PopularProjectsViewProps = {
    tab: PopularTab;
    onTab: (tab: PopularTab) => void;
    hasIndividual: boolean;
    heading: string;
    lead: string;
    allHref: string;
    allLabel: string;
    serialLabel: string;
    individualLabel: string;
    cards: ReactNode;
};
