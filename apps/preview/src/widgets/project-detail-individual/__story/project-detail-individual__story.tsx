"use client";

import { useState } from "react";
import Image from "next/image";
import { DETAIL_STORY_BUILT, DETAIL_STORY_PROJECT } from "@/lib/copy";
import { PillTabs } from "@/ui/pill-tabs";
import type { ShowcaseStory } from "@/types/catalog";

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
        <section
            data-section="detail-story"
            className="border-b border-ink-150 bg-white"
        >
            <div className="container-page py-10 md:py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-display text-h1 text-ink-950">
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
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {active.map((src, i) => (
                        <div
                            key={src + i}
                            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100"
                        >
                            <Image
                                src={src}
                                alt={`${name} — ${i + 1}`}
                                fill
                                unoptimized={src.startsWith("/media/")}
                                className="object-cover"
                                sizes="(min-width:1024px) 33vw, 100vw"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
