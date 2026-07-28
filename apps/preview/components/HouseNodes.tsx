"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { PackageSet, PackageSetNode, Technology } from "@/lib/types";
import { formatPrice, formatTechnology } from "@/lib/format";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { CheckIcon } from "./Icons";

export interface HouseNodesOption {
    technology: Technology;
    packageSet: PackageSet | null;
    defaultPackageName?: string;
}

export function HouseNodes({ options }: { options: HouseNodesOption[] }) {
    const available = options.filter((o) => o.packageSet?.packages?.length);
    const [tech, setTech] = useState<Technology | null>(
        available[0]?.technology ?? null,
    );
    const option =
        available.find((o) => o.technology === tech) ?? available[0] ?? null;
    const packages = option?.packageSet?.packages ?? [];
    const pkgNames = packages.map((p) => p.name);

    const initialPkg =
        (option?.defaultPackageName &&
        pkgNames.includes(option.defaultPackageName)
            ? option.defaultPackageName
            : pkgNames[0]) ?? "";

    const [pkgName, setPkgName] = useState(initialPkg);

    // Reset package when technology changes
    const activePkgName = pkgNames.includes(pkgName)
        ? pkgName
        : (pkgNames[0] ?? "");
    const activePkg =
        packages.find((p) => p.name === activePkgName) ?? packages[0] ?? null;
    const nodes = activePkg?.nodes ?? [];

    const [activeTab, setActiveTab] = useState<string>("");
    const tab = activeTab && nodes.some((n) => n.tab === activeTab)
        ? activeTab
        : (nodes[0]?.tab ?? "");

    const node: PackageSetNode | null = useMemo(() => {
        if (!activePkg) return null;
        return activePkg.nodes.find((n) => n.tab === tab) ?? activePkg.nodes[0] ?? null;
    }, [activePkg, tab]);

    if (!option || !node) {
        return (
            <div className="rounded-2xl border border-dashed border-line-strong bg-ink-50 p-6 text-[14px] text-ink-500">
                Детальный состав узлов для этого проекта пока не подтянут с
                legacy. Комплектации и цены — в блоке «Из чего построить»
                выше.
            </div>
        );
    }

    return (
        <div>
            {available.length > 1 ? (
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {available.map((o) => {
                        const on = o.technology === option.technology;
                        return (
                            <button
                                key={o.technology}
                                type="button"
                                onClick={() => {
                                    setTech(o.technology);
                                    setPkgName(
                                        o.defaultPackageName ??
                                            o.packageSet?.packages[0]?.name ??
                                            "",
                                    );
                                    setActiveTab("");
                                }}
                                className={`chip chip-btn ${on ? "chip-active" : ""}`}
                            >
                                {formatTechnology(o.technology)}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center gap-1.5">
                {packages.map((p) => {
                    const on = p.name === activePkg?.name;
                    return (
                        <button
                            key={p.name}
                            type="button"
                            onClick={() => setPkgName(p.name)}
                            className={`chip chip-btn ${on ? "chip-active" : ""}`}
                        >
                            {p.name}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-1 overflow-x-auto rounded-2xl border border-ink-150 bg-white p-1">
                {nodes.map((n) => {
                    const isActive = n.tab === node.tab;
                    return (
                        <button
                            key={n.tab}
                            type="button"
                            onClick={() => setActiveTab(n.tab)}
                            className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                                isActive
                                    ? "bg-accent text-accent-ink"
                                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                            }`}
                        >
                            {n.tab}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 scroll-mt-28 rounded-2xl border border-ink-150 bg-white p-5 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-h2 text-ink-950">
                        {node.title}
                    </h3>
                    {node.price != null ? (
                        <div className="text-[15px] font-semibold text-accent">
                            Стоимость:{" "}
                            <span className="tabular-nums">
                                {formatPrice(node.price)}
                            </span>
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-10">
                    <div>
                        <ul className="space-y-2.5">
                            {node.items.map((t) => (
                                <li
                                    key={t}
                                    className="flex gap-2.5 text-[14px] leading-snug text-ink-700"
                                >
                                    <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                        {node.items.length === 0 ? (
                            <p className="text-[14px] text-ink-500">
                                Состав работ не указан в источнике.
                            </p>
                        ) : null}
                    </div>

                    {node.image ? (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-150 bg-ink-50">
                            <Image
                                src={node.image}
                                alt={node.title}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                        </div>
                    ) : (
                        <PlaceholderMedia
                            width={1200}
                            height={900}
                            label={node.tab}
                            className="aspect-[4/3]"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
