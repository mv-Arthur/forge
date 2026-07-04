"use client";

import {
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import { ImageOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MediaPicker } from "./media-picker";

export function MediaField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
    folder,
}: {
    name: FieldPath<T>;
    label?: string;
    description?: string;
    folder?: string;
}) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <div className="flex items-start gap-3">
                        <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                            {field.value ? (
                                // eslint-disable-next-line @next/next/no-img-element -- arbitrary S3 hosts, admin-internal
                                <img
                                    src={field.value}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <ImageOff className="size-6" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <MediaPicker
                                    folder={folder}
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                        >
                                            {field.value
                                                ? "Заменить"
                                                : "Выбрать"}
                                        </Button>
                                    }
                                    onSelect={(media) =>
                                        field.onChange(media[0]?.url ?? "")
                                    }
                                />
                                {field.value && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => field.onChange("")}
                                    >
                                        <X className="size-4" />
                                        Очистить
                                    </Button>
                                )}
                            </div>
                            <FormControl>
                                <Input
                                    placeholder="или вставьте путь вручную"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                        </div>
                    </div>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
