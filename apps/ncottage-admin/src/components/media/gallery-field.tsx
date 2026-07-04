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
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { MediaPicker } from "./media-picker";

function SortableThumb({
    id,
    url,
    onRemove,
}: {
    id: string;
    url: string;
    onRemove: () => void;
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
                "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
                isDragging && "z-10 shadow-lg"
            )}
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary S3 hosts, admin-internal */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
                type="button"
                className="absolute top-1 left-1 cursor-grab touch-none rounded bg-background/80 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                aria-label="Перетащить"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="size-4" />
            </button>
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 rounded bg-background/80 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                aria-label="Удалить"
            >
                <X className="size-4" />
            </button>
        </div>
    );
}

export function GalleryField<T extends FieldValues = FieldValues>({
    name,
    label,
    folder,
}: {
    name: ArrayPath<T>;
    label?: string;
    folder?: string;
}) {
    const { control } = useFormContext<T>();
    const { fields, append, remove, move } = useFieldArray<T>({
        control,
        name,
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
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
            <div className="flex items-center justify-between">
                {label && <FormLabel>{label}</FormLabel>}
                <MediaPicker
                    multiple
                    folder={folder}
                    trigger={
                        <Button type="button" variant="outline" size="sm">
                            <ImagePlus className="size-4" />
                            Добавить из медиатеки
                        </Button>
                    }
                    onSelect={(media) =>
                        media.forEach((m) =>
                            append({ value: m.url } as FieldArray<
                                T,
                                ArrayPath<T>
                            >)
                        )
                    }
                />
            </div>

            {fields.length === 0 ? (
                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Изображений нет
                </p>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={fields.map((f) => f.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {fields.map((field, index) => (
                                <SortableThumb
                                    key={field.id}
                                    id={field.id}
                                    url={
                                        (field as unknown as { value: string })
                                            .value
                                    }
                                    onRemove={() => remove(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
