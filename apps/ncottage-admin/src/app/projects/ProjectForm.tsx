"use client";

import { useActionState } from "react";
import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    TECHNOLOGIES,
    type Project,
} from "@forge/shared";
import type { ProjectFormState } from "./actions";

type Action = (
    state: ProjectFormState,
    formData: FormData
) => Promise<ProjectFormState>;

const initialState: ProjectFormState = {};

function json(value: unknown): string {
    return value ? JSON.stringify(value, null, 2) : "";
}

export function ProjectForm({
    action,
    initial,
    submitLabel,
}: {
    action: Action;
    initial?: Project;
    submitLabel: string;
}) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const p = initial;

    return (
        <form action={formAction}>
            <div className="grid2">
                <div className="field">
                    <label htmlFor="slug">Slug</label>
                    <input
                        id="slug"
                        name="slug"
                        defaultValue={p?.slug}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="name">Название</label>
                    <input
                        id="name"
                        name="name"
                        defaultValue={p?.name}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="technology">Технология</label>
                    <select
                        id="technology"
                        name="technology"
                        defaultValue={p?.technology ?? TECHNOLOGIES[0]}
                    >
                        {TECHNOLOGIES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="style">Стиль</label>
                    <select
                        id="style"
                        name="style"
                        defaultValue={p?.style ?? PROJECT_STYLES[0]}
                    >
                        {PROJECT_STYLES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="livingType">Тип проживания</label>
                    <select
                        id="livingType"
                        name="livingType"
                        defaultValue={p?.livingType ?? PROJECT_LIVING_TYPES[0]}
                    >
                        {PROJECT_LIVING_TYPES.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="price">Цена, ₽</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        defaultValue={p?.price}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="area">Площадь, м²</label>
                    <input
                        id="area"
                        name="area"
                        type="number"
                        defaultValue={p?.area}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="floors">Этажей</label>
                    <input
                        id="floors"
                        name="floors"
                        type="number"
                        defaultValue={p?.floors}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="bedrooms">Спален</label>
                    <input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        defaultValue={p?.bedrooms}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="bathrooms">Санузлов</label>
                    <input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        defaultValue={p?.bathrooms}
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="image">Главное изображение (путь)</label>
                <input
                    id="image"
                    name="image"
                    defaultValue={p?.image}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="images">
                    Галерея (по одному пути в строке)
                </label>
                <textarea
                    id="images"
                    name="images"
                    defaultValue={p?.images.join("\n")}
                />
            </div>

            <div className="field">
                <label htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={p?.description}
                    style={{ fontFamily: "inherit" }}
                    required
                />
            </div>

            <fieldset className="field">
                <legend>Особенности</legend>
                {PROJECT_FEATURES.map((f) => (
                    <label
                        key={f}
                        style={{
                            display: "inline-flex",
                            gap: "0.3rem",
                            marginRight: "1rem",
                            fontWeight: 400,
                        }}
                    >
                        <input
                            type="checkbox"
                            name="features"
                            value={f}
                            defaultChecked={p?.features.includes(f)}
                            style={{ width: "auto" }}
                        />
                        {f}
                    </label>
                ))}
            </fieldset>

            <label
                style={{
                    display: "inline-flex",
                    gap: "0.4rem",
                    margin: "0.5rem 0 1rem",
                }}
            >
                <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={p?.featured}
                    style={{ width: "auto" }}
                />
                Показывать на главной (featured)
            </label>

            <h3>Характеристики</h3>
            <div className="grid2">
                <div className="field">
                    <label htmlFor="specs.dimensions">Габариты</label>
                    <input
                        id="specs.dimensions"
                        name="specs.dimensions"
                        defaultValue={p?.specs.dimensions}
                    />
                </div>
                <div className="field">
                    <label htmlFor="specs.roofType">Кровля</label>
                    <input
                        id="specs.roofType"
                        name="specs.roofType"
                        defaultValue={p?.specs.roofType}
                    />
                </div>
                <div className="field">
                    <label htmlFor="specs.foundation">Фундамент</label>
                    <input
                        id="specs.foundation"
                        name="specs.foundation"
                        defaultValue={p?.specs.foundation}
                    />
                </div>
                <div className="field">
                    <label htmlFor="specs.wallMaterial">Материал стен</label>
                    <input
                        id="specs.wallMaterial"
                        name="specs.wallMaterial"
                        defaultValue={p?.specs.wallMaterial}
                    />
                </div>
                <div className="field">
                    <label htmlFor="specs.buildTime">Срок строительства</label>
                    <input
                        id="specs.buildTime"
                        name="specs.buildTime"
                        defaultValue={p?.specs.buildTime}
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="floorPlans">Планировки (JSON)</label>
                <textarea
                    id="floorPlans"
                    name="floorPlans"
                    defaultValue={json(p?.floorPlans)}
                />
            </div>
            <div className="field">
                <label htmlFor="packages">Комплектации (JSON)</label>
                <textarea
                    id="packages"
                    name="packages"
                    defaultValue={json(p?.packages)}
                />
            </div>
            <div className="field">
                <label htmlFor="options">Опции (JSON)</label>
                <textarea
                    id="options"
                    name="options"
                    defaultValue={json(p?.options)}
                />
            </div>

            <div className="field">
                <label htmlFor="relatedObjectIds">
                    Связанные объекты (id по строкам)
                </label>
                <textarea
                    id="relatedObjectIds"
                    name="relatedObjectIds"
                    defaultValue={p?.relatedObjectIds?.join("\n")}
                />
            </div>
            <div className="field">
                <label htmlFor="pdfUrl">PDF (путь)</label>
                <input id="pdfUrl" name="pdfUrl" defaultValue={p?.pdfUrl} />
            </div>

            {state.error && <p className="error">{state.error}</p>}
            <button type="submit" disabled={pending}>
                {pending ? "Сохранение…" : submitLabel}
            </button>
        </form>
    );
}
