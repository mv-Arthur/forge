import { notFound } from "next/navigation";
import type { Setting } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { BlogPageForm } from "./BlogPageForm";

export const dynamic = "force-dynamic";

export default async function BlogSettingPage() {
    const setting = await apiGet<Setting<"blog_page">>(
        "/settings/blog_page"
    ).catch(() => null);
    if (!setting) notFound();

    return (
        <div>
            <PageHeader
                title="Страница блога"
                description="Заголовки секций и блок призыва на /blog"
            />
            <BlogPageForm initial={setting.value} />
        </div>
    );
}
