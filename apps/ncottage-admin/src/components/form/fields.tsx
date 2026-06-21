"use client";

import {
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BaseFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    description?: string;
    placeholder?: string;
}

export function TextField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
    placeholder,
    type = "text",
}: BaseFieldProps<T> & { type?: string }) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function NumberField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
    placeholder,
}: BaseFieldProps<T>) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            type="number"
                            inputMode="numeric"
                            placeholder={placeholder}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value ?? ""}
                            onChange={(e) =>
                                field.onChange(
                                    e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value)
                                )
                            }
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function TextareaField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
    placeholder,
    rows = 4,
}: BaseFieldProps<T> & { rows?: number }) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Textarea
                            rows={rows}
                            placeholder={placeholder}
                            {...field}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function SelectField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
    placeholder,
    options,
}: BaseFieldProps<T> & { options: { label: string; value: string }[] }) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function CheckboxField<T extends FieldValues = FieldValues>({
    name,
    label,
    description,
}: BaseFieldProps<T>) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                        <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                        {label && (
                            <FormLabel className="font-normal">
                                {label}
                            </FormLabel>
                        )}
                        {description && (
                            <FormDescription>{description}</FormDescription>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}

// Multi-select rendered as a grid of checkboxes backed by a string[] value.
export function CheckboxGroupField<T extends FieldValues = FieldValues>({
    name,
    label,
    options,
}: BaseFieldProps<T> & { options: { label: string; value: string }[] }) {
    const { control } = useFormContext<T>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const selected: string[] = field.value ?? [];
                const toggle = (value: string, checked: boolean) => {
                    field.onChange(
                        checked
                            ? [...selected, value]
                            : selected.filter((v) => v !== value)
                    );
                };
                return (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {options.map((opt) => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-2 text-sm font-normal"
                                >
                                    <Checkbox
                                        checked={selected.includes(opt.value)}
                                        onCheckedChange={(c) =>
                                            toggle(opt.value, Boolean(c))
                                        }
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
