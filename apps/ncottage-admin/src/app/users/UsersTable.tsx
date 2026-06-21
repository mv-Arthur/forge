"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type AdminUser, type Role, ROLES } from "@forge/shared";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    createAdminAction,
    deleteAdminAction,
    resetAdminPasswordAction,
    updateAdminRoleAction,
} from "./actions";

const ROLE_LABELS: Record<Role, string> = {
    admin: "Администратор",
    editor: "Редактор",
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("ru-RU");
}

function CreateUserDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [role, setRole] = useState<Role>("editor");

    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await createAdminAction({
            email: String(formData.get("email") ?? "").trim(),
            password: String(formData.get("password") ?? ""),
            name: String(formData.get("name") ?? "").trim() || undefined,
            role,
        });
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Пользователь создан");
        setOpen(false);
        setRole("editor");
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4" />
                    Создать пользователя
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Новый пользователь</DialogTitle>
                    <DialogDescription>
                        Учётная запись для входа в админку.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input id="name" name="name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Роль</Label>
                        <Select
                            value={role}
                            onValueChange={(v) => setRole(v as Role)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {ROLE_LABELS[r]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Создание…" : "Создать"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function RoleSelect({ user }: { user: AdminUser }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    async function onChange(role: string) {
        setPending(true);
        const result = await updateAdminRoleAction(user.id, role as Role);
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Роль обновлена");
        router.refresh();
    }
    return (
        <Select value={user.role} onValueChange={onChange} disabled={pending}>
            <SelectTrigger className="h-8 w-[160px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function ResetPasswordDialog({ user }: { user: AdminUser }) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await resetAdminPasswordAction(
            user.id,
            String(formData.get("password") ?? "")
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Пароль обновлён");
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Сбросить пароль"
                >
                    <KeyRound className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Сброс пароля</DialogTitle>
                    <DialogDescription>{user.email}</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Новый пароль</Label>
                        <Input
                            id="new-password"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Сохранение…" : "Сохранить"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserButton({ user }: { user: AdminUser }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    async function onConfirm() {
        setPending(true);
        const result = await deleteAdminAction(user.id);
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Пользователь удалён");
        router.refresh();
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    aria-label="Удалить"
                >
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {user.email} потеряет доступ к админке.
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

export function UsersTable({
    data,
    currentAdminId,
}: {
    data: AdminUser[];
    currentAdminId: string;
}) {
    const columns: ColumnDef<AdminUser>[] = [
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.email}
                    {row.original.id === currentAdminId && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            (вы)
                        </span>
                    )}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Имя",
            cell: ({ row }) => row.original.name ?? "—",
        },
        {
            accessorKey: "role",
            header: "Роль",
            cell: ({ row }) => <RoleSelect user={row.original} />,
        },
        {
            accessorKey: "createdAt",
            header: "Создан",
            cell: ({ row }) => formatDate(row.original.createdAt),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                    <ResetPasswordDialog user={row.original} />
                    {row.original.id !== currentAdminId && (
                        <DeleteUserButton user={row.original} />
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <CreateUserDialog />
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Поиск по email…"
                emptyMessage="Пользователей нет"
            />
        </div>
    );
}
