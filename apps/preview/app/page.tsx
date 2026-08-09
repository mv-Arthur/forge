import Link from "next/link";
import { getAllProjects } from "@/lib/data";
import { settings } from "@/lib/settings";
import { ProjectCarousel } from "@/components/ProjectCarousel";

export const metadata = {
    title: "Новый Коттедж — дома под ключ в СПб и Ленобласти",
};

export default function HomePage() {
    const all = getAllProjects();
    const strip = all.filter((p) => p.renders.length > 0).slice(0, 8);

    const kpis = [
        {
            value: String(settings.yearsOnMarket),
            label: "лет на рынке",
        },
        {
            value: String(settings.builtHouses),
            label: "домов построено",
        },
        {
            value: `${settings.warrantyYears} лет`,
            label: "гарантия в договоре",
        },
        {
            value: `${settings.recommendRate}%`,
            label: "рекомендуют нас",
        },
    ];

    return (
        <main>
            <section className="border-b border-ink-150 bg-white">
                <div className="container-page py-12 md:py-16">
                    <div className="eyebrow text-accent">Дома под ключ</div>
                    <h1 className="mt-3 max-w-3xl font-display text-display-1 text-ink-950">
                        Готовые проекты и реальные дома в&nbsp;Ленобласти
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
                        Фиксированная смета, гарантия {settings.warrantyYears}{" "}
                        лет, фотоотчёты каждую неделю. Выберите проект или
                        посмотрите, как уже живут в наших домах.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/projects"
                            className="btn btn-primary btn-lg"
                        >
                            Смотреть проекты
                        </Link>
                        <Link href="/works" className="btn btn-light btn-lg">
                            Построенные дома
                        </Link>
                        <Link
                            href="/projects?quiz=1"
                            className="btn btn-ghost btn-lg"
                        >
                            Подобрать за 2 минуты
                        </Link>
                    </div>
                </div>
            </section>

            <section className="border-b border-ink-150 bg-ink-50/60">
                <div className="container-page py-10 md:py-12">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {kpis.map((k) => (
                            <div key={k.label} className="kpi">
                                <div className="kpi-value">{k.value}</div>
                                <div className="kpi-label">{k.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container-page">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-xl">
                            <div className="eyebrow text-accent">
                                Каталог
                            </div>
                            <h2 className="mt-2 font-display text-h1 text-ink-950">
                                Проекты из каталога
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-ink-500 md:text-base">
                                Фото, цена «от» и параметры из прайса — сначала
                                дом, потом детали.
                            </p>
                        </div>
                        <Link
                            href="/projects"
                            className="btn btn-light"
                        >
                            Весь каталог
                        </Link>
                    </div>
                    <ProjectCarousel projects={strip} />
                </div>
            </section>

            <section className="border-t border-ink-150 bg-ink-900 text-paper">
                <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
                    <div className="max-w-xl">
                        <div className="eyebrow text-accent-onDark">
                            Следующий шаг
                        </div>
                        <h2 className="mt-2 font-display text-h1 text-paper">
                            Посмотрите дом вживую или выберите проект
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-ink-400 md:text-base">
                            Можно приехать на объект или сразу подобрать
                            планировку под бюджет и участок.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/works" className="btn btn-primary btn-lg">
                            Наши работы
                        </Link>
                        <Link
                            href="/projects"
                            className="btn btn-light btn-lg !border-white/20 !bg-white/10 !text-paper hover:!bg-white/15"
                        >
                            Готовые проекты
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
