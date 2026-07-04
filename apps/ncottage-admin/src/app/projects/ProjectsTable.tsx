"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type Project, TECHNOLOGIES } from "@forge/shared";
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
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { deleteProjectAction } from "./actions";

const priceFormatter = new Intl.NumberFormat("ru-RU");

function DeleteButton({ project }: { project: Project }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteProjectAction(project.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(`Проект «${project.name}» удалён`);
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
                    <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                    <AlertDialogDescription>
                        «{project.name}» будет удалён без возможности
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

const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <SortableHeader column={column} title="Название" />
        ),
        cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
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
        accessorKey: "technology",
        header: "Технология",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.technology}</Badge>
        ),
    },
    {
        accessorKey: "area",
        header: ({ column }) => (
            <SortableHeader column={column} title="Площадь" />
        ),
        cell: ({ row }) => `${row.original.area} м²`,
    },
    {
        accessorKey: "price",
        header: ({ column }) => <SortableHeader column={column} title="Цена" />,
        cell: ({ row }) => `${priceFormatter.format(row.original.price)} ₽`,
    },
    {
        accessorKey: "featured",
        header: "На главной",
        cell: ({ row }) =>
            row.original.featured ? (
                <Badge>да</Badge>
            ) : (
                <span className="text-muted-foreground">—</span>
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
                    <Link href={`/projects/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton project={row.original} />
            </div>
        ),
    },
];

export function ProjectsTable({ data }: { data: Project[] }) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по названию или slug…"
            emptyMessage="Проекты не найдены"
            facets={[
                {
                    columnId: "technology",
                    title: "Технология",
                    options: TECHNOLOGIES.map((t) => ({ label: t, value: t })),
                },
            ]}
        />
    );
}
