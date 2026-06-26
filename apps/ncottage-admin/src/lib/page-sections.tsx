"use client";

import type { ArrayPath, FieldArray, FieldValues } from "react-hook-form";
import { z } from "zod";
import type { PageSectionType } from "@forge/shared";
import {
    NumberField,
    SelectField,
    TextareaField,
    TextField,
} from "@/components/form/fields";
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

// Вариант для секций главной: eyebrow/title обязательны, акцент/подзаголовок — нет.
const requiredHeadingShape = {
    eyebrow: z.string().min(1, "Не пусто"),
    title: z.string().min(1, "Не пусто"),
    titleAccent: z.string().optional(),
    lead: z.string().optional(),
};

function requiredHeadingToData(v: Heading): Partial<Heading> {
    const out: Partial<Heading> = {
        eyebrow: v.eyebrow.trim(),
        title: v.title.trim(),
    };
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

// --- contactsHero ---

interface ContactsHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    visitKicker: string;
    visitText: string;
    visitCtaLabel: string;
    visitCtaHref: string;
}

const contactsHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        visitKicker: strReq,
        visitText: strReq,
        visitCtaLabel: strReq,
        visitCtaHref: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<ContactsHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            visitKicker: d.visitKicker ?? "",
            visitText: d.visitText ?? "",
            visitCtaLabel: d.visitCtaLabel ?? "",
            visitCtaHref: d.visitCtaHref ?? "",
        } satisfies ContactsHeroForm;
    },
    toData: (values) => {
        const v = values as ContactsHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            visitKicker: v.visitKicker.trim(),
            visitText: v.visitText.trim(),
            visitCtaLabel: v.visitCtaLabel.trim(),
            visitCtaHref: v.visitCtaHref.trim(),
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
                    Карточка визита
                </p>
                <TextField name="visitKicker" label="Надпись" />
                <TextareaField name="visitText" label="Текст" rows={3} />
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="visitCtaLabel" label="Текст ссылки" />
                    <TextField name="visitCtaHref" label="Ссылка" />
                </div>
            </div>
        </>
    ),
};

// --- locationCards (офисы / производственные площадки) ---

interface LocationCardsForm extends Heading {
    items: {
        city: string;
        title: string;
        address: string;
        phoneNumber: string;
        phoneDisplay: string;
        note: string;
    }[];
}

const locationCards: SectionFormDef = {
    typeLabel: "Адреса",
    schema: z.object({
        ...headingShape,
        items: z.array(
            z.object({
                city: str.optional(),
                title: strReq,
                address: strReq,
                phoneNumber: strReq,
                phoneDisplay: strReq,
                note: strReq,
            })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            items?: Partial<LocationCardsForm["items"][number]>[];
        };
        return {
            ...headingToForm(d),
            items: (d.items ?? []).map((i) => ({
                city: i.city ?? "",
                title: i.title ?? "",
                address: i.address ?? "",
                phoneNumber: i.phoneNumber ?? "",
                phoneDisplay: i.phoneDisplay ?? "",
                note: i.note ?? "",
            })),
        } satisfies LocationCardsForm;
    },
    toData: (values) => {
        const v = values as LocationCardsForm;
        return {
            ...headingToData(v),
            items: v.items.map((i) => ({
                ...(i.city.trim() ? { city: i.city.trim() } : {}),
                title: i.title.trim(),
                address: i.address.trim(),
                phoneNumber: i.phoneNumber.trim(),
                phoneDisplay: i.phoneDisplay.trim(),
                note: i.note.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="items"
                label="Карточки"
                addLabel="Добавить карточку"
                emptyMessage="Карточек нет"
                newItem={() =>
                    row({
                        city: "",
                        title: "",
                        address: "",
                        phoneNumber: "",
                        phoneDisplay: "",
                        note: "",
                    })
                }
                itemLabel={(i) => `Адрес ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <TextField
                                name={`items.${i}.city`}
                                label="Город (необязательно)"
                            />
                            <TextField
                                name={`items.${i}.title`}
                                label="Название"
                            />
                        </div>
                        <TextField name={`items.${i}.address`} label="Адрес" />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <TextField
                                name={`items.${i}.phoneNumber`}
                                label="Телефон (для ссылки)"
                            />
                            <TextField
                                name={`items.${i}.phoneDisplay`}
                                label="Телефон (отображение)"
                            />
                        </div>
                        <TextareaField
                            name={`items.${i}.note`}
                            label="Описание"
                            rows={3}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- sectionHeading (только заголовок секции) ---

const sectionHeading: SectionFormDef = {
    typeLabel: "Заголовок секции",
    schema: z.object({ ...headingShape }),
    toForm: (data) => headingToForm(data as Partial<Heading>),
    toData: (values) => headingToData(values as Heading),
    Fields: () => <HeadingFields leadRows={3} />,
};

// --- worksHero (герой страницы работ; значения статистики вычисляются на сайте) ---

interface WorksHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    statLabels: { value: string }[];
}

const worksHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        statLabels: z.array(z.object({ value: str })),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & { statLabels?: string[] };
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            statLabels: (d.statLabels ?? []).map((value) => ({ value })),
        } satisfies WorksHeroForm;
    },
    toData: (values) => {
        const v = values as WorksHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            statLabels: v.statLabels.map((i) => i.value.trim()).filter(Boolean),
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
            <StringListField
                name="statLabels"
                label="Подписи показателей"
                addLabel="Добавить подпись"
                emptyMessage="Подписей нет"
                itemNoun="Подпись"
            />
        </>
    ),
};

// --- worksMap (карта объектов) ---

interface WorksMapForm {
    eyebrow: string;
    heading: string;
    lead: string;
    mapLabelSpb: string;
    mapLabelMsk: string;
    mapAsideLabel: string;
    mapAsideTitle: string;
    mapAsideText: string;
    ctaLabel: string;
}

const worksMap: SectionFormDef = {
    typeLabel: "Карта",
    schema: z.object({
        eyebrow: strReq,
        heading: strReq,
        lead: strReq,
        mapLabelSpb: strReq,
        mapLabelMsk: strReq,
        mapAsideLabel: strReq,
        mapAsideTitle: strReq,
        mapAsideText: strReq,
        ctaLabel: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<WorksMapForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            heading: d.heading ?? "",
            lead: d.lead ?? "",
            mapLabelSpb: d.mapLabelSpb ?? "",
            mapLabelMsk: d.mapLabelMsk ?? "",
            mapAsideLabel: d.mapAsideLabel ?? "",
            mapAsideTitle: d.mapAsideTitle ?? "",
            mapAsideText: d.mapAsideText ?? "",
            ctaLabel: d.ctaLabel ?? "",
        } satisfies WorksMapForm;
    },
    toData: (values) => {
        const v = values as WorksMapForm;
        return {
            eyebrow: v.eyebrow.trim(),
            heading: v.heading.trim(),
            lead: v.lead.trim(),
            mapLabelSpb: v.mapLabelSpb.trim(),
            mapLabelMsk: v.mapLabelMsk.trim(),
            mapAsideLabel: v.mapAsideLabel.trim(),
            mapAsideTitle: v.mapAsideTitle.trim(),
            mapAsideText: v.mapAsideText.trim(),
            ctaLabel: v.ctaLabel.trim(),
        };
    },
    Fields: () => (
        <>
            <TextField name="eyebrow" label="Надзаголовок" />
            <TextField name="heading" label="Заголовок" />
            <TextareaField name="lead" label="Описание" rows={2} />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="mapLabelSpb" label="Метка СПб" />
                <TextField name="mapLabelMsk" label="Метка Москва" />
            </div>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Боковая панель
                </p>
                <TextField name="mapAsideLabel" label="Надпись" />
                <TextField name="mapAsideTitle" label="Заголовок" />
                <TextareaField name="mapAsideText" label="Текст" rows={3} />
                <TextField name="ctaLabel" label="Текст кнопки" />
            </div>
        </>
    ),
};

// --- guaranteeHero ---

interface GuaranteeHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    ctaText: string;
    ctaAnchor: string;
    secondaryLinkText: string;
    secondaryLinkHref: string;
    summaryNumber: string;
    summaryLabel: string;
    summaryText: string;
}

const guaranteeHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        ctaText: strReq,
        ctaAnchor: strReq,
        secondaryLinkText: strReq,
        secondaryLinkHref: strReq,
        summaryNumber: strReq,
        summaryLabel: strReq,
        summaryText: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<GuaranteeHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            ctaText: d.ctaText ?? "",
            ctaAnchor: d.ctaAnchor ?? "",
            secondaryLinkText: d.secondaryLinkText ?? "",
            secondaryLinkHref: d.secondaryLinkHref ?? "",
            summaryNumber: d.summaryNumber ?? "",
            summaryLabel: d.summaryLabel ?? "",
            summaryText: d.summaryText ?? "",
        } satisfies GuaranteeHeroForm;
    },
    toData: (values) => {
        const v = values as GuaranteeHeroForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            ctaText: v.ctaText.trim(),
            ctaAnchor: v.ctaAnchor.trim(),
            secondaryLinkText: v.secondaryLinkText.trim(),
            secondaryLinkHref: v.secondaryLinkHref.trim(),
            summaryNumber: v.summaryNumber.trim(),
            summaryLabel: v.summaryLabel.trim(),
            summaryText: v.summaryText.trim(),
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
                    Кнопки
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="ctaText" label="Основная кнопка" />
                    <TextField name="ctaAnchor" label="Якорь / ссылка" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                        name="secondaryLinkText"
                        label="Вторая ссылка"
                    />
                    <TextField name="secondaryLinkHref" label="Адрес ссылки" />
                </div>
            </div>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Карточка-итог
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="summaryNumber" label="Число" />
                    <TextField name="summaryLabel" label="Подпись" />
                </div>
                <TextareaField name="summaryText" label="Текст" rows={2} />
            </div>
        </>
    ),
};

// --- legalHero (герой юридических страниц; врезка/оператор/итог опциональны) ---

interface LegalHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    operatorName: string;
    noteLabel: string;
    noteText: string;
    summaryTitle: string;
    summarySubtitle: string;
}

const legalHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        operatorName: str.optional(),
        noteLabel: str.optional(),
        noteText: str.optional(),
        summaryTitle: str.optional(),
        summarySubtitle: str.optional(),
    }),
    toForm: (data) => {
        const d = data as Partial<LegalHeroForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            operatorName: d.operatorName ?? "",
            noteLabel: d.noteLabel ?? "",
            noteText: d.noteText ?? "",
            summaryTitle: d.summaryTitle ?? "",
            summarySubtitle: d.summarySubtitle ?? "",
        } satisfies LegalHeroForm;
    },
    toData: (values) => {
        const v = values as LegalHeroForm;
        const opt = (k: keyof LegalHeroForm) =>
            v[k].trim() ? { [k]: v[k].trim() } : {};
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...opt("titleAccent"),
            lead: v.lead.trim(),
            ...opt("operatorName"),
            ...opt("noteLabel"),
            ...opt("noteText"),
            ...opt("summaryTitle"),
            ...opt("summarySubtitle"),
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
                    Дополнительно (необязательно)
                </p>
                <TextField name="operatorName" label="Оператор" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="noteLabel" label="Надпись врезки" />
                    <TextField name="summaryTitle" label="Итог: заголовок" />
                </div>
                <TextareaField name="noteText" label="Текст врезки" rows={2} />
                <TextField name="summarySubtitle" label="Итог: подпись" />
            </div>
        </>
    ),
};

// --- bulletSections (пронумерованные разделы {title, text?, список}) ---

interface BulletSectionsForm extends Heading {
    updated: string;
    items: { title: string; text: string; list: { value: string }[] }[];
}

const bulletSections: SectionFormDef = {
    typeLabel: "Разделы",
    schema: z.object({
        ...headingShape,
        updated: str.optional(),
        items: z.array(
            z.object({
                title: strReq,
                text: str.optional(),
                list: z.array(z.object({ value: str })),
            })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            updated?: string;
            items?: { title: string; text?: string; list?: string[] }[];
        };
        return {
            ...headingToForm(d),
            updated: d.updated ?? "",
            items: (d.items ?? []).map((i) => ({
                title: i.title ?? "",
                text: i.text ?? "",
                list: (i.list ?? []).map((value) => ({ value })),
            })),
        } satisfies BulletSectionsForm;
    },
    toData: (values) => {
        const v = values as BulletSectionsForm;
        return {
            ...headingToData(v),
            ...(v.updated.trim() ? { updated: v.updated.trim() } : {}),
            items: v.items.map((i) => {
                const list = i.list
                    .map((x) => x.value.trim())
                    .filter(Boolean);
                return {
                    title: i.title.trim(),
                    ...(i.text.trim() ? { text: i.text.trim() } : {}),
                    ...(list.length ? { list } : {}),
                };
            }),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <TextField name="updated" label="Дата редакции (необязательно)" />
            <RepeaterField
                name="items"
                label="Разделы"
                addLabel="Добавить раздел"
                emptyMessage="Разделов нет"
                newItem={() => row({ title: "", text: "", list: [] })}
                itemLabel={(i) => `Раздел ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField
                            name={`items.${i}.title`}
                            label="Заголовок"
                        />
                        <TextareaField
                            name={`items.${i}.text`}
                            label="Текст (необязательно)"
                            rows={3}
                        />
                        <StringListField
                            name={`items.${i}.list`}
                            label="Пункты списка"
                            addLabel="Добавить пункт"
                            emptyMessage="Списка нет"
                            multiline
                            rows={2}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- requisitesTable (таблица реквизитов: {label, value}) ---

interface RequisitesTableForm {
    title: string;
    rows: { label: string; value: string }[];
}

const requisitesTable: SectionFormDef = {
    typeLabel: "Таблица реквизитов",
    schema: z.object({
        title: strReq,
        rows: z.array(z.object({ label: strReq, value: strReq })),
    }),
    toForm: (data) => {
        const d = data as Partial<RequisitesTableForm>;
        return {
            title: d.title ?? "",
            rows: d.rows ?? [],
        } satisfies RequisitesTableForm;
    },
    toData: (values) => {
        const v = values as RequisitesTableForm;
        return {
            title: v.title.trim(),
            rows: v.rows.map((r) => ({
                label: r.label.trim(),
                value: r.value.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <TextField name="title" label="Заголовок таблицы" />
            <RepeaterField
                name="rows"
                label="Строки"
                addLabel="Добавить строку"
                emptyMessage="Строк нет"
                newItem={() => row({ label: "", value: "" })}
                itemLabel={(i) => `Строка ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField name={`rows.${i}.label`} label="Поле" />
                        <TextField name={`rows.${i}.value`} label="Значение" />
                    </div>
                )}
            />
        </>
    ),
};

// ===== Секции главной страницы =====

// --- homeHero ---

interface HomeHeroForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    trust: { value: string; label: string }[];
    imageSrc: string;
    imageAlt: string;
}

const homeHero: SectionFormDef = {
    typeLabel: "Герой",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        text: strReq,
        primaryLabel: strReq,
        primaryHref: strReq,
        secondaryLabel: str.optional(),
        secondaryHref: str.optional(),
        trust: z.array(z.object({ value: str, label: str })),
        imageSrc: strReq,
        imageAlt: str,
    }),
    toForm: (data) => {
        const d = data as {
            eyebrow?: string;
            title?: string;
            titleAccent?: string;
            text?: string;
            primaryCta?: { label: string; href: string };
            secondaryCta?: { label: string; href: string };
            trust?: { value: string; label: string }[];
            image?: { src: string; alt: string };
        };
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            text: d.text ?? "",
            primaryLabel: d.primaryCta?.label ?? "",
            primaryHref: d.primaryCta?.href ?? "",
            secondaryLabel: d.secondaryCta?.label ?? "",
            secondaryHref: d.secondaryCta?.href ?? "",
            trust: d.trust ?? [],
            imageSrc: d.image?.src ?? "",
            imageAlt: d.image?.alt ?? "",
        } satisfies HomeHeroForm;
    },
    toData: (values) => {
        const v = values as HomeHeroForm;
        const secondary =
            v.secondaryLabel.trim() || v.secondaryHref.trim()
                ? {
                      secondaryCta: {
                          label: v.secondaryLabel.trim(),
                          href: v.secondaryHref.trim(),
                      },
                  }
                : {};
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            text: v.text.trim(),
            primaryCta: {
                label: v.primaryLabel.trim(),
                href: v.primaryHref.trim(),
            },
            ...secondary,
            trust: v.trust.map((t) => ({
                value: t.value.trim(),
                label: t.label.trim(),
            })),
            image: { src: v.imageSrc.trim(), alt: v.imageAlt.trim() },
        };
    },
    Fields: () => (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="titleAccent" label="Акцент заголовка" />
            </div>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="text" label="Текст" rows={3} />
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Кнопки
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="primaryLabel" label="Основная кнопка" />
                    <TextField name="primaryHref" label="Ссылка" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="secondaryLabel" label="Вторая кнопка" />
                    <TextField name="secondaryHref" label="Ссылка" />
                </div>
            </div>
            <RepeaterField
                name="trust"
                label="Показатели доверия"
                addLabel="Добавить показатель"
                emptyMessage="Показателей нет"
                newItem={() => row({ value: "", label: "" })}
                itemLabel={(i) => `Показатель ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField name={`trust.${i}.value`} label="Значение" />
                        <TextField name={`trust.${i}.label`} label="Подпись" />
                    </div>
                )}
            />
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Изображение
                </p>
                <TextField name="imageSrc" label="Путь к файлу" />
                <TextField name="imageAlt" label="Альт-текст" />
            </div>
        </>
    ),
};

// --- projectPicker ---

interface ProjectPickerForm {
    title: string;
    text: string;
    priceMin: number;
    priceMax: number;
    areaMin: number;
    areaMax: number;
    technologies: { value: string; label: string }[];
    floors: { value: string; label: string }[];
    submitLabel: string;
}

const projectPicker: SectionFormDef = {
    typeLabel: "Подбор проекта",
    schema: z.object({
        title: strReq,
        text: strReq,
        priceMin: z.number(),
        priceMax: z.number(),
        areaMin: z.number(),
        areaMax: z.number(),
        technologies: z.array(z.object({ value: str, label: str })),
        floors: z.array(z.object({ value: str, label: str })),
        submitLabel: strReq,
    }),
    toForm: (data) => {
        const d = data as {
            title?: string;
            text?: string;
            price?: { min: number; max: number };
            area?: { min: number; max: number };
            technologies?: { value: string; label: string }[];
            floors?: { value: string; label: string }[];
            submitLabel?: string;
        };
        return {
            title: d.title ?? "",
            text: d.text ?? "",
            priceMin: d.price?.min ?? 0,
            priceMax: d.price?.max ?? 0,
            areaMin: d.area?.min ?? 0,
            areaMax: d.area?.max ?? 0,
            technologies: d.technologies ?? [],
            floors: d.floors ?? [],
            submitLabel: d.submitLabel ?? "",
        } satisfies ProjectPickerForm;
    },
    toData: (values) => {
        const v = values as ProjectPickerForm;
        return {
            title: v.title.trim(),
            text: v.text.trim(),
            price: { min: v.priceMin, max: v.priceMax },
            area: { min: v.areaMin, max: v.areaMax },
            technologies: v.technologies.map((t) => ({
                value: t.value.trim(),
                label: t.label.trim(),
            })),
            floors: v.floors.map((f) => ({
                value: f.value.trim(),
                label: f.label.trim(),
            })),
            submitLabel: v.submitLabel.trim(),
        };
    },
    Fields: () => (
        <>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="text" label="Описание" rows={2} />
            <div className="grid gap-3 sm:grid-cols-2">
                <NumberField name="priceMin" label="Цена от" />
                <NumberField name="priceMax" label="Цена до" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <NumberField name="areaMin" label="Площадь от" />
                <NumberField name="areaMax" label="Площадь до" />
            </div>
            <RepeaterField
                name="technologies"
                label="Технологии"
                addLabel="Добавить технологию"
                emptyMessage="Технологий нет"
                newItem={() => row({ value: "", label: "" })}
                itemLabel={(i) => `Технология ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField
                            name={`technologies.${i}.value`}
                            label="Значение"
                        />
                        <TextField
                            name={`technologies.${i}.label`}
                            label="Подпись"
                        />
                    </div>
                )}
            />
            <RepeaterField
                name="floors"
                label="Этажность"
                addLabel="Добавить вариант"
                emptyMessage="Вариантов нет"
                newItem={() => row({ value: "", label: "" })}
                itemLabel={(i) => `Вариант ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField
                            name={`floors.${i}.value`}
                            label="Значение"
                        />
                        <TextField
                            name={`floors.${i}.label`}
                            label="Подпись"
                        />
                    </div>
                )}
            />
            <TextField name="submitLabel" label="Текст кнопки" />
        </>
    ),
};

// --- catalogSection ---

interface CatalogSectionForm extends Heading {
    tabs: { id: string; label: string; technology: string }[];
    ctaLabel: string;
    ctaHref: string;
    customText: string;
    customLinkLabel: string;
}

const catalogSection: SectionFormDef = {
    typeLabel: "Каталог",
    schema: z.object({
        ...requiredHeadingShape,
        tabs: z.array(
            z.object({ id: strReq, label: strReq, technology: str })
        ),
        ctaLabel: strReq,
        ctaHref: strReq,
        customText: strReq,
        customLinkLabel: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            tabs?: { id: string; label: string; technology: string | null }[];
            cta?: { label: string; href: string };
            customProject?: { text: string; linkLabel: string };
        };
        return {
            ...headingToForm(d),
            tabs: (d.tabs ?? []).map((t) => ({
                id: t.id,
                label: t.label,
                technology: t.technology ?? "",
            })),
            ctaLabel: d.cta?.label ?? "",
            ctaHref: d.cta?.href ?? "",
            customText: d.customProject?.text ?? "",
            customLinkLabel: d.customProject?.linkLabel ?? "",
        } satisfies CatalogSectionForm;
    },
    toData: (values) => {
        const v = values as CatalogSectionForm;
        return {
            ...requiredHeadingToData(v),
            tabs: v.tabs.map((t) => ({
                id: t.id.trim(),
                label: t.label.trim(),
                technology: t.technology.trim() || null,
            })),
            cta: { label: v.ctaLabel.trim(), href: v.ctaHref.trim() },
            customProject: {
                text: v.customText.trim(),
                linkLabel: v.customLinkLabel.trim(),
            },
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="tabs"
                label="Вкладки"
                addLabel="Добавить вкладку"
                emptyMessage="Вкладок нет"
                newItem={() => row({ id: "", label: "", technology: "" })}
                itemLabel={(i) => `Вкладка ${i + 1}`}
                renderItem={(i) => (
                    <div className="grid gap-3 sm:grid-cols-3">
                        <TextField name={`tabs.${i}.id`} label="ID" />
                        <TextField name={`tabs.${i}.label`} label="Подпись" />
                        <TextField
                            name={`tabs.${i}.technology`}
                            label="Технология"
                        />
                    </div>
                )}
            />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="ctaLabel" label="Кнопка" />
                <TextField name="ctaHref" label="Ссылка" />
            </div>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Индивидуальный проект
                </p>
                <TextField name="customText" label="Текст" />
                <TextField name="customLinkLabel" label="Текст ссылки" />
            </div>
        </>
    ),
};

// --- pullQuote ---

interface PullQuoteForm {
    quote: string;
    author: string;
    role: string;
}

const pullQuote: SectionFormDef = {
    typeLabel: "Цитата",
    schema: z.object({
        quote: strReq,
        author: strReq,
        role: str.optional(),
    }),
    toForm: (data) => {
        const d = data as Partial<PullQuoteForm>;
        return {
            quote: d.quote ?? "",
            author: d.author ?? "",
            role: d.role ?? "",
        } satisfies PullQuoteForm;
    },
    toData: (values) => {
        const v = values as PullQuoteForm;
        return {
            quote: v.quote.trim(),
            author: v.author.trim(),
            ...(v.role.trim() ? { role: v.role.trim() } : {}),
        };
    },
    Fields: () => (
        <>
            <TextareaField name="quote" label="Цитата" rows={4} />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="author" label="Автор" />
                <TextField name="role" label="Должность (необязательно)" />
            </div>
        </>
    ),
};

// --- worksTeaser ---

interface WorksTeaserForm extends Heading {
    ctaLabel: string;
    ctaHref: string;
    visitTitle: string;
    visitText: string;
    visitCtaLabel: string;
}

const worksTeaser: SectionFormDef = {
    typeLabel: "Наши работы",
    schema: z.object({
        ...requiredHeadingShape,
        ctaLabel: strReq,
        ctaHref: strReq,
        visitTitle: strReq,
        visitText: strReq,
        visitCtaLabel: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            cta?: { label: string; href: string };
            visitInvite?: { title: string; text: string; ctaLabel: string };
        };
        return {
            ...headingToForm(d),
            ctaLabel: d.cta?.label ?? "",
            ctaHref: d.cta?.href ?? "",
            visitTitle: d.visitInvite?.title ?? "",
            visitText: d.visitInvite?.text ?? "",
            visitCtaLabel: d.visitInvite?.ctaLabel ?? "",
        } satisfies WorksTeaserForm;
    },
    toData: (values) => {
        const v = values as WorksTeaserForm;
        return {
            ...requiredHeadingToData(v),
            cta: { label: v.ctaLabel.trim(), href: v.ctaHref.trim() },
            visitInvite: {
                title: v.visitTitle.trim(),
                text: v.visitText.trim(),
                ctaLabel: v.visitCtaLabel.trim(),
            },
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="ctaLabel" label="Кнопка" />
                <TextField name="ctaHref" label="Ссылка" />
            </div>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Приглашение на просмотр
                </p>
                <TextField name="visitTitle" label="Заголовок" />
                <TextareaField name="visitText" label="Текст" rows={2} />
                <TextField name="visitCtaLabel" label="Текст кнопки" />
            </div>
        </>
    ),
};

// --- stepsSection ---

interface StepsSectionForm extends Heading {
    stages: { num: string; title: string; text: string }[];
}

const stepsSection: SectionFormDef = {
    typeLabel: "Этапы работы",
    schema: z.object({
        ...requiredHeadingShape,
        stages: z.array(
            z.object({ num: strReq, title: strReq, text: strReq })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            stages?: { num: string; title: string; text: string }[];
        };
        return {
            ...headingToForm(d),
            stages: d.stages ?? [],
        } satisfies StepsSectionForm;
    },
    toData: (values) => {
        const v = values as StepsSectionForm;
        return {
            ...requiredHeadingToData(v),
            stages: v.stages.map((s) => ({
                num: s.num.trim(),
                title: s.title.trim(),
                text: s.text.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="stages"
                label="Шаги"
                addLabel="Добавить шаг"
                emptyMessage="Шагов нет"
                newItem={() => row({ num: "", title: "", text: "" })}
                itemLabel={(i) => `Шаг ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                            <TextField name={`stages.${i}.num`} label="Номер" />
                            <TextField
                                name={`stages.${i}.title`}
                                label="Заголовок"
                            />
                        </div>
                        <TextareaField
                            name={`stages.${i}.text`}
                            label="Описание"
                            rows={2}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- geography ---

interface GeographyForm extends Heading {
    totalLabel: string;
    totalValue: string;
    regions: {
        label: string;
        count: number;
        percent: number;
        note: string;
    }[];
    ctaLabel: string;
    ctaHref: string;
}

const geography: SectionFormDef = {
    typeLabel: "География",
    schema: z.object({
        ...requiredHeadingShape,
        totalLabel: strReq,
        totalValue: strReq,
        regions: z.array(
            z.object({
                label: strReq,
                count: z.number(),
                percent: z.number(),
                note: str.optional(),
            })
        ),
        ctaLabel: strReq,
        ctaHref: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            totalLabel?: string;
            totalValue?: string;
            regions?: {
                label: string;
                count: number;
                percent: number;
                note?: string;
            }[];
            cta?: { label: string; href: string };
        };
        return {
            ...headingToForm(d),
            totalLabel: d.totalLabel ?? "",
            totalValue: d.totalValue ?? "",
            regions: (d.regions ?? []).map((r) => ({
                label: r.label,
                count: r.count,
                percent: r.percent,
                note: r.note ?? "",
            })),
            ctaLabel: d.cta?.label ?? "",
            ctaHref: d.cta?.href ?? "",
        } satisfies GeographyForm;
    },
    toData: (values) => {
        const v = values as GeographyForm;
        return {
            ...requiredHeadingToData(v),
            totalLabel: v.totalLabel.trim(),
            totalValue: v.totalValue.trim(),
            regions: v.regions.map((r) => ({
                label: r.label.trim(),
                count: r.count,
                percent: r.percent,
                ...(r.note.trim() ? { note: r.note.trim() } : {}),
            })),
            cta: { label: v.ctaLabel.trim(), href: v.ctaHref.trim() },
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="totalValue" label="Всего (значение)" />
                <TextField name="totalLabel" label="Всего (подпись)" />
            </div>
            <RepeaterField
                name="regions"
                label="Регионы"
                addLabel="Добавить регион"
                emptyMessage="Регионов нет"
                newItem={() =>
                    row({ label: "", count: 0, percent: 0, note: "" })
                }
                itemLabel={(i) => `Регион ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField
                            name={`regions.${i}.label`}
                            label="Название"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <NumberField
                                name={`regions.${i}.count`}
                                label="Домов"
                            />
                            <NumberField
                                name={`regions.${i}.percent`}
                                label="Процент"
                            />
                        </div>
                        <TextField
                            name={`regions.${i}.note`}
                            label="Примечание (необязательно)"
                        />
                    </>
                )}
            />
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="ctaLabel" label="Кнопка" />
                <TextField name="ctaHref" label="Ссылка" />
            </div>
        </>
    ),
};

// --- reviewsCarousel (заголовок и подписи; сами отзывы — из коллекции «Отзывы») ---

interface ReviewsCarouselForm extends Heading {
    showMoreLabel: string;
    prevLabel: string;
    nextLabel: string;
}

const reviewsCarousel: SectionFormDef = {
    typeLabel: "Карусель отзывов",
    schema: z.object({
        ...requiredHeadingShape,
        showMoreLabel: strReq,
        prevLabel: strReq,
        nextLabel: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            showMoreLabel?: string;
            prevLabel?: string;
            nextLabel?: string;
        };
        return {
            ...headingToForm(d),
            showMoreLabel: d.showMoreLabel ?? "",
            prevLabel: d.prevLabel ?? "",
            nextLabel: d.nextLabel ?? "",
        } satisfies ReviewsCarouselForm;
    },
    toData: (values) => {
        const v = values as ReviewsCarouselForm;
        return {
            ...requiredHeadingToData(v),
            showMoreLabel: v.showMoreLabel.trim(),
            prevLabel: v.prevLabel.trim(),
            nextLabel: v.nextLabel.trim(),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <p className="text-sm text-muted-foreground">
                Отзывы в карусели берутся из коллекции «Отзывы» (с отметкой
                «На главной»).
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
                <TextField name="showMoreLabel" label="«Весь отзыв»" />
                <TextField name="prevLabel" label="Назад" />
                <TextField name="nextLabel" label="Вперёд" />
            </div>
        </>
    ),
};

// --- featuredProject ---

interface FeaturedProjectForm {
    eyebrow: string;
    overline: string;
    ctaLabel: string;
    objectId: string;
    technology: string;
}

const featuredProject: SectionFormDef = {
    typeLabel: "Проект месяца",
    schema: z.object({
        eyebrow: strReq,
        overline: strReq,
        ctaLabel: strReq,
        objectId: strReq,
        technology: strReq,
    }),
    toForm: (data) => {
        const d = data as Partial<FeaturedProjectForm>;
        return {
            eyebrow: d.eyebrow ?? "",
            overline: d.overline ?? "",
            ctaLabel: d.ctaLabel ?? "",
            objectId: d.objectId ?? "",
            technology: d.technology ?? "",
        } satisfies FeaturedProjectForm;
    },
    toData: (values) => {
        const v = values as FeaturedProjectForm;
        return {
            eyebrow: v.eyebrow.trim(),
            overline: v.overline.trim(),
            ctaLabel: v.ctaLabel.trim(),
            objectId: v.objectId.trim(),
            technology: v.technology.trim(),
        };
    },
    Fields: () => (
        <>
            <div className="grid gap-3 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="overline" label="Подпись (месяц)" />
            </div>
            <TextField name="technology" label="Технология" />
            <TextField name="objectId" label="ID объекта" />
            <TextField name="ctaLabel" label="Текст кнопки" />
        </>
    ),
};

// --- guaranteeCards ---

interface GuaranteeCardsForm extends Heading {
    items: { icon: string; title: string; text: string }[];
}

const guaranteeIconOptions = [
    { value: "price", label: "Цена" },
    { value: "contract", label: "Договор" },
    { value: "steps", label: "Этапы" },
    { value: "eye", label: "Надзор" },
    { value: "shield", label: "Гарантия" },
    { value: "umbrella", label: "Страховка" },
];

const guaranteeCards: SectionFormDef = {
    typeLabel: "Гарантии",
    schema: z.object({
        ...requiredHeadingShape,
        items: z.array(
            z.object({
                icon: z.enum([
                    "price",
                    "contract",
                    "steps",
                    "eye",
                    "shield",
                    "umbrella",
                ]),
                title: strReq,
                text: strReq,
            })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            items?: { icon: string; title: string; text: string }[];
        };
        return {
            ...headingToForm(d),
            items: d.items ?? [],
        } satisfies GuaranteeCardsForm;
    },
    toData: (values) => {
        const v = values as GuaranteeCardsForm;
        return {
            ...requiredHeadingToData(v),
            items: v.items.map((i) => ({
                icon: i.icon,
                title: i.title.trim(),
                text: i.text.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="items"
                label="Гарантии"
                addLabel="Добавить гарантию"
                emptyMessage="Гарантий нет"
                newItem={() => row({ icon: "price", title: "", text: "" })}
                itemLabel={(i) => `Гарантия ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                            <SelectField
                                name={`items.${i}.icon`}
                                label="Иконка"
                                options={guaranteeIconOptions}
                            />
                            <TextField
                                name={`items.${i}.title`}
                                label="Заголовок"
                            />
                        </div>
                        <TextareaField
                            name={`items.${i}.text`}
                            label="Текст"
                            rows={2}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- faqList ---

interface FaqListForm extends Heading {
    items: { question: string; answer: string }[];
}

const faqList: SectionFormDef = {
    typeLabel: "Частые вопросы",
    schema: z.object({
        ...requiredHeadingShape,
        items: z.array(
            z.object({ question: strReq, answer: strReq })
        ),
    }),
    toForm: (data) => {
        const d = data as Partial<Heading> & {
            items?: { question: string; answer: string }[];
        };
        return {
            ...headingToForm(d),
            items: d.items ?? [],
        } satisfies FaqListForm;
    },
    toData: (values) => {
        const v = values as FaqListForm;
        return {
            ...requiredHeadingToData(v),
            items: v.items.map((i) => ({
                question: i.question.trim(),
                answer: i.answer.trim(),
            })),
        };
    },
    Fields: () => (
        <>
            <HeadingFields />
            <RepeaterField
                name="items"
                label="Вопросы"
                addLabel="Добавить вопрос"
                emptyMessage="Вопросов нет"
                newItem={() => row({ question: "", answer: "" })}
                itemLabel={(i) => `Вопрос ${i + 1}`}
                renderItem={(i) => (
                    <>
                        <TextField
                            name={`items.${i}.question`}
                            label="Вопрос"
                        />
                        <TextareaField
                            name={`items.${i}.answer`}
                            label="Ответ"
                            rows={3}
                        />
                    </>
                )}
            />
        </>
    ),
};

// --- homeContact (адреса/телефоны/email берутся из настроек «Контакты») ---

interface HomeContactForm {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    hours: string;
    formTitle: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
    privacyText: string;
    privacyLinkLabel: string;
    privacyLinkHref: string;
    successTitle: string;
    successText: string;
}

const homeContact: SectionFormDef = {
    typeLabel: "Контакты",
    schema: z.object({
        eyebrow: strReq,
        title: strReq,
        titleAccent: str.optional(),
        lead: strReq,
        hours: strReq,
        formTitle: strReq,
        namePlaceholder: strReq,
        phonePlaceholder: strReq,
        messagePlaceholder: strReq,
        submitLabel: strReq,
        privacyText: strReq,
        privacyLinkLabel: strReq,
        privacyLinkHref: strReq,
        successTitle: strReq,
        successText: strReq,
    }),
    toForm: (data) => {
        const d = data as {
            eyebrow?: string;
            title?: string;
            titleAccent?: string;
            lead?: string;
            hours?: string;
            form?: {
                title?: string;
                namePlaceholder?: string;
                phonePlaceholder?: string;
                messagePlaceholder?: string;
                submitLabel?: string;
                privacy?: {
                    text?: string;
                    linkLabel?: string;
                    linkHref?: string;
                };
                successTitle?: string;
                successText?: string;
            };
        };
        const f = d.form ?? {};
        return {
            eyebrow: d.eyebrow ?? "",
            title: d.title ?? "",
            titleAccent: d.titleAccent ?? "",
            lead: d.lead ?? "",
            hours: d.hours ?? "",
            formTitle: f.title ?? "",
            namePlaceholder: f.namePlaceholder ?? "",
            phonePlaceholder: f.phonePlaceholder ?? "",
            messagePlaceholder: f.messagePlaceholder ?? "",
            submitLabel: f.submitLabel ?? "",
            privacyText: f.privacy?.text ?? "",
            privacyLinkLabel: f.privacy?.linkLabel ?? "",
            privacyLinkHref: f.privacy?.linkHref ?? "",
            successTitle: f.successTitle ?? "",
            successText: f.successText ?? "",
        } satisfies HomeContactForm;
    },
    toData: (values) => {
        const v = values as HomeContactForm;
        return {
            eyebrow: v.eyebrow.trim(),
            title: v.title.trim(),
            ...(v.titleAccent.trim()
                ? { titleAccent: v.titleAccent.trim() }
                : {}),
            lead: v.lead.trim(),
            hours: v.hours.trim(),
            form: {
                title: v.formTitle.trim(),
                namePlaceholder: v.namePlaceholder.trim(),
                phonePlaceholder: v.phonePlaceholder.trim(),
                messagePlaceholder: v.messagePlaceholder.trim(),
                submitLabel: v.submitLabel.trim(),
                privacy: {
                    text: v.privacyText.trim(),
                    linkLabel: v.privacyLinkLabel.trim(),
                    linkHref: v.privacyLinkHref.trim(),
                },
                successTitle: v.successTitle.trim(),
                successText: v.successText.trim(),
            },
        };
    },
    Fields: () => (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="eyebrow" label="Надзаголовок" />
                <TextField name="titleAccent" label="Акцент заголовка" />
            </div>
            <TextField name="title" label="Заголовок" />
            <TextareaField name="lead" label="Подзаголовок" rows={2} />
            <TextField name="hours" label="Часы работы" />
            <p className="text-sm text-muted-foreground">
                Адреса, телефоны и email берутся из раздела «Контент → Контакты».
            </p>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Форма заявки
                </p>
                <TextField name="formTitle" label="Заголовок формы" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField name="namePlaceholder" label="Плейсхолдер имени" />
                    <TextField
                        name="phonePlaceholder"
                        label="Плейсхолдер телефона"
                    />
                </div>
                <TextField
                    name="messagePlaceholder"
                    label="Плейсхолдер сообщения"
                />
                <TextField name="submitLabel" label="Текст кнопки" />
            </div>
            <div className="grid gap-3 rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium text-muted-foreground">
                    Согласие и успех
                </p>
                <TextField name="privacyText" label="Текст согласия" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                        name="privacyLinkLabel"
                        label="Текст ссылки"
                    />
                    <TextField name="privacyLinkHref" label="Ссылка" />
                </div>
                <TextField name="successTitle" label="Успех: заголовок" />
                <TextField name="successText" label="Успех: текст" />
            </div>
        </>
    ),
};

// Реестр. Типы без формы (добавляются по мере миграции страниц) отсутствуют здесь
// и подставляют заглушку в редакторе.
export const SECTION_FORMS: Partial<Record<PageSectionType, SectionFormDef>> = {
    aboutHero,
    productionHero,
    financeHero,
    contactsHero,
    worksHero,
    guaranteeHero,
    legalHero,
    sectionHeading,
    valueList,
    cardGrid,
    stringList,
    bulletSections,
    requisitesTable,
    leadForm,
    locationCards,
    worksMap,
    team,
    timeline,
    ctaLinks,
    homeHero,
    projectPicker,
    catalogSection,
    pullQuote,
    worksTeaser,
    stepsSection,
    geography,
    reviewsCarousel,
    featuredProject,
    guaranteeCards,
    faqList,
    homeContact,
};
