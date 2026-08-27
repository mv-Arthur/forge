import { TRUST_HOUSES_LABEL } from "@/lib/copy";

export function HomeTrust({
    foundedYear,
    warrantyYears,
    objectCount,
}: {
    foundedYear: number;
    warrantyYears: number;
    objectCount: number;
}) {
    return (
        <section
            data-section="trust"
            className="border-b border-ink-150 bg-white"
        >
            <div className="container-page py-6 md:py-8">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                        <div className="kpi-value font-display">
                            с {foundedYear}
                        </div>
                        <div className="kpi-label">года строим дома</div>
                    </div>
                    <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                        <div className="kpi-value font-display">
                            {warrantyYears} лет
                        </div>
                        <div className="kpi-label">гарантия в договоре</div>
                    </div>
                    <div className="kpi rounded-2xl border border-ink-100 bg-ink-50/60 px-5 py-6">
                        <div className="kpi-value font-display">
                            {objectCount}
                        </div>
                        <div className="kpi-label">{TRUST_HOUSES_LABEL}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
