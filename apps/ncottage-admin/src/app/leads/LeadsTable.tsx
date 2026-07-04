"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Clock, RefreshCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    type DeliveryState,
    deliveryState,
    type Lead,
    LEAD_SOURCE_LABELS,
    LEAD_SOURCES,
    LEAD_STATUS_LABELS,
    LEAD_STATUSES,
    type LeadStatus,
} from "@/lib/types";
import { redeliverLeadAction, updateLeadStatusAction } from "./actions";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("ru-RU", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

const DELIVERY_META: Record<
    DeliveryState,
    { label: string; variant: BadgeVariant; icon: typeof Clock }
> = {
    delivered: { label: "Доставлено", variant: "default", icon: CheckCircle2 },
    failed: { label: "Ошибка", variant: "destructive", icon: TriangleAlert },
    pending: { label: "В очереди", variant: "secondary", icon: Clock },
};

function DeliveryBadge({ lead }: { lead: Lead }) {
    const meta = DELIVERY_META[deliveryState(lead)];
    const Icon = meta.icon;
    return (
        <Badge variant={meta.variant} className="gap-1">
            <Icon className="size-3" />
            {meta.label}
        </Badge>
    );
}

function LeadDetail({ lead }: { lead: Lead }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const state = deliveryState(lead);

    async function onStatusChange(status: string) {
        setPending(true);
        const result = await updateLeadStatusAction(
            lead.id,
            status as LeadStatus
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Статус обновлён");
        router.refresh();
    }

    async function onRedeliver() {
        setPending(true);
        const result = await redeliverLeadAction(lead.id);
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Отправлено повторно");
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Открыть
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Заявка</DialogTitle>
                    <DialogDescription>
                        {LEAD_SOURCE_LABELS[lead.source] ?? lead.source} ·{" "}
                        {formatDate(lead.createdAt)}
                    </DialogDescription>
                </DialogHeader>

                <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Телефон</dt>
                    <dd className="font-medium">{lead.phone}</dd>
                    <dt className="text-muted-foreground">Имя</dt>
                    <dd>{lead.name ?? "—"}</dd>
                    <dt className="text-muted-foreground">Проект</dt>
                    <dd>{lead.project ?? "—"}</dd>
                    <dt className="text-muted-foreground">Удобное время</dt>
                    <dd>{lead.preferredTime ?? "—"}</dd>
                    <dt className="text-muted-foreground">Комментарий</dt>
                    <dd className="whitespace-pre-wrap">
                        {lead.comment ?? "—"}
                    </dd>
                    <dt className="text-muted-foreground">Согласие</dt>
                    <dd>{lead.consent ? "да" : "—"}</dd>
                </dl>

                <div className="rounded-lg border p-3 text-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Доставка</span>
                        <DeliveryBadge lead={lead} />
                    </div>
                    <p className="text-muted-foreground">
                        Попыток: {lead.deliveryAttempts}
                        {lead.deliveredAt
                            ? ` · доставлено ${formatDate(lead.deliveredAt)}`
                            : ""}
                    </p>
                    {lead.deliveryError && (
                        <p className="mt-1 text-destructive">
                            {lead.deliveryError}
                        </p>
                    )}
                    {state !== "delivered" && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={onRedeliver}
                            disabled={pending}
                        >
                            <RefreshCw className="size-4" />
                            Доставить повторно
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-medium">Статус</span>
                    <Select
                        value={lead.status}
                        onValueChange={onStatusChange}
                        disabled={pending}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LEAD_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {LEAD_STATUS_LABELS[s]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const STATUS_VARIANT: Record<LeadStatus, BadgeVariant> = {
    new: "default",
    contacted: "secondary",
    archived: "outline",
};

const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column} title="Дата" />,
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {formatDate(row.original.createdAt)}
            </span>
        ),
    },
    {
        accessorKey: "source",
        header: "Источник",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant="outline">
                {LEAD_SOURCE_LABELS[row.original.source] ?? row.original.source}
            </Badge>
        ),
    },
    {
        accessorKey: "name",
        header: "Имя",
        cell: ({ row }) => row.original.name ?? "—",
    },
    { accessorKey: "phone", header: "Телефон" },
    {
        accessorKey: "status",
        header: "Статус",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant={STATUS_VARIANT[row.original.status]}>
                {LEAD_STATUS_LABELS[row.original.status]}
            </Badge>
        ),
    },
    {
        id: "delivery",
        accessorFn: (lead) => deliveryState(lead),
        header: "Доставка",
        filterFn: "equalsString",
        cell: ({ row }) => <DeliveryBadge lead={row.original} />,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <div className="text-right">
                <LeadDetail lead={row.original} />
            </div>
        ),
    },
];

export function LeadsTable({ data }: { data: Lead[] }) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по имени, телефону…"
            emptyMessage="Заявок нет"
            facets={[
                {
                    columnId: "source",
                    title: "Источник",
                    options: LEAD_SOURCES.map((s) => ({
                        label: LEAD_SOURCE_LABELS[s],
                        value: s,
                    })),
                },
                {
                    columnId: "status",
                    title: "Статус",
                    options: LEAD_STATUSES.map((s) => ({
                        label: LEAD_STATUS_LABELS[s],
                        value: s,
                    })),
                },
                {
                    columnId: "delivery",
                    title: "Доставка",
                    options: [
                        { label: "Доставлено", value: "delivered" },
                        { label: "Ошибка", value: "failed" },
                        { label: "В очереди", value: "pending" },
                    ],
                },
            ]}
        />
    );
}
