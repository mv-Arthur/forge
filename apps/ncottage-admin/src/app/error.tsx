"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <TriangleAlert className="size-10 text-destructive/70" />
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Что-то пошло не так</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                    {error.message || "Не удалось загрузить данные."}
                </p>
            </div>
            <Button onClick={reset}>Повторить</Button>
        </div>
    );
}
