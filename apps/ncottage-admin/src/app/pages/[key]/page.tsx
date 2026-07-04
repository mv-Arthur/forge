import { notFound } from "next/navigation";
import type { BuiltObject, Page } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { sectionLabel } from "@/lib/page-meta";
import { SECTION_FORMS } from "@/lib/page-sections";
import { PageMetaForm } from "./PageMetaForm";
import { SectionCard } from "./SectionCard";

export const dynamic = "force-dynamic";

export default async function PageEditorPage({
    params,
}: {
    params: Promise<{ key: string }>;
}) {
    const { key } = await params;
    const page = await apiGet<Page>(
        `/pages/${encodeURIComponent(key)}`
    ).catch(() => undefined);
    if (!page) notFound();

    // Опции для пикеров внутри секций (featuredProject ссылается на объект).
    const builtObjects = await apiGet<BuiltObject[]>("/built-objects").catch(
        () => [] as BuiltObject[]
    );
    const builtObjectOptions = builtObjects.map((b) => ({
        value: b.id,
        label: b.title,
    }));

    return (
        <div>
            <PageHeader
                title={page.title}
                description={`Ключ: ${key} · секций: ${page.sections.length}`}
            />
            <div className="max-w-3xl space-y-6">
                <PageMetaForm
                    pageKey={key}
                    initial={{
                        title: page.title,
                        seoTitle: page.seoTitle,
                        seoDescription: page.seoDescription,
                    }}
                />
                {page.sections.map((section, index) => (
                    <SectionCard
                        key={section.id}
                        pageKey={key}
                        section={section}
                        builtObjectOptions={builtObjectOptions}
                        label={sectionLabel(
                            key,
                            index,
                            SECTION_FORMS[section.type]?.typeLabel ??
                                section.type
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
