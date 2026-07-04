"use client";

import {
    type ArrayPath,
    type FieldArray,
    type FieldValues,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SortableItem({
    id,
    title,
    onRemove,
    children,
}: {
    id: string;
    title: string;
    onRemove: () => void;
    children: React.ReactNode;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn(
                "rounded-lg border bg-card",
                isDragging && "relative z-10 shadow-lg"
            )}
        >
            <div className="flex items-center gap-2 border-b px-3 py-2">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                    aria-label="Перетащить"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="size-4" />
                </button>
                <span className="text-sm font-medium">{title}</span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-auto size-7 text-muted-foreground hover:text-destructive"
                    onClick={onRemove}
                    aria-label="Удалить"
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
            <div className="space-y-3 p-3">{children}</div>
        </div>
    );
}

export function RepeaterField<T extends FieldValues = FieldValues>({
    name,
    label,
    addLabel = "Добавить",
    emptyMessage = "Пока пусто",
    newItem,
    renderItem,
    itemLabel,
}: {
    name: ArrayPath<T>;
    label?: string;
    addLabel?: string;
    emptyMessage?: string;
    newItem: () => FieldArray<T, ArrayPath<T>>;
    renderItem: (index: number) => React.ReactNode;
    itemLabel?: (index: number) => string;
}) {
    const { control } = useFormContext<T>();
    const { fields, append, remove, move } = useFieldArray<T>({
        control,
        name,
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = fields.findIndex((f) => f.id === active.id);
        const newIndex = fields.findIndex((f) => f.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
    }

    return (
        <div className="space-y-3">
            {label && (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append(newItem())}
                    >
                        <Plus className="size-4" />
                        {addLabel}
                    </Button>
                </div>
            )}

            {fields.length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                </p>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <SortableItem
                                    key={field.id}
                                    id={field.id}
                                    title={
                                        itemLabel?.(index) ?? `№ ${index + 1}`
                                    }
                                    onRemove={() => remove(index)}
                                >
                                    {renderItem(index)}
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {!label && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append(newItem())}
                >
                    <Plus className="size-4" />
                    {addLabel}
                </Button>
            )}
        </div>
    );
}
