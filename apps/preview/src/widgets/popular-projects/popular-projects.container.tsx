"use client";

import { useState, type ReactNode } from "react";
import {
    POPULAR_ALL,
    POPULAR_HEADING,
    POPULAR_INDIVIDUAL_LEAD,
    POPULAR_INDIVIDUAL_TAB,
    POPULAR_LEAD,
    POPULAR_SERIAL_TAB,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { PopularProjects } from "./popular-projects";
import type { PopularTab } from "./popular-projects.types";

export function PopularProjectsContainer({
    serial,
    individual,
}: {
    serial: ReactNode;
    individual: ReactNode | null;
}) {
    const hasIndividual = individual != null;
    const [tab, setTab] = useState<PopularTab>("serial");
    const individualOn = hasIndividual && tab === "individual";

    return (
        <PopularProjects
            tab={tab}
            onTab={setTab}
            hasIndividual={hasIndividual}
            heading={POPULAR_HEADING}
            lead={individualOn ? POPULAR_INDIVIDUAL_LEAD : POPULAR_LEAD}
            allHref={
                individualOn
                    ? routes.projects({ kind: "individual" })
                    : routes.projects()
            }
            allLabel={POPULAR_ALL}
            serialLabel={POPULAR_SERIAL_TAB}
            individualLabel={POPULAR_INDIVIDUAL_TAB}
            cards={individualOn ? individual : serial}
        />
    );
}
