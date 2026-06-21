import type { LucideIcon } from "lucide-react";

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            {Icon && <Icon className="mb-3 size-10 text-muted-foreground/40" />}
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
