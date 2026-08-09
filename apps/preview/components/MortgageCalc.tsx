"use client";

import { useState } from "react";
import { mortgageMonthly } from "@/lib/format";

interface Props {
    initialPrice: number;
}

export function MortgageCalc({ initialPrice }: Props) {
    const [amount, setAmount] = useState(initialPrice);
    const [rate, setRate] = useState(6);
    const [term, setTerm] = useState(20);
    const monthly = mortgageMonthly(amount, rate, term);
    const overpay = monthly * term * 12 - amount;

    const priceMax = Math.max(30_000_000, Math.round(initialPrice * 1.4));

    return (
        <div id="ipoteka" className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
            <div className="mb-5 flex items-baseline justify-between">
                <div>
                    <div className="eyebrow">Ипотека</div>
                    <h3 className="mt-1 font-display text-h2">
                        Калькулятор платежа
                    </h3>
                </div>
                <span className="badge badge-outline">Аккредитованы в 5 банках</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <SliderField
                    label="Сумма кредита"
                    valueLabel={`${(amount / 1_000_000).toFixed(2)} млн ₽`}
                    min={1_000_000}
                    max={priceMax}
                    step={100_000}
                    value={amount}
                    onChange={setAmount}
                />
                <SliderField
                    label="Ставка"
                    valueLabel={`${rate.toFixed(1)}%`}
                    min={4}
                    max={16}
                    step={0.5}
                    value={rate}
                    onChange={setRate}
                />
                <SliderField
                    label="Срок"
                    valueLabel={`${term} лет`}
                    min={5}
                    max={30}
                    step={1}
                    value={term}
                    onChange={setTerm}
                />
            </div>

            <div className="mt-6 grid gap-3 rounded-xl border border-ink-150 bg-ink-950 p-6 text-white md:grid-cols-3">
                <div>
                    <div className="text-xs uppercase tracking-wider text-white/60">
                        Ежемесячный платёж
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-accent">
                        {monthly.toLocaleString("ru-RU")} ₽
                    </div>
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-white/60">
                        Итого выплатите
                    </div>
                    <div className="mt-1 font-display text-2xl font-extrabold">
                        {(monthly * term * 12).toLocaleString("ru-RU")} ₽
                    </div>
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-white/60">
                        Переплата
                    </div>
                    <div className="mt-1 font-display text-2xl font-extrabold">
                        {overpay.toLocaleString("ru-RU")} ₽
                    </div>
                </div>
            </div>
            <p className="mt-3 text-[12px] text-ink-500">
                Расчёт демонстрационный. Помогаем собрать документы, подбираем
                банк с лучшей ставкой под ваш профиль.
            </p>
        </div>
    );
}

function SliderField({
    label,
    valueLabel,
    min,
    max,
    step,
    value,
    onChange,
}: {
    label: string;
    valueLabel: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div>
            <div className="mb-2 flex items-baseline justify-between">
                <div className="eyebrow">{label}</div>
                <div className="font-display text-lg font-extrabold text-ink-950">
                    {valueLabel}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-ink-950"
            />
            <div className="mt-1 flex justify-between text-xs text-ink-500">
                <span>{formatRange(min)}</span>
                <span>{formatRange(max)}</span>
            </div>
        </div>
    );
}

function formatRange(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} млн`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}к`;
    return String(v);
}
