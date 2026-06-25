"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { FaqItem } from "@forge/shared";
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
import { deleteFaqAction } from "./actions";

function DeleteButton({ item }: { item: FaqItem }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteFaqAction(item.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Вопрос удалён");
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
                    <AlertDialogTitle>Удалить вопрос?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вопрос будет удалён без возможности восстановления.
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

const columns: ColumnDef<FaqItem>[] = [
    {
        accessorKey: "question",
        header: "Вопрос",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.question}</span>
        ),
    },
    {
        accessorKey: "group",
        header: "Раздел",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.group}</Badge>
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
                    <Link href={`/faq/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton item={row.original} />
            </div>
        ),
    },
];

export function FaqTable({ data }: { data: FaqItem[] }) {
    const groups = useMemo(
        () => Array.from(new Set(data.map((i) => i.group))),
        [data]
    );
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по вопросу…"
            emptyMessage="Вопросы не найдены"
            facets={[
                {
                    columnId: "group",
                    title: "Раздел",
                    options: groups.map((g) => ({ label: g, value: g })),
                },
            ]}
        />
    );
}
