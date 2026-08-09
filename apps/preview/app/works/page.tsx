import Link from "next/link";
import { Suspense } from "react";
import { getAllObjects } from "@/lib/data";
import { WorksMapAndGrid } from "@/components/WorksMapAndGrid";
import { VisitLauncher } from "@/components/VisitLauncher";
import { formatTechnologyBrand, objectsWord } from "@/lib/format";
import type { Technology } from "@/lib/types";

export const metadata = {
    title: "Построенные дома · Новый Коттедж",
};

export default function WorksPage() {
    const objects = getAllObjects();
    const built = objects.filter((o) => o.status === "built").length;

    const techCounts = new Map<Technology, number>();
    for (const o of objects) {
        if (!o.technology) continue;
        techCounts.set(o.technology, (techCounts.get(o.technology) ?? 0) + 1);
    }
    const techs = Array.from(techCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t)
        .slice(0, 3);

    return (
        <main>
            <section className="border-b border-ink-150 bg-white">
                <div className="container-page py-10 md:py-14">
                    <div className="text-xs text-ink-500">
                        <Link href="/" className="hover:text-ink-950">
                            Главная
                        </Link>{" "}
                        ·{" "}
                        <span className="text-ink-700">Построенные дома</span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">Вживую</div>
                            <h1 className="mt-2 font-display text-display-2">
                                Дома, которые уже стоят
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-ink-500 md:text-base">
                                Не рендеры из каталога — реальные объекты в
                                Ленобласти. Можно приехать, посмотреть узлы и
                                понять, как будет выглядеть ваш дом.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <VisitLauncher buttonLabel="Записаться на показ" />
                            <Link
                                href="/projects"
                                className="btn btn-light btn-lg"
                            >
                                Выбрать проект
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Link
                            href="/works?status=built#catalog"
                            className="chip chip-btn"
                        >
                            Можно посмотреть · {built}
                        </Link>
                        <Link
                            href="/works?status=in-progress#catalog"
                            className="chip chip-btn"
                        >
                            Сейчас строим
                        </Link>
                        {techs.map((t) => (
                            <Link
                                key={t}
                                href={`/works?tech=${t}#catalog`}
                                className="chip chip-btn"
                            >
                                {formatTechnologyBrand(t)}
                            </Link>
                        ))}
                        <Link href="/projects" className="chip chip-btn">
                            {objects.length}{" "}
                            {objectsWord(objects.length)} → в каталог
                        </Link>
                    </div>
                </div>
            </section>

            <div
                id="catalog"
                className="container-page pt-4 md:pt-6 scroll-mt-28"
            >
                <Suspense
                    fallback={
                        <div className="py-16 text-center text-ink-500">
                            Загрузка…
                        </div>
                    }
                >
                    <WorksMapAndGrid objects={objects} />
                </Suspense>
            </div>
        </main>
    );
}
