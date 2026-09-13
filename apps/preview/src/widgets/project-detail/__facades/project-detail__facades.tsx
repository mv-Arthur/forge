"use client";

import { useState } from "react";
import Image from "next/image";
import { DETAIL_FACADES_HEADING } from "@/lib/copy";
import type { DetailFacade } from "../lib/illustrations";

export function ProjectDetailFacades({
    facades,
    stub = false,
}: {
    facades: DetailFacade[];
    stub?: boolean;
}) {
    const [active, setActive] = useState(0);
    const current = facades[active];
    if (!current) return null;

    return (
        <div data-stub={stub ? "true" : undefined}>
            <div className="mb-5 flex flex-wrap gap-2">
                {facades.map((f, i) => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setActive(i)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            i === active
                                ? "bg-ink-950 text-paper"
                                : "bg-ink-50 text-ink-700 hover:bg-ink-100"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink-150 bg-[#f3eee4]">
                <Image
                    src={current.src}
                    alt={`${DETAIL_FACADES_HEADING}: ${current.label}`}
                    fill
                    unoptimized={current.src.startsWith("/media/")}
                    className="object-contain"
                    sizes="(min-width:1024px) 70vw, 100vw"
                />
            </div>
        </div>
    );
}
