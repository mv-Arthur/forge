import { apiGet } from "@/lib/api";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type Lead } from "@/lib/types";
import { updateLeadStatus } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("ru-RU", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

export default async function LeadsPage() {
    const leads = await apiGet<Lead[]>("/leads");

    return (
        <div className="legacy-page">
            <h1>Заявки ({leads.length})</h1>
            {leads.length === 0 ? (
                <p>Заявок пока нет.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Источник</th>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Комментарий</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id}>
                                <td>{formatDate(lead.createdAt)}</td>
                                <td>{lead.source}</td>
                                <td>{lead.name ?? "—"}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.comment ?? "—"}</td>
                                <td>
                                    <form
                                        action={updateLeadStatus}
                                        className="row-actions"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={lead.id}
                                        />
                                        <select
                                            name="status"
                                            defaultValue={lead.status}
                                        >
                                            {LEAD_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {LEAD_STATUS_LABELS[s]}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="secondary"
                                        >
                                            ОК
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
