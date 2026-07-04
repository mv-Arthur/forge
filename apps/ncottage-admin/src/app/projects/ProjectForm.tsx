"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    type Project,
    TECHNOLOGIES,
} from "@forge/shared";
import {
    CheckboxField,
    CheckboxGroupField,
    NumberField,
    SelectField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { GalleryField } from "@/components/media/gallery-field";
import { MediaField } from "@/components/media/media-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    type ProjectFormValues,
    emptyProjectValues,
    formValuesToProject,
    projectSchema,
    projectToFormValues,
} from "@/lib/project-schema";
import { saveProjectAction } from "./actions";
import { RelatedProjectsField } from "./RelatedProjectsField";

type V = ProjectFormValues;

const enumOptions = (values: readonly string[]) =>
    values.map((v) => ({ label: v, value: v }));

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

export function ProjectForm({
    initial,
    submitLabel,
}: {
    initial?: Project;
    submitLabel: string;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const form = useForm<V>({
        resolver: zodResolver(projectSchema),
        defaultValues: initial
            ? projectToFormValues(initial)
            : emptyProjectValues(),
    });

    async function onSubmit(values: V) {
        setPending(true);
        const result = await saveProjectAction(
            initial?.slug ?? null,
            formValuesToProject(values)
        );
        setPending(false);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success(initial ? "Проект сохранён" : "Проект создан");
        router.push("/projects");
        router.refresh();
    }

    return (
        <Form {...form} schema={projectSchema}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl space-y-6"
            >
                <Section title="Основное">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="slug"
                            label="Slug"
                            placeholder="nord"
                        />
                        <TextField<V>
                            name="name"
                            label="Название"
                            placeholder="Норд"
                        />
                        <SelectField<V>
                            name="technology"
                            label="Технология"
                            options={enumOptions(TECHNOLOGIES)}
                        />
                        <SelectField<V>
                            name="style"
                            label="Стиль"
                            options={enumOptions(PROJECT_STYLES)}
                        />
                        <SelectField<V>
                            name="livingType"
                            label="Тип проживания"
                            options={enumOptions(PROJECT_LIVING_TYPES)}
                        />
                    </div>
                    <TextareaField<V>
                        name="description"
                        label="Описание"
                        rows={5}
                    />
                    <CheckboxField<V>
                        name="featured"
                        label="Показывать на главной (featured)"
                    />
                </Section>

                <Section title="Параметры">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <NumberField<V> name="price" label="Цена, ₽" />
                        <NumberField<V> name="area" label="Площадь, м²" />
                        <NumberField<V> name="floors" label="Этажей" />
                        <NumberField<V> name="bedrooms" label="Спален" />
                        <NumberField<V> name="bathrooms" label="Санузлов" />
                    </div>
                </Section>

                <Section title="Характеристики">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField<V>
                            name="specs.dimensions"
                            label="Габариты"
                        />
                        <TextField<V> name="specs.roofType" label="Кровля" />
                        <TextField<V>
                            name="specs.foundation"
                            label="Фундамент"
                        />
                        <TextField<V>
                            name="specs.wallMaterial"
                            label="Материал стен"
                        />
                        <TextField<V>
                            name="specs.buildTime"
                            label="Срок строительства"
                        />
                    </div>
                </Section>

                <Section title="Особенности">
                    <CheckboxGroupField<V>
                        name="features"
                        options={enumOptions(PROJECT_FEATURES)}
                    />
                </Section>

                <Section title="Медиа">
                    <MediaField<V>
                        name="image"
                        label="Главное изображение"
                        folder="projects"
                    />
                    <GalleryField<V>
                        name="images"
                        label="Галерея"
                        folder="projects"
                    />
                    <TextField<V> name="pdfUrl" label="PDF (путь, опц.)" />
                </Section>

                <Section title="Планировки">
                    <RepeaterField<V>
                        name="floorPlans"
                        addLabel="Добавить планировку"
                        emptyMessage="Планировок нет"
                        newItem={() => ({
                            label: "",
                            image: "",
                            area: undefined,
                            rooms: [],
                        })}
                        itemLabel={(i) =>
                            form.watch(`floorPlans.${i}.label`) ||
                            `Планировка ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`floorPlans.${i}.label`}
                                        label="Название"
                                    />
                                    <NumberField<V>
                                        name={`floorPlans.${i}.area`}
                                        label="Площадь, м²"
                                    />
                                </div>
                                <TextField<V>
                                    name={`floorPlans.${i}.image`}
                                    label="Изображение (путь)"
                                />
                                <RepeaterField<V>
                                    name={`floorPlans.${i}.rooms`}
                                    label="Комнаты"
                                    addLabel="Добавить комнату"
                                    emptyMessage="Комнат нет"
                                    newItem={() => ({ name: "", area: 0 })}
                                    itemLabel={(j) =>
                                        form.watch(
                                            `floorPlans.${i}.rooms.${j}.name`
                                        ) || `Комната ${j + 1}`
                                    }
                                    renderItem={(j) => (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <TextField<V>
                                                name={`floorPlans.${i}.rooms.${j}.name`}
                                                label="Название"
                                            />
                                            <NumberField<V>
                                                name={`floorPlans.${i}.rooms.${j}.area`}
                                                label="Площадь, м²"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Комплектации">
                    <RepeaterField<V>
                        name="packages"
                        addLabel="Добавить комплектацию"
                        emptyMessage="Комплектаций нет"
                        newItem={() => ({
                            name: "",
                            price: 0,
                            tagline: "",
                            highlighted: false,
                            includes: [],
                        })}
                        itemLabel={(i) =>
                            form.watch(`packages.${i}.name`) ||
                            `Комплектация ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`packages.${i}.name`}
                                        label="Название"
                                    />
                                    <NumberField<V>
                                        name={`packages.${i}.price`}
                                        label="Цена, ₽"
                                    />
                                </div>
                                <TextField<V>
                                    name={`packages.${i}.tagline`}
                                    label="Подпись (опц.)"
                                />
                                <CheckboxField<V>
                                    name={`packages.${i}.highlighted`}
                                    label="Выделить"
                                />
                                <RepeaterField<V>
                                    name={`packages.${i}.includes`}
                                    label="Что входит"
                                    addLabel="Добавить пункт"
                                    emptyMessage="Пунктов нет"
                                    newItem={() => ({ label: "", value: "" })}
                                    itemLabel={(j) =>
                                        form.watch(
                                            `packages.${i}.includes.${j}.label`
                                        ) || `Пункт ${j + 1}`
                                    }
                                    renderItem={(j) => (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <TextField<V>
                                                name={`packages.${i}.includes.${j}.label`}
                                                label="Название"
                                            />
                                            <TextField<V>
                                                name={`packages.${i}.includes.${j}.value`}
                                                label="Значение"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Опции">
                    <RepeaterField<V>
                        name="options"
                        addLabel="Добавить опцию"
                        emptyMessage="Опций нет"
                        newItem={() => ({ label: "", price: 0, note: "" })}
                        itemLabel={(i) =>
                            form.watch(`options.${i}.label`) || `Опция ${i + 1}`
                        }
                        renderItem={(i) => (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField<V>
                                        name={`options.${i}.label`}
                                        label="Название"
                                    />
                                    <NumberField<V>
                                        name={`options.${i}.price`}
                                        label="Цена, ₽"
                                    />
                                </div>
                                <TextField<V>
                                    name={`options.${i}.note`}
                                    label="Примечание (опц.)"
                                />
                            </div>
                        )}
                    />
                </Section>

                <Section title="Связанные объекты">
                    <RelatedProjectsField currentSlug={initial?.slug} />
                </Section>

                <Section title="SEO">
                    <TextField<V>
                        name="seoTitle"
                        label="SEO-заголовок"
                        placeholder="Необязательно — по умолчанию из контента"
                    />
                    <TextareaField<V>
                        name="seoDescription"
                        label="SEO-описание"
                        rows={2}
                        placeholder="Необязательно — по умолчанию из описания"
                    />
                </Section>

                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background/95 py-4 backdrop-blur">
                    <Button type="submit" disabled={pending}>
                        {pending ? "Сохранение…" : submitLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/projects")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </Form>
    );
}
