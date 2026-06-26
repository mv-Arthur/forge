import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import type { PageSummary } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from "@/lib/api";
import { PAGE_DESCRIPTIONS } from "@/lib/page-meta";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
    const pages = await apiGet<PageSummary[]>("/pages");

    return (
        <div>
            <PageHeader
                title="Страницы"
                description="Контентные страницы сайта и их секции"
            />
            {pages.length === 0 ? (
                <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    Страниц пока нет
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <Link key={page.key} href={`/pages/${page.key}`}>
                            <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/40">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="rounded-md bg-accent p-2 text-foreground">
                                        <FileText className="size-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 font-medium">
                                            {page.title}
                                            <ChevronRight className="size-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {PAGE_DESCRIPTIONS[page.key] ??
                                                `Секций: ${page.sectionCount}`}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
