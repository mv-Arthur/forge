import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getCurrentAdmin } from "@/lib/session";
import { UsersTable } from "./UsersTable";
import { listAdminsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const admin = await getCurrentAdmin();
    if (admin?.role !== "admin") notFound();

    const users = await listAdminsAction();

    return (
        <div>
            <PageHeader
                title="Пользователи"
                description={`Всего: ${users.length}`}
            />
            <UsersTable data={users} currentAdminId={admin.id} />
        </div>
    );
}
