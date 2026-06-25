"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Article } from "@forge/shared";
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
import { deleteArticleAction } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

function formatDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function DeleteButton({ article }: { article: Article }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteArticleAction(article.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(`Статья «${article.title}» удалена`);
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
                    <AlertDialogTitle>Удалить статью?</AlertDialogTitle>
                    <AlertDialogDescription>
                        «{article.title}» будет удалена без возможности
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

const columns: ColumnDef<Article>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <SortableHeader column={column} title="Заголовок" />
        ),
        cell: ({ row }) => (
            <span className="font-medium">{row.original.title}</span>
        ),
    },
    {
        accessorKey: "category",
        header: "Категория",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.category}</Badge>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => <SortableHeader column={column} title="Дата" />,
        cell: ({ row }) => formatDate(row.original.date),
    },
    {
        accessorKey: "readTime",
        header: "Чтение",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.readTime}
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
                    <Link href={`/blog/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton article={row.original} />
            </div>
        ),
    },
];

export function ArticlesTable({ data }: { data: Article[] }) {
    const categories = useMemo(
        () => Array.from(new Set(data.map((a) => a.category))),
        [data]
    );
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по заголовку…"
            emptyMessage="Статьи не найдены"
            facets={[
                {
                    columnId: "category",
                    title: "Категория",
                    options: categories.map((c) => ({ label: c, value: c })),
                },
            ]}
        />
    );
}
