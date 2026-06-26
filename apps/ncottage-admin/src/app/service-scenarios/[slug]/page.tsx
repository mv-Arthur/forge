import { notFound } from "next/navigation";
import type { Service, ServiceScenario } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ScenarioForm } from "../ScenarioForm";

export const dynamic = "force-dynamic";

export default async function EditScenarioPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const [scenario, services] = await Promise.all([
        apiGet<ServiceScenario>(
            `/service-scenarios/${encodeURIComponent(slug)}`
        ).catch(() => null),
        apiGet<Service[]>("/services").catch(() => [] as Service[]),
    ]);
    if (!scenario) notFound();

    const serviceOptions = services.map((s) => ({
        value: s.slug,
        label: s.shortTitle,
    }));

    return (
        <div>
            <PageHeader
                title={scenario.title}
                description="Редактирование сценария"
            />
            <ScenarioForm
                initial={scenario}
                submitLabel="Сохранить"
                nextOrder={scenario.order}
                serviceOptions={serviceOptions}
            />
        </div>
    );
}
