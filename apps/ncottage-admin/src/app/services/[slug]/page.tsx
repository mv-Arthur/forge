import { notFound } from "next/navigation";
import type { Service, ServiceScenario } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ServiceForm } from "../ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const [service, services, scenarios] = await Promise.all([
        apiGet<Service>(`/services/${encodeURIComponent(slug)}`).catch(
            () => null
        ),
        apiGet<Service[]>("/services").catch(() => [] as Service[]),
        apiGet<ServiceScenario[]>("/service-scenarios").catch(
            () => [] as ServiceScenario[]
        ),
    ]);
    if (!service) notFound();

    const serviceOptions = services.map((s) => ({
        value: s.slug,
        label: s.shortTitle,
    }));
    const scenarioOptions = scenarios.map((s) => ({
        value: s.slug,
        label: s.title,
    }));

    return (
        <div>
            <PageHeader
                title={service.shortTitle}
                description="Редактирование услуги"
            />
            <ServiceForm
                initial={service}
                submitLabel="Сохранить"
                nextOrder={service.order}
                serviceOptions={serviceOptions}
                scenarioOptions={scenarioOptions}
            />
        </div>
    );
}
