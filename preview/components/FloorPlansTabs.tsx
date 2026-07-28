"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { MergedProject, ProjectFloorPlan } from "@/lib/types";
import {
    formatArea,
    formatFloors,
    bedroomsWord,
    bathroomsWord,
} from "@/lib/format";
import { CheckIcon } from "./Icons";

interface Props {
    project: MergedProject;
    plans: ProjectFloorPlan[];
}

export function FloorPlansTabs({ project, plans }: Props) {
    const [active, setActive] = useState(0);
    const grouped = useMemo(() => {
        const groups = new Map<string, ProjectFloorPlan[]>();
        for (const p of plans) {
            const key = p.floor || "План";
            const arr = groups.get(key) ?? [];
            arr.push(p);
            groups.set(key, arr);
        }
        return Array.from(groups.entries()).map(([floor, items]) => ({
            floor,
            items,
        }));
    }, [plans]);

    if (grouped.length === 0) return null;
    const activeGroup = grouped[active];
    const plan = activeGroup.items[0];

    const roomsOnFloor = project.rooms.filter((r) => {
        if (grouped.length === 1) return true;
        if (activeGroup.floor.includes("1")) return r.floor === 1;
        if (activeGroup.floor.includes("2")) return r.floor === 2;
        return true;
    });

    return (
        <div className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="eyebrow">Планировка</div>
                    <h3 className="mt-1 font-display text-h2">
                        Этажи и помещения
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-500">
                        {formatArea(project.area)}
                        {project.livingArea
                            ? ` · жилая ${formatArea(project.livingArea)}`
                            : ""}
                        {project.builtUpArea
                            ? ` · застройка ${formatArea(project.builtUpArea)}`
                            : ""}
                        {" · "}
                        {formatFloors(project.floors)}
                        {project.bedrooms
                            ? ` · ${project.bedrooms} ${bedroomsWord(project.bedrooms)}`
                            : ""}
                        {project.bathrooms
                            ? ` · ${project.bathrooms} ${bathroomsWord(project.bathrooms)}`
                            : ""}
                        {project.dimensions
                            ? ` · ${project.dimensions.replace(/x/gi, "×")} м`
                            : ""}
                    </p>
                </div>
                {project.planEditable ? (
                    <span className="badge bg-success/10 text-success">
                        Меняем бесплатно
                    </span>
                ) : null}
            </div>

            {grouped.length > 1 ? (
                <div className="mb-5 flex flex-wrap gap-1.5">
                    {grouped.map((g, i) => (
                        <button
                            key={g.floor + i}
                            type="button"
                            onClick={() => setActive(i)}
                            className={`chip chip-btn ${
                                i === active ? "chip-active" : ""
                            }`}
                        >
                            {g.floor}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-150 bg-white">
                    <Image
                        src={plan.url}
                        alt={`Планировка · ${activeGroup.floor}`}
                        fill
                        sizes="(min-width:1024px) 55vw, 100vw"
                        className="object-contain p-2"
                    />
                </div>
                <div>
                    <div className="eyebrow">Состав</div>
                    <div className="mt-2 font-display text-lg font-extrabold">
                        {activeGroup.floor}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                        {roomsOnFloor.map((r, i) => (
                            <li
                                key={r.name + i}
                                className="flex items-center justify-between border-b border-ink-150 py-1.5 text-[14px]"
                            >
                                <span className="flex items-center gap-2 text-ink-700">
                                    <CheckIcon className="h-3 w-3 text-success" />
                                    {r.name}
                                </span>
                                <span className="tabular-nums font-semibold text-ink-950">
                                    {formatArea(r.area)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-5 grid gap-2 rounded-xl border border-ink-150 bg-ink-50/40 p-3 text-[12px]">
                        <div className="flex items-center gap-2 text-ink-700">
                            <CheckIcon className="h-3 w-3 text-success" />
                            Планировку меняем бесплатно
                        </div>
                        <div className="flex items-center gap-2 text-ink-700">
                            <CheckIcon className="h-3 w-3 text-success" />
                            Зеркальное отражение дома доступно
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
