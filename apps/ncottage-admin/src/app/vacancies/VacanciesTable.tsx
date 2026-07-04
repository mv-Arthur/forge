"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Vacancy } from "@forge/shared";
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
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteVacancyAction } from "./actions";

function DeleteButton({ vacancy }: { vacancy: Vacancy }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteVacancyAction(vacancy.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(`Вакансия «${vacancy.title}» удалена`);
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
                    <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
                    <AlertDialogDescription>
                        «{vacancy.title}» будет удалена без возможности
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

const columns: ColumnDef<Vacancy>[] = [
    {
        accessorKey: "title",
        header: "Должность",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.title}</span>
        ),
    },
    {
        accessorKey: "salary",
        header: "Зарплата",
        cell: ({ row }) => row.original.salary,
    },
    {
        accessorKey: "experience",
        header: "Опыт",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.experience}
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
                    <Link href={`/vacancies/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton vacancy={row.original} />
            </div>
        ),
    },
];

export function VacanciesTable({ data }: { data: Vacancy[] }) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по должности…"
            emptyMessage="Вакансии не найдены"
        />
    );
}
