import type { Service, ServiceScenario } from "@forge/shared";
import { PageHeader } from "@/components/page-header";
import { apiGet } from "@/lib/api";
import { ScenarioForm } from "../ScenarioForm";

export const dynamic = "force-dynamic";

export default async function NewScenarioPage() {
    const [scenarios, services] = await Promise.all([
        apiGet<ServiceScenario[]>("/service-scenarios").catch(
            () => [] as ServiceScenario[]
        ),
        apiGet<Service[]>("/services").catch(() => [] as Service[]),
    ]);

    const serviceOptions = services.map((s) => ({
        value: s.slug,
        label: s.shortTitle,
    }));
    const nextOrder = scenarios.length
        ? Math.max(...scenarios.map((s) => s.order)) + 1
        : 0;

    return (
        <div>
            <PageHeader
                title="Новый сценарий"
                description="Создание сценария навигатора услуг"
            />
            <ScenarioForm
                submitLabel="Создать"
                nextOrder={nextOrder}
                serviceOptions={serviceOptions}
            />
        </div>
    );
}
