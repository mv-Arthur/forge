"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ProjectSelection } from "@forge/shared";
import { useIsAdmin } from "@/components/admin-context";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SELECTION_GROUP_LABELS } from "@/lib/selection-schema";
import { deleteSelectionAction } from "./actions";

function DeleteButton({ selection }: { selection: ProjectSelection }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteSelectionAction(selection.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(`Подборка «${selection.shortTitle}» удалена`);
        router.refresh();
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => setOpen(true)}
                aria-label="Удалить"
            >
                <Trash2 className="size-4" />
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить подборку?</AlertDialogTitle>
                    <AlertDialogDescription>
                        «{selection.shortTitle}» будет удалена без возможности
                        восстановления.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            void onConfirm();
                        }}
                        disabled={pending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        Удалить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const columns: ColumnDef<ProjectSelection>[] = [
    {
        accessorKey: "shortTitle",
        header: "Подборка",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.shortTitle}</span>
        ),
    },
    {
        accessorKey: "group",
        header: "Группа",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {SELECTION_GROUP_LABELS[row.original.group] ??
                    row.original.group}
            </Badge>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {row.original.slug}
            </span>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-1">
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Изменить"
                >
                    <Link href={`/project-selections/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton selection={row.original} />
            </div>
        ),
    },
];

export function SelectionsTable({ data }: { data: ProjectSelection[] }) {
    const groups = useMemo(
        () => Array.from(new Set(data.map((s) => s.group))),
        [data]
    );
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по названию или slug…"
            emptyMessage="Подборки не найдены"
            facets={[
                {
                    columnId: "group",
                    title: "Группа",
                    options: groups.map((g) => ({
                        label: SELECTION_GROUP_LABELS[g] ?? g,
                        value: g,
                    })),
                },
            ]}
        />
    );
}
