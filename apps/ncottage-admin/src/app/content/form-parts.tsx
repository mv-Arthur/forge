"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Section({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

export function SaveBar({
    pending,
    submitLabel = "Сохранить",
}: {
    pending: boolean;
    submitLabel?: string;
}) {
    const router = useRouter();
    return (
        <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
            <Button type="submit" disabled={pending}>
                {pending ? "Сохранение…" : submitLabel}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/content")}
            >
                Назад
            </Button>
        </div>
    );
}
