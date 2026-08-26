import Link from "next/link";
import Image from "next/image";
import { settings } from "@/lib/settings";
import { PhoneIcon, TelegramIcon, WhatsappIcon } from "./Icons";

const linkCols = [
    {
        title: "Готовые проекты",
        links: [
            { href: "/projects", label: "Все проекты" },
            { href: "/projects?tech=gas_concrete", label: "Газобетон" },
            { href: "/projects?tech=brick", label: "Кирпич" },
            { href: "/projects?tech=frame", label: "Каркас" },
            { href: "/projects?tech=sip", label: "СИП" },
        ],
    },
    {
        title: "Построенные дома",
        links: [
            { href: "/works", label: "Все дома" },
            { href: "/works?status=built", label: "Построенные" },
            { href: "/works?status=in-progress", label: "Строятся" },
        ],
    },
];

export function Footer() {
    return (
        <footer
            data-section="site-footer"
            className="mt-section border-t border-ink-150 bg-ink-900 text-ink-300"
        >
            <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Link href="/" className="inline-flex items-center">
                        <Image
                            src="/images/logo.png"
                            alt="Новый Коттедж"
                            width={772}
                            height={317}
                            className="h-9 w-auto brightness-0 invert"
                        />
                    </Link>
                    <p className="mt-4 max-w-sm text-sm text-ink-300">
                        Строим дома под ключ в Санкт-Петербурге и Ленинградской
                        области с {settings.foundedYear} года. Договор с
                        фиксированной сметой, гарантия {settings.warrantyYears}{" "}
                        лет.
                    </p>
                    <div className="mt-6 space-y-2">
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className="flex items-center gap-2 font-display text-lg font-semibold text-paper"
                        >
                            <PhoneIcon className="h-4 w-4" />
                            {settings.phone}
                        </a>
                        <div className="flex gap-2">
                            <a
                                href={settings.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tg btn-sm"
                            >
                                <TelegramIcon className="h-4 w-4" />
                                Telegram
                            </a>
                            <a
                                href={settings.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-wa btn-sm"
                            >
                                <WhatsappIcon className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
                {linkCols.map((col) => (
                    <div key={col.title}>
                        <div className="font-semibold text-paper">
                            {col.title}
                        </div>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {col.links.map((l) => (
                                <li key={l.href + l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-ink-300 transition-colors hover:text-white"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-white/5">
                <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-ink-400 md:flex-row md:items-center">
                    <div>
                        © 2026 «Новый Коттедж» · ИНН {settings.inn} · Санкт-Петербург
                    </div>
                    <div className="flex flex-wrap gap-4 text-[12px] text-ink-400">
                        <Link
                            href="/privacy"
                            className="hover:text-white"
                        >
                            Политика конфиденциальности
                        </Link>
                        <Link href="/offer" className="hover:text-white">
                            Оферта
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
