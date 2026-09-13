import type { ReactNode } from "react";
import {
    DETAIL_START_HEADING,
    DETAIL_START_QUOTE_LEAD,
    DETAIL_START_QUOTE_TITLE,
    DETAIL_START_VISIT_LEAD,
    DETAIL_START_VISIT_TITLE,
} from "@/lib/copy";

export function ProjectDetailStart({
    visit,
    quote,
}: {
    visit: ReactNode;
    quote: ReactNode;
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
                <div className="eyebrow">{DETAIL_START_HEADING}</div>
                <h3 className="mt-2 font-display text-h2">
                    {DETAIL_START_VISIT_TITLE}
                </h3>
                <p className="mt-2 text-sm text-ink-500">
                    {DETAIL_START_VISIT_LEAD}
                </p>
                <div className="mt-5">{visit}</div>
            </article>
            <article className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
                <div className="eyebrow">{DETAIL_START_HEADING}</div>
                <h3 className="mt-2 font-display text-h2">
                    {DETAIL_START_QUOTE_TITLE}
                </h3>
                <p className="mt-2 text-sm text-ink-500">
                    {DETAIL_START_QUOTE_LEAD}
                </p>
                <div className="mt-5">{quote}</div>
            </article>
        </div>
    );
}
