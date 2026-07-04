import type { BuiltObject } from "@forge/shared";
import { z } from "zod";
import { requiredUrlOrPath } from "./validators";

// coords редактируется двумя полями lat/lng; refine требует оба или ни одного.
export const builtObjectSchema = z
    .object({
        id: z
            .string()
            .min(1, "Укажите идентификатор")
            .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
        title: z.string().min(1, "Укажите название"),
        image: requiredUrlOrPath("Укажите изображение"),
        href: requiredUrlOrPath("Укажите ссылку"),
        area: z.number({ message: "Число" }).int().nonnegative().optional(),
        location: z.string(),
        type: z.string(),
        technology: z.string(),
        lat: z.number({ message: "Число" }).min(-90).max(90).optional(),
        lng: z.number({ message: "Число" }).min(-180).max(180).optional(),
    })
    .refine((v) => (v.lat === undefined) === (v.lng === undefined), {
        message: "Укажите и широту, и долготу",
        path: ["lat"],
    });

export type BuiltObjectFormValues = z.infer<typeof builtObjectSchema>;

export function emptyBuiltObjectValues(): BuiltObjectFormValues {
    return {
        id: "",
        title: "",
        image: "",
        href: "",
        area: undefined,
        location: "",
        type: "",
        technology: "",
        lat: undefined,
        lng: undefined,
    };
}

export function builtObjectToFormValues(
    object: BuiltObject
): BuiltObjectFormValues {
    return {
        id: object.id,
        title: object.title,
        image: object.image,
        href: object.href,
        area: object.area,
        location: object.location ?? "",
        type: object.type ?? "",
        technology: object.technology ?? "",
        lat: object.coords?.lat,
        lng: object.coords?.lng,
    };
}

export function formValuesToBuiltObject(
    values: BuiltObjectFormValues
): BuiltObject {
    const location = values.location.trim();
    return {
        id: values.id.trim(),
        title: values.title.trim(),
        image: values.image.trim(),
        href: values.href.trim(),
        // clearable-override: всегда шлём поле (вкл. ""), API truthy-omit на чтение.
        type: values.type.trim(),
        technology: values.technology.trim(),
        ...(values.area !== undefined ? { area: values.area } : {}),
        ...(location ? { location } : {}),
        ...(values.lat !== undefined && values.lng !== undefined
            ? { coords: { lat: values.lat, lng: values.lng } }
            : {}),
    };
}
