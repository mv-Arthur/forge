import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <p className="text-4xl font-semibold text-muted-foreground/60">
                404
            </p>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Страница не найдена</h2>
                <p className="text-sm text-muted-foreground">
                    Такого раздела нет или он ещё не готов.
                </p>
            </div>
            <Button asChild>
                <Link href="/projects">К проектам</Link>
            </Button>
        </div>
    );
}
