import type { ReactNode } from "react";
import { LEAD_EYEBROW, LEAD_HEADING } from "@/lib/copy";

export function HomeLead({
    officeHoursLabel,
    telegram,
    whatsapp,
    phone,
    phoneClean,
    form,
}: {
    officeHoursLabel: string;
    telegram: string;
    whatsapp: string;
    phone: string;
    phoneClean: string;
    form: ReactNode;
}) {
    return (
        <section
            id="lead"
            data-section="lead"
            className="section relative overflow-hidden border-t border-ink-150 bg-white"
        >
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-accent-soft/40 to-transparent" />
            <div className="container-page relative grid gap-10 md:grid-cols-2">
                <div>
                    <div className="eyebrow text-accent">{LEAD_EYEBROW}</div>
                    <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                        {LEAD_HEADING}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-ink-500 md:text-lg">
                        Ответим по проекту, материалам и смете. {officeHoursLabel}.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                        <a
                            href={telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-600 underline-offset-4 transition-colors hover:text-accent hover:underline"
                        >
                            Telegram
                        </a>
                        <a
                            href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-600 underline-offset-4 transition-colors hover:text-accent hover:underline"
                        >
                            WhatsApp
                        </a>
                        <a
                            href={`tel:${phoneClean}`}
                            className="text-ink-950 underline-offset-4 transition-colors hover:text-accent hover:underline"
                        >
                            {phone}
                        </a>
                    </div>
                </div>
                <div className="rounded-3xl border border-ink-150 bg-white p-6 shadow-lift md:p-8">
                    {form}
                </div>
            </div>
        </section>
    );
}
