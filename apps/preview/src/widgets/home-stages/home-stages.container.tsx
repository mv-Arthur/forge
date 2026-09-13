"use client";

import { useState } from "react";
import { STAGES_HEADING, STAGES_LEAD } from "@/lib/copy";
import { HomeStages } from "./home-stages";
import { STAGE_ITEMS } from "./lib/content";

const FIRST_ID = STAGE_ITEMS[0]?.id ?? "plot";

export function HomeStagesContainer() {
    const [activeId, setActiveId] = useState(FIRST_ID);
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <HomeStages
            heading={STAGES_HEADING}
            lead={STAGES_LEAD}
            items={STAGE_ITEMS}
            activeId={activeId}
            openId={openId}
            onActivate={setActiveId}
            onListLeave={() => setActiveId(FIRST_ID)}
            onToggle={(id) => setOpenId((cur) => (cur === id ? null : id))}
        />
    );
}
