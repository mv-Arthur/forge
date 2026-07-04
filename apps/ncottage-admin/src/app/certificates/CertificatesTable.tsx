"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Certificate } from "@forge/shared";
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
import { deleteCertificateAction } from "./actions";

function DeleteButton({ certificate }: { certificate: Certificate }) {
    const router = useRouter();
    const isAdmin = useIsAdmin();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    if (!isAdmin) return null;

    async function onConfirm() {
        setPending(true);
        const result = await deleteCertificateAction(certificate.slug);
        setPending(false);
        setOpen(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Документ удалён");
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
                    <AlertDialogTitle>Удалить документ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Документ будет удалён без возможности восстановления.
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

const columns: ColumnDef<Certificate>[] = [
    {
        accessorKey: "title",
        header: "Документ",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.title}</span>
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
                    <Link href={`/certificates/${row.original.slug}`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <DeleteButton certificate={row.original} />
            </div>
        ),
    },
];

export function CertificatesTable({ data }: { data: Certificate[] }) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Поиск по названию…"
            emptyMessage="Документы не найдены"
        />
    );
}
