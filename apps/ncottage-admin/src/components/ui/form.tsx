"use client";

import * as React from "react";
import type { Label as LabelPrimitive } from "radix-ui";
import { Slot } from "radix-ui";
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Опциональная zod-схема формы: поля сами выводят обязательность из неё, чтобы
// не размечать каждое поле вручную. Поле обязательно, если оно не optional и не
// принимает пустую строку (т.е. имеет .min(1) — в отличие от очищаемых полей).
const FormSchemaContext = React.createContext<z.ZodType | null>(null);

function Form<TFieldValues extends FieldValues, TContext = unknown>({
    schema,
    ...props
}: UseFormReturn<TFieldValues, TContext> & {
    children: React.ReactNode;
    schema?: z.ZodType;
}) {
    return (
        <FormSchemaContext.Provider value={schema ?? null}>
            <FormProvider {...props} />
        </FormSchemaContext.Provider>
    );
}

export function useFieldRequired(name: string): boolean {
    const schema = React.useContext(FormSchemaContext);
    const shape = (schema as { shape?: Record<string, unknown> } | null)
        ?.shape;
    const field = shape?.[name] as
        | { isOptional?: () => boolean; safeParse?: (v: unknown) => { success: boolean } }
        | undefined;
    if (!field) return false;
    if (typeof field.isOptional === "function" && field.isOptional()) {
        return false;
    }
    try {
        return field.safeParse?.("").success === false;
    } catch {
        return true;
    }
}

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);

function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                data-slot="form-item"
                className={cn("grid gap-2", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}

function FormLabel({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField();

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn("data-[error=true]:text-destructive", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot.Root
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn("text-sm text-destructive", className)}
            {...props}
        >
            {body}
        </p>
    );
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
};
