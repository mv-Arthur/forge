import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, section, sectionsOf } from "@/data/pages";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import { FinanceLanding } from "./FinanceLanding";

// Общий помощник для четырёх финансовых лендингов (mortgage/credit/
// maternity-capital/payment). Все они рендерят один FinanceLanding, наполняя его
// секциями страницы из API; статичный chrome (кнопки, маршрут, форма) — в самом
// компоненте.

export async function financeMetadata(pageKey: string): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage(pageKey), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: `/${pageKey}`,
    });
}

export async function FinancePage({ pageKey }: { pageKey: string }) {
    const page = await getPage(pageKey);
    const hero = section(page, "financeHero");
    const cards = sectionsOf(page, "cardGrid");
    const form = section(page, "leadForm");
    if (!hero || cards.length < 3 || !form) notFound();
    const [conditions, steps, banks] = cards;

    return (
        <FinanceLanding
            eyebrow={hero.eyebrow}
            title={hero.title}
            titleAccent={hero.titleAccent}
            lead={hero.lead}
            canonicalPath={`/${pageKey}`}
            stats={hero.stats}
            conditionsTitle={conditions.title ?? ""}
            conditionsLead={conditions.lead ?? ""}
            conditions={conditions.items}
            stepsTitle={steps.title ?? ""}
            stepsLead={steps.lead ?? ""}
            steps={steps.items}
            banksTitle={banks.title ?? ""}
            banksLead={banks.lead ?? ""}
            banks={banks.items.map((item) => ({
                name: item.title,
                note: item.text,
            }))}
            noteTitle={banks.note?.title ?? ""}
            noteText={banks.note?.text ?? ""}
            formTitle={form.title}
            formLead={form.lead}
            formButton={form.button}
        />
    );
}
