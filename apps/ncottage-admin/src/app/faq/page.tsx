import Link from "next/link";
import { Plus } from "lucide-react";
import type { FaqItem } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { FaqTable } from "./FaqTable";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
    const items = await apiGet<FaqItem[]>("/faq");

    return (
        <div>
            <PageHeader
                title="Вопрос-ответ"
                description={`Всего: ${items.length}`}
                action={
                    <Button asChild>
                        <Link href="/faq/new">
                            <Plus className="size-4" />
                            Новый вопрос
                        </Link>
                    </Button>
                }
            />
            <FaqTable data={items} />
        </div>
    );
}
