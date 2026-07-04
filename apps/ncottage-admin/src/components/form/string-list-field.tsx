"use client";

import type {
    ArrayPath,
    FieldArray,
    FieldPath,
    FieldValues,
} from "react-hook-form";
import { TextareaField, TextField } from "./fields";
import { RepeaterField } from "./repeater-field";

// Repeater over a string[] modelled as { value }[] for stable field-array keys.
// Used across content collections (terms, requirements, principles, etc.).
export function StringListField<T extends FieldValues = FieldValues>({
    name,
    label,
    addLabel = "Добавить",
    emptyMessage = "Пусто",
    itemNoun = "Пункт",
    multiline = false,
    rows = 3,
    placeholder,
}: {
    name: ArrayPath<T>;
    label?: string;
    addLabel?: string;
    emptyMessage?: string;
    itemNoun?: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
}) {
    return (
        <RepeaterField<T>
            name={name}
            label={label}
            addLabel={addLabel}
            emptyMessage={emptyMessage}
            newItem={() => ({ value: "" }) as FieldArray<T, ArrayPath<T>>}
            itemLabel={(i) => `${itemNoun} ${i + 1}`}
            renderItem={(i) => {
                const fieldName = `${name}.${i}.value` as FieldPath<T>;
                return multiline ? (
                    <TextareaField<T>
                        name={fieldName}
                        rows={rows}
                        placeholder={placeholder}
                    />
                ) : (
                    <TextField<T> name={fieldName} placeholder={placeholder} />
                );
            }}
        />
    );
}
