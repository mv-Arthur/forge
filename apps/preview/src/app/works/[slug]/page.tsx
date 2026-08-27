import { notFound } from "next/navigation";
import { getObjectPage } from "@/actions/catalog/get-object";
import { listObjectSlugs } from "@/actions/catalog/list-object-slugs";
import { unwrapAction } from "@/types/action";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";
import { BuiltObjectDetail } from "@/widgets/built-object-detail/built-object-detail";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const { slugs } = unwrapAction(await listObjectSlugs());
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const { object } = unwrapAction(await getObjectPage(slug));
    return {
        title: object
            ? `${object.displayTitle} · Новый Коттедж`
            : "Дом не найден",
    };
}

export default async function BuiltObjectPage({ params }: Props) {
    const { slug } = await params;
    const { object, others } = unwrapAction(await getObjectPage(slug));
    if (!object) notFound();

    return (
        <BuiltObjectDetail
            object={object}
            others={others}
            leadForm={
                <LeadFormContainer
                    source={`object-${object.slug}`}
                    prefill={`Дом: ${object.displayTitle}`}
                    ctaLabel="Записаться"
                />
            }
        />
    );
}
