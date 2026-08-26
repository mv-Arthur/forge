import Link from "next/link";
import { NAV_WORKS } from "@/lib/copy";

interface Props {
    title: string;
    /** What this page would be on the real site, plain language. */
    topic?: string;
}

export function OutOfScopePage({ title, topic }: Props) {
    return (
        <main className="container-page py-20 md:py-28">
            <div className="mx-auto max-w-2xl">
                <div className="eyebrow text-accent">Демонстрация</div>
                <h1 className="mt-2 font-display text-h1 text-ink-950">
                    {title}
                </h1>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
                    {topic
                        ? `Раздел «${topic}» есть на действующем сайте, но в эту демонстрацию не входит.`
                        : "Этот раздел есть на действующем сайте, но в эту демонстрацию не входит."}{" "}
                    Сейчас показываем только подбор готовых проектов и просмотр
                    построенных домов — чтобы согласовать направление, а не
                    собрать весь сайт целиком.
                </p>

                <div className="mt-8 rounded-2xl border border-ink-150 bg-ink-50 p-5">
                    <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                        Что можно посмотреть
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/projects"
                            className="btn btn-primary btn-lg"
                        >
                            Готовые проекты
                        </Link>
                        <Link href="/works" className="btn btn-light btn-lg">
                            {NAV_WORKS}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
