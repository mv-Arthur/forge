"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { PageSection } from "@forge/shared";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SECTION_FORMS } from "@/lib/page-sections";
import { savePageSectionAction } from "../actions";

export function SectionCard({
    pageKey,
    section,
    label,
}: {
    pageKey: string;
    section: PageSection;
    label: string;
}) {
    const def = SECTION_FORMS[section.type];
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<FieldValues>({
        resolver: def
            ? (zodResolver(def.schema as never) as Resolver<FieldValues>)
            : undefined,
        defaultValues: def ? def.toForm(section.data) : {},
    });

    if (!def) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Тип секции «{section.type}» пока не редактируется.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const Fields = def.Fields;

    async function onSubmit(values: FieldValues) {
        if (!def) return;
        setPending(true);
        const result = await savePageSectionAction(
            pageKey,
            section.id,
            def.toData(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Секция сохранена");
        router.refresh();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    {label}
                    <span className="rounded bg-accent px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        {def.typeLabel}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Fields />
                        <Button type="submit" disabled={pending}>
                            {pending ? "Сохранение…" : "Сохранить секцию"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
