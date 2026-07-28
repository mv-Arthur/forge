"use client";

import { useState } from "react";
import type {
    MergedProject,
    ProjectMaterialVariant,
    Technology,
} from "@/lib/types";
import {
    formatPrice,
    formatTechnologyBrand,
    formatMonthlyShort,
    formatMillions,
} from "@/lib/format";
import { CheckIcon, ShieldIcon } from "./Icons";
import { LeadForm } from "./LeadForm";

interface Props {
    project: MergedProject;
}

const WALLS_BY_TECH: Record<string, string> = {
    gas_concrete: "Газобетон YTONG D400 375 мм · клей + армирование",
    brick: "Керамический блок Porotherm 44 · облицовка кирпич",
    frame: "Каркас 150–200 мм · утеплитель Paroc · ветрозащита Tyvek",
    sip: "СИП-панели 174–224 мм · OSB-3 · пенополистирол",
    fachwerk: "Фасад fachwerk · каркас + заполнение газобетон/СИП",
    timber: "Клеёный брус 200×200 · межвенцовый уплотнитель",
};

const PACKAGE_INCLUDES: Record<string, Array<{ label: string; value: string }>> = {
    Базовая: [
        { label: "Фундамент", value: "Монолитная плита 300 мм, бетон B22.5, арматура А500С d12" },
        { label: "Стены", value: "__WALLS__" },
        { label: "Кровля", value: "Металлочерепица Grand Line Kredo · утеплитель Paroc" },
        { label: "Окна", value: "Veka Softline 70 · 2-камерный стеклопакет · энергосбережение" },
        { label: "Двери", value: "Входная TOREX Snegir 20 · межкомнатные под чистовую" },
        { label: "Черновая инженерка", value: "Электрика · водоснабжение · отопление котёл газовый Buderus" },
    ],
    Стандарт: [
        { label: "Всё из «Базовой» +", value: "" },
        { label: "Утепление до нормы", value: "6.3 м²·К/Вт по стенам, 7.2 по кровле · Paroc + ветрозащита Tyvek" },
        { label: "Окна улучшенные", value: "Veka Softline 82 · 3-камерный · шумоизоляция 34 дБ" },
        { label: "Фасад", value: "Штукатурка Caparol с камнем цокольным · Cedral Click под кедр" },
        { label: "Подшивка свесов", value: "Софиты Grand Line · водосток пластиковый Технониколь" },
        { label: "Инженерка в развёрнутом виде", value: "Электрика 55+ точек · тёплые полы в с/у · разводка ХВС/ГВС" },
    ],
    Комфорт: [
        { label: "Всё из «Стандарта» +", value: "" },
        { label: "Финишная отделка внутри", value: "Стены под покраску Caparol · полы паркетная доска Kährs" },
        { label: "Терраса под ключ", value: "Настил термоясень с антискольжением, козырьки" },
        { label: "Санузлы «под ключ»", value: "Плитка Kerama Marazzi · сантехника Roca · душ-кабина Ravak" },
        { label: "Умный дом Стартовый", value: "Датчики протечки, дыма, дистанционное управление отоплением" },
        { label: "Ландшафт минимум", value: "Отмостка · крыльцо · площадка перед въездом · газон 100 м²" },
    ],
};

export function MaterialSwitcher({ project }: Props) {
    const [activeTech, setActiveTech] = useState<Technology>(
        project.variants[0]?.technology ?? "gas_concrete",
    );
    const [activePkg, setActivePkg] = useState(1);
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
                            Клик — цена и комплектации пересчитываются
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
                                    className={`mt-2 text-[11px] uppercase tracking-wider ${
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
                                Что входит — до брендов
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
                        const isMid = i === 1;
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
                                <div className="flex items-center justify-between">
                                    <div className="font-display text-xl font-extrabold">
                                        {pkg.name}
                                    </div>
                                    {isMid ? (
                                        <span
                                            className={`badge ${
                                                isSelected
                                                    ? "bg-accent text-white"
                                                    : "badge-hit"
                                            }`}
                                        >
                                            Хит
                                        </span>
                                    ) : null}
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
                                    {isSelected ? "Показан ниже" : "Показать состав"}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-ink-150 p-6">
                    <div className="mb-4 flex items-baseline justify-between">
                        <div>
                            <div className="eyebrow">Состав пакета</div>
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
                    <div className="divide-y divide-ink-150 rounded-xl border border-ink-150 bg-ink-50/40">
                        {(PACKAGE_INCLUDES[activePackage.name] ?? []).map(
                            (row, i) => {
                                const value =
                                    row.value === "__WALLS__"
                                        ? WALLS_BY_TECH[activeVariant.technology] ??
                                          WALLS_BY_TECH.gas_concrete
                                        : row.value;
                                return (
                                <div
                                    key={row.label + i}
                                    className={`grid grid-cols-[auto_1fr] gap-4 p-4 ${
                                        value ? "" : "bg-accent/5"
                                    }`}
                                >
                                    <div className="flex items-start gap-2 text-[13px] font-bold uppercase tracking-wider text-ink-500">
                                        <CheckIcon className="mt-0.5 h-3.5 w-3.5 text-success" />
                                        {row.label}
                                    </div>
                                    <div className="text-[14px] text-ink-800">
                                        {value || (
                                            <em className="font-semibold not-italic text-accent">
                                                (дополнительно)
                                            </em>
                                        )}
                                    </div>
                                </div>
                                );
                            },
                        )}
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
                            Скинем PDF с полной сметой в мессенджер за 15 минут.
                        </p>
                        <div className="mt-3">
                            <LeadForm
                                source="project-calc"
                                prefill={`Смета: ${project.displayName} · ${formatTechnologyBrand(activeVariant.technology)} · ${activePackage.name} · ${formatPrice(activePackage.price)}`}
                                inline
                                ctaLabel="Получить смету"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
