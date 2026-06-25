import Link from "next/link";
import { ChevronRight, Contact, Menu, Newspaper, PanelBottom } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

interface ContentLink {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

const LINKS: ContentLink[] = [
    {
        href: "/content/nav",
        title: "Навигация",
        description: "Верхнее меню сайта и выпадающие подпункты",
        icon: Menu,
    },
    {
        href: "/content/footer",
        title: "Футер",
        description: "Слоган, меню, офисы, реквизиты и нижние ссылки",
        icon: PanelBottom,
    },
    {
        href: "/content/contacts",
        title: "Контакты",
        description: "Телефоны, адреса, соцсети и реквизиты компании",
        icon: Contact,
    },
    {
        href: "/content/blog_page",
        title: "Страница блога",
        description: "Заголовки секций и блок призыва на странице /blog",
        icon: Newspaper,
    },
];

export default function ContentPage() {
    return (
        <div>
            <PageHeader
                title="Контент"
                description="Глобальные настройки сайта"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/40">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="rounded-md bg-accent p-2 text-foreground">
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 font-medium">
                                            {link.title}
                                            <ChevronRight className="size-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {link.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
