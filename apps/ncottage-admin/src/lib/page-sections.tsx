"use client";

import type { ArrayPath, FieldArray, FieldValues } from "react-hook-form";
import { z } from "zod";
import type { PageSectionType } from "@forge/shared";
import { TextareaField, TextField } from "@/components/form/fields";
import { RepeaterField } from "@/components/form/repeater-field";
import { StringListField } from "@/components/form/string-list-field";

// Помощник для newItem репитера: элементы репитеров типизированы локально, поэтому
// приводим к ожидаемому RepeaterField типу единообразно.
function row<R>(value: R): FieldArray<FieldValues, ArrayPath<FieldValues>> {
    return value as FieldArray<FieldValues, ArrayPath<FieldValues>>;
}

// Реестр типизированных форм секций. Для каждого типа секции — zod-схема значений
// формы, конвертеры stored data ⇄ form values и набор полей. Это НЕ block-builder:
// набор типов закрыт, секцию правит её собственная форма.

export interface SectionFormDef {
    typeLabel: string;
    schema: z.ZodType;
    toForm: (data: unknown) => FieldValues;
    toData: (values: FieldValues) => unknown;
    Fields: () => React.ReactNode;
}

// --- Общие поля заголовка (eyebrow/title/titleAccent/lead) ---

interface Heading {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
}

const headingShape = {
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    titleAccent: z.string().optional(),
    lead: z.string().optional(),
};

function headingToForm(d: Partial<Heading>): Heading {
    return {
        eyebrow: d.eyebrow ?? "",
        title: d.title ?? "",
        titleAccent: d.titleAccent ?? "",
        lead: d.lead ?? "",
    };
}

// Оставляем в data только непустые поля заголовка (titleAccent и т.п. опциональны).
function headingToData(v: Heading): Partial<Heading> {
    const out: Partial<Heading> = {};
    if (v.eyebrow.trim()) out.eyebrow = v.eyebrow.trim();
    if (v.title.trim()) out.title = v.title.trim();
    if (v.titleAccent.trim()) out.titleAccent = v.titleAccent.trim();
    if (v.lead.trim()) out.lead = v.lead.trim();
    return out;
}

function HeadingFields({ leadRows = 2 }: { leadRows?: number }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="titleAccent" label="Акцент заголовка" />
            </div>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Подзаголовок" rows={leadRows} />
        </>
    );
}

const str = z.string();
const strReq = z.string().min(1, "Не пусто");

// --- aboutHero ---

interface AboutHeroForm {
    eyebrow: string;
    title: string;
    lead: string;
    cardText: string;
    cardMeta: { label: string; value: string }[];
}

const aboutHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        lead: strReq,
        cardText: strReq,
        cardMeta: z.array(z.object({ label: str, value: str })),
    }),
    toForm: (data) => {
        const d = data as Partial<AboutHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            lead: d.lead ?? "",
            cardText: d.cardText ?? "",
            cardMeta: d.cardMeta ?? [],
        } satisfies AboutHeroForm;
    },
    toData: (values) => {
        const v = values as AboutHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            lead: v.lead.trim(),
            cardText: v.cardText.trim(),
            cardMeta: v.cardMeta.map((m) => ({
                label: m.label.trim(),
                value: m.value.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <TextField name="eyebrow" label="Надзаголовок" />
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Подзаголовок" rows={3} />
            <TextareaField name="cardText" label="Текст карточки" rows={4} />
            <RepeaterField
                name="cardMeta"
                label="Метаданные карточки"
                addLabel="Добавить пару"
                emptyMessage="Пар нет"
                newItem={() => row({ label: "", value: "" })}
                itemLabel={(i) => `Пара ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField name={`cardMeta.${i}.label`} label="Подпись" />
                        <TextField name={`cardMeta.${i}.value`} label="Значение" />
                    </div>
                )}
            />
        </>
    ),
};

// --- valueList ---

interface ValueListForm extends Heading {
    items: { value: string; label: string }[];
}

const valueList: SectionFormDef = {
    typeLabel: "Список значений",
    schema: z.object({
        ...headingShape,
        items: z.array(z.object({ value: str, label: str })),
    }),
    toForm: (data) => {
        const d = data as Partial<ValueListForm>;
        return { ...headingToForm(d), items: d.items ?? [] } satisfies ValueListForm;
    },
    toData: (values) => {
        const v = values as ValueListForm;
        return {
            ...headingToData(v),
            items: v.items.map((i) => ({
                value: i.value.trim(),
                label: i.label.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="items"
                label="Значения"
                addLabel="Добавить значение"
                emptyMessage="Значений нет"
                newItem={() => row({ value: "", label: "" })}
                itemLabel={(i) => `Значение ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField name={`items.${i}.value`} label="Число" />
                        <TextField name={`items.${i}.label`} label="Подпись" />
                    </div>
                )}
            />
        </>
    ),
};

// --- cardGrid (карточки {title, text} + опциональная врезка) ---

interface CardGridForm extends Heading {
    noteTitle: string;
    noteText: string;
    items: { title: string; text: string }[];
}

const cardGrid: SectionFormDef = {
    typeLabel: "Карточки",
    schema: z.object({
        ...headingShape,
        noteTitle: str.optional(),
        noteText: str.optional(),
        items: z.array(z.object({ title: strReq, text: strReq })),
    }),
    toForm: (data) => {
        const d = data as {
            note?: { title: string; text: string };
            items?: { title: string; text: string }[];
        } & Partial<Heading>;
        return {
            ...headingToForm(d),
            noteTitle: d.note?.title ?? "",
            noteText: d.note?.text ?? "",
            items: d.items ?? [],
        } satisfies CardGridForm;
    },
    toData: (values) => {
        const v = values as CardGridForm;
        const note =
            v.noteTitle.trim() || v.noteText.trim()
                ? { title: v.noteTitle.trim(), text: v.noteText.trim() }
                : undefined;
        return {
            ...headingToData(v),
            ...(note ? { note } : {}),
            items: v.items.map((i) => ({
                title: i.title.trim(),
                text: i.text.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Врезка (необязательно)
                </p>
                <TextField name="noteTitle" label="Заголовок врезки" />
                <TextareaField name="noteText" label="Текст врезки" rows={2} />
            </div>
            <RepeaterField
                name="items"
                label="Карточки"
                addLabel="Добавить карточку"
                emptyMessage="Карточек нет"
                newItem={() => row({ title: "", text: "" })}
                itemLabel={(i) => `Карточка ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField name={`items.${i}.title`} label="Заголовок" />
                        <TextareaField
                            name={`items.${i}.text`}
                            label="Текст"
                            rows={3}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- team ---

interface TeamForm extends Heading {
    members: { name: string; role: string; text: string }[];
}

const team: SectionFormDef = {
    typeLabel: "Команда",
    schema: z.object({
        ...headingShape,
        members: z.array(
            z.object({ name: strReq, role: strReq, text: strReq })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<TeamForm>;
        return {
            ...headingToForm(d),
            members: d.members ?? [],
        } satisfies TeamForm;
    },
    toData: (values) => {
        const v = values as TeamForm;
        return {
            ...headingToData(v),
            members: v.members.map((m) => ({
                name: m.name.trim(),
                role: m.role.trim(),
                text: m.text.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="members"
                label="Сотрудники"
                addLabel="Добавить сотрудника"
                emptyMessage="Сотрудников нет"
                newItem={() => row({ name: "", role: "", text: "" })}
                itemLabel={(i) => `Сотрудник ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <TextField name={`members.${i}.name`} label="Имя" />
                            <TextField
                                name={`members.${i}.role`}
                                label="Должность"
                            />
                        </div>
                        <TextareaField
                            name={`members.${i}.text`}
                            label="Описание"
                            rows={3}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- timeline ---

interface TimelineForm extends Heading {
    items: { year: string; text: string }[];
}

const timeline: SectionFormDef = {
    typeLabel: "Хронология",
    schema: z.object({
        ...headingShape,
        items: z.array(z.object({ year: strReq, text: strReq })),
    }),
    toForm: (data) => {
        const d = data as Partial<TimelineForm>;
        return { ...headingToForm(d), items: d.items ?? [] } satisfies TimelineForm;
    },
    toData: (values) => {
        const v = values as TimelineForm;
        return {
            ...headingToData(v),
            items: v.items.map((i) => ({
                year: i.year.trim(),
                text: i.text.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="items"
                label="Этапы"
                addLabel="Добавить этап"
                emptyMessage="Этапов нет"
                newItem={() => row({ year: "", text: "" })}
                itemLabel={(i) => `Этап ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField name={`items.${i}.year`} label="Год" />
                        <TextareaField
                            name={`items.${i}.text`}
                            label="Описание"
                            rows={2}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- ctaLinks ---

interface CtaLinksForm {
    eyebrow: string;
    title: string;
    description: string;
    links: { label: string; href: string }[];
}

const ctaLinks: SectionFormDef = {
    typeLabel: "Призыв и ссылки",
    schema: z.object({
        eyebrow: str.optional(),
        title: strReq,
        description: str.optional(),
        links: z.array(z.object({ label: strReq, href: strReq })),
    }),
    toForm: (data) => {
        const d = data as Partial<CtaLinksForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            description: d.description ?? "",
            links: d.links ?? [],
        } satisfies CtaLinksForm;
    },
    toData: (values) => {
        const v = values as CtaLinksForm;
        return {
            ...(v.eyebrow.trim() ? { eyebrow: v.eyebrow.trim() } : {}),
            title: v.title.trim(),
            ...(v.description.trim()
                ? { description: v.description.trim() }
                : {}),
            links: v.links.map((l) => ({
                label: l.label.trim(),
                href: l.href.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <TextField name="eyebrow" label="Надзаголовок" />
            <TextField name="title" label="Заголовок" />
            <TextareaField name="description" label="Описание" rows={2} />
            <RepeaterField
                name="links"
                label="Ссылки"
                addLabel="Добавить ссылку"
                emptyMessage="Ссылок нет"
                newItem={() => row({ label: "", href: "" })}
                itemLabel={(i) => `Ссылка ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField name={`links.${i}.label`} label="Текст" />
                        <TextField name={`links.${i}.href`} label="Ссылка" />
                    </div>
                )}
            />
        </>
    ),
};

// --- productionHero ---

interface ProductionHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    panelEyebrow: string;
    panelValue: string;
    panelDescription: string;
}

const productionHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        panelEyebrow: strReq,
        panelValue: strReq,
        panelDescription: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<ProductionHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            panelEyebrow: d.panelEyebrow ?? "",
            panelValue: d.panelValue ?? "",
            panelDescription: d.panelDescription ?? "",
        } satisfies ProductionHeroForm;
    },
    toData: (values) => {
        const v = values as ProductionHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            panelEyebrow: v.panelEyebrow.trim(),
            panelValue: v.panelValue.trim(),
            panelDescription: v.panelDescription.trim(),
        };
    },
    Fields: () => (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="titleAccent" label="Акцент заголовка" />
            </div>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Подзаголовок" rows={3} />
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Боковая панель
                </p>
                <TextField name="panelEyebrow" label="Надпись" />
                <TextField name="panelValue" label="Значение" />
                <TextareaField
                    name="panelDescription"
                    label="Описание"
                    rows={2}
                />
            </div>
        </>
    ),
};

// --- stringList (заголовок + список строк) ---

interface StringListForm extends Heading {
    items: { value: string }[];
}

const stringList: SectionFormDef = {
    typeLabel: "Список строк",
    schema: z.object({
        ...headingShape,
        items: z.array(z.object({ value: str })),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & { items?: string[] };
        return {
            ...headingToForm(d),
            items: (d.items ?? []).map((value) => ({ value })),
        } satisfies StringListForm;
    },
    toData: (values) => {
        const v = values as StringListForm;
        return {
            ...headingToData(v),
            items: v.items.map((i) => i.value.trim()).filter(Boolean),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <StringListField
                name="items"
                label="Пункты"
                addLabel="Добавить пункт"
                emptyMessage="Пунктов нет"
            />
        </>
    ),
};

// --- financeHero ---

interface FinanceHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    stats: { value: string; label: string }[];
}

const financeHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        stats: z.array(z.object({ value: str, label: str })),
    }),
    toForm: (data) => {
        const d = data as Partial<FinanceHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            stats: d.stats ?? [],
        } satisfies FinanceHeroForm;
    },
    toData: (values) => {
        const v = values as FinanceHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            stats: v.stats.map((s) => ({
                value: s.value.trim(),
                label: s.label.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="titleAccent" label="Акцент заголовка" />
            </div>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Подзаголовок" rows={3} />
            <RepeaterField
                name="stats"
                label="Показатели"
                addLabel="Добавить показатель"
                emptyMessage="Показателей нет"
                newItem={() => row({ value: "", label: "" })}
                itemLabel={(i) => `Показатель ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField name={`stats.${i}.value`} label="Значение" />
                        <TextareaField
                            name={`stats.${i}.label`}
                            label="Подпись"
                            rows={2}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- leadForm (заголовок блока заявки; поля формы — статичны в вёрстке) ---

interface LeadFormForm {
    eyebrow: string;
    title: string;
    lead: string;
    button: string;
}

const leadForm: SectionFormDef = {
    typeLabel: "Форма заявки",
    schema: z.object({
        eyebrow: str.optional(),
        title: strReq,
        lead: strReq,
        button: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<LeadFormForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            lead: d.lead ?? "",
            button: d.button ?? "",
        } satisfies LeadFormForm;
    },
    toData: (values) => {
        const v = values as LeadFormForm;
        return {
            ...(v.eyebrow.trim() ? { eyebrow: v.eyebrow.trim() } : {}),
            title: v.title.trim(),
            lead: v.lead.trim(),
            button: v.button.trim(),
        };
    },
    Fields: () => (
        <>
            <TextField name="eyebrow" label="Надзаголовок (необязательно)" />
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Описание" rows={3} />
            <TextField name="button" label="Текст кнопки" />
        </>
    ),
};

// Реестр. Типы без формы (добавляются по мере миграции страниц) отсутствуют здесь
// и подставляют заглушку в редакторе.
export const SECTION_FORMS: Partial<Record<PageSectionType, SectionFormDef>> = {
    aboutHero,
    productionHero,
    financeHero,
    valueList,
    cardGrid,
    stringList,
    leadForm,
    team,
    timeline,
    ctaLinks,
};
