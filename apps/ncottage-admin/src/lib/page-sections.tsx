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
};
