import type { Service, ServiceScenario } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ServiceForm } from "../ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
    const [services, scenarios] = await Promise.all([
        apiGet<Service[]>("/services").catch(() => [] as Service[]),
        apiGet<ServiceScenario[]>("/service-scenarios").catch(
            () => [] as ServiceScenario[]
        ),
    ]);

    const serviceOptions = services.map((s) => ({
        value: s.slug,
        label: s.shortTitle,
    }));
    const scenarioOptions = scenarios.map((s) => ({
        value: s.slug,
        label: s.title,
    }));
    const nextOrder = services.length
        ? Math.max(...services.map((s) => s.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader title="Новая услуга" description="Создание услуги" />
            <ServiceForm
                submitLabel="Создать"
                nextOrder={nextOrder}
                serviceOptions={serviceOptions}
                scenarioOptions={scenarioOptions}
            />
        </div>
    );
}
