import type { BuiltObject } from "@/domain/project";
import builtObjectsData from "./built-objects.json";

// Построенные объекты приходят из ncottage-api (ISR-тег built-objects); при
// недоступности API отдаём статику из built-objects.json (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;
const STATIC_BUILT_OBJECTS = builtObjectsData as BuiltObject[];

export async function getBuiltObjects(): Promise<BuiltObject[]> {
    if (!API_URL) return STATIC_BUILT_OBJECTS;
    try {
        const res = await fetch(`${API_URL}/built-objects`, {
            next: { revalidate: REVALIDATE, tags: ["built-objects"] },
        });
        if (!res.ok) return STATIC_BUILT_OBJECTS;
        return (await res.json()) as BuiltObject[];
    } catch {
        return STATIC_BUILT_OBJECTS;
    }
}
