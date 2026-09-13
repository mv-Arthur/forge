"use client";

import { useState } from "react";
import Image from "next/image";
import { DETAIL_STORY_BUILT, DETAIL_STORY_PROJECT } from "@/lib/copy";
import { PillTabs } from "@/ui/pill-tabs";
import type { ShowcaseStory } from "@/types/catalog";
import { Container } from "@/ui/container";
import layout from "../../project-detail/project-detail.module.css";

export function ProjectDetailIndividualStory({
    story,
    name,
}: {
    story: ShowcaseStory;
    name: string;
}) {
    const hasBuilt = story.built.length > 0;
    const [tab, setTab] = useState<"project" | "built">("project");
    const active = tab === "built" && hasBuilt ? story.built : story.project;
    const items = [
        { id: "project", label: DETAIL_STORY_PROJECT },
        ...(hasBuilt ? [{ id: "built", label: DETAIL_STORY_BUILT }] : []),
    ];

    if (story.project.length === 0 && !hasBuilt) return null;

    return (
        <section data-section="detail-story" className={layout.band}>
            <Container className={layout.pad}>
                <div className={layout.similarHead}>
                    <h2 className={layout.heading}>
                        {DETAIL_STORY_PROJECT} и {DETAIL_STORY_BUILT.toLowerCase()}
                    </h2>
                    {items.length > 1 ? (
                        <PillTabs
                            items={items}
                            value={tab}
                            onChange={(id) =>
                                setTab(id === "built" ? "built" : "project")
                            }
                        />
                    ) : null}
                </div>
                <div className={layout.photos}>
                    {active.map((src, i) => (
                        <div key={src + i} className={layout.photo}>
                            <Image
                                src={src}
                                alt={`${name} - ${i + 1}`}
                                fill
                                unoptimized={src.startsWith("/media/")}
                                className={layout.photoImg}
                                sizes="(min-width:1024px) 33vw, 100vw"
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
