import type { BuiltObject } from "@/domain/project";
import builtObjectsData from "./built-objects.json";

export function getBuiltObjects(): BuiltObject[] {
    return builtObjectsData as BuiltObject[];
}
