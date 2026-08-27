"use client";

import { useState } from "react";
import type {
    MergedProject,
    ProjectMaterialVariant,
    Technology,
} from "@/types/catalog";
import {
    formatPrice,
    formatTechnologyBrand,
    formatMonthlyShort,
    formatMillions,
} from "@/lib/format";
import { ShieldIcon } from "@/ui/icons";
import { LeadForm } from "@/widgets/lead-form/lead-form";

interface Props {
    project: MergedProject;
}

export function ProjectDetailPackages({ project }: Props) {
    const [activeTech, setActiveTech] = useState<Technology>(
        project.variants[0]?.technology ?? "gas_concrete",
    );
    const [activePkg, setActivePkg] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(true);
    const [sent, setSent] = useState(false);
    const activeVariant: ProjectMaterialVariant | undefined =
        project.variants.find((v) => v.technology === activeTech) ??
        project.variants[0];

    if (!activeVariant) return null;

    const activePackage =
        activeVariant.packages[activePkg] ?? activeVariant.packages[0];

    return (
        <div className="space-y-6">
            <div>
                <div className="mb-3 flex items-baseline justify-between gap-2">
                    <div>
                        <div className="eyebrow">Материал стен</div>
                        <h3 className="mt-1 font-display text-h2">
                            Из чего построить
                        </h3>
                    </div>
                    {project.variants.length > 1 ? (
                        <div className="text-[12px] text-ink-500">
                            Цена зависит от материала
                        </div>
                    ) : null}
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {project.variants.map((v) => {
                        const isActive = v.technology === activeTech;
                        return (
                            <button
                                key={v.technology}
                                type="button"
                                onClick={() => setActiveTech(v.technology)}
                                className={`rounded-2xl border-2 p-4 text-left transition ${
                                    isActive
                                        ? "border-ink-950 bg-ink-950 text-white shadow-lift"
                                        : "border-ink-150 bg-white text-ink-900 hover:border-ink-400"
                                }`}
                            >
                                <div className="font-display text-lg font-extrabold">
                                    {formatTechnologyBrand(v.technology)}
                                </div>
                                <div
                                    className={`mt-2 text-xs uppercase tracking-wider ${
                                        isActive
                                            ? "text-white/70"
                                            : "text-ink-500"
                                    }`}
                                >
                                    Под ключ от
                                </div>
                                <div className="font-display text-lg font-extrabold">
                                    {formatMillions(v.priceFrom)}
                                </div>
                                <div
                                    className={`text-[12px] ${
                                        isActive
                                            ? "text-white/70"
                                            : "text-ink-500"
                                    }`}
                                >
                                    от {formatMonthlyShort(v.priceFrom)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div id="chto-vhodit" className="rounded-2xl border border-ink-150 bg-white">
                <div className="border-b border-ink-150 p-5">
                    <div className="flex items-baseline justify-between gap-4">
                        <div>
                            <div className="eyebrow">Комплектации</div>
                            <h3 className="mt-1 font-display text-h2">
                                Комплектации и цена
                            </h3>
                        </div>
                        <div className="hidden text-[12px] text-ink-500 md:block">
                            Всё прописано в договоре
                        </div>
                    </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-3">
                    {activeVariant.packages.map((pkg, i) => {
                        const isSelected = i === activePkg;
                        return (
                            <button
                                key={pkg.name}
                                type="button"
                                onClick={() => setActivePkg(i)}
                                className={`border-b border-ink-150 p-6 text-left transition first:border-t-0 lg:border-b-0 lg:border-r ${
                                    isSelected
                                        ? "bg-ink-950 text-white lg:-my-px lg:rounded-2xl lg:shadow-lift"
                                        : "bg-white hover:bg-ink-50/60"
                                } lg:last:border-r-0`}
                            >
                                <div className="font-display text-xl font-extrabold">
                                    {pkg.name}
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="font-display text-2xl font-extrabold">
                                        {formatPrice(pkg.price)}
                                    </span>
                                </div>
                                <div
                                    className={`mt-1 text-[12px] ${
                                        isSelected
                                            ? "text-white/70"
                                            : "text-ink-500"
                                    }`}
                                >
                                    {formatMonthlyShort(pkg.price)} в ипотеку
                                </div>
                                <div
                                    className={`mt-4 flex items-center gap-2 text-[13px] font-semibold ${
                                        isSelected
                                            ? "text-accent"
                                            : "text-ink-950"
                                    }`}
                                >
                                    {isSelected ? "Выбрано" : "Выбрать"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-ink-150 p-6">
                    <div className="mb-4 flex items-baseline justify-between">
                        <div>
                            <div className="eyebrow">Смета</div>
                            <div className="mt-1 font-display text-lg font-extrabold">
                                {activePackage.name} ·{" "}
                                {formatTechnologyBrand(activeVariant.technology)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[12px] uppercase tracking-wider text-ink-500">
                                Стоимость
                            </div>
                            <div className="font-display text-2xl font-extrabold text-ink-950">
                                {formatPrice(activePackage.price)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <div className="rounded-xl border border-ink-150 bg-white p-4">
                            <div className="text-[12px] uppercase tracking-wider text-ink-500">
                                Итого «под ключ»
                            </div>
                            <div className="font-display text-3xl font-extrabold text-ink-950">
                                {formatPrice(activePackage.price)}
                            </div>
                            <div className="mt-1 text-[13px] text-ink-500">
                                Ипотека от {formatMonthlyShort(activePackage.price)} · 6% на 20 лет
                            </div>
                        </div>
                        <div className="rounded-xl border border-ink-150 bg-white p-4">
                            <ShieldIcon className="h-6 w-6 text-success" />
                            <div className="mt-1 text-[12px] font-semibold text-ink-950">
                                Гарантия 7 лет
                            </div>
                            <div className="text-[12px] text-ink-500">
                                Договор с фикс. сметой
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-ink-150 bg-white p-4">
                        <div className="font-display text-[15px] font-extrabold text-ink-950">
                            Отправить смету на «
                            {formatTechnologyBrand(activeVariant.technology)}» ·{" "}
                            {activePackage.name}
                        </div>
                        <p className="mt-1 text-[12px] text-ink-500">
                            Пришлём смету в мессенджер.
                        </p>
                        <div className="mt-3">
                            <LeadForm
                                source="project-calc"
                                prefill={`Смета: ${project.displayName} · ${formatTechnologyBrand(activeVariant.technology)} · ${activePackage.name} · ${formatPrice(activePackage.price)}`}
                                ctaLabel="Получить смету"
                                variant="light"
                                inline
                                values={{ name, phone, consent }}
                                sent={sent}
                                onNameChange={setName}
                                onPhoneChange={setPhone}
                                onConsentChange={setConsent}
                                onSubmit={() => {
                                    if (!phone || !consent) return;
                                    setSent(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
