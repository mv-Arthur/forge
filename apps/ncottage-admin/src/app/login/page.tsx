"use client";

import { useActionState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "../actions";

const initial: LoginState = {};

export default function LoginPage() {
    const [state, action, pending] = useActionState(loginAction, initial);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Building2 className="size-5" />
                    </span>
                    <div className="space-y-1">
                        <CardTitle className="text-xl">
                            Вход в админку
                        </CardTitle>
                        <CardDescription>
                            ncottage CMS — управление контентом
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                placeholder="admin@ncottage.local"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        {state.error && (
                            <p className="text-sm text-destructive">
                                {state.error}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={pending}
                        >
                            {pending ? "Вход…" : "Войти"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
