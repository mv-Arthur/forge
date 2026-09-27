import type { Technology } from "../types/catalog.ts";

/**
 * One technology per card, chosen from the picture on the card.
 * Houses with a single fixture variant are absent: nothing to collapse.
 */
export const SHOWN_MATERIAL: Record<string, Technology> = {
    "a-dom": "frame",
    "akant": "gas_concrete",
    "alaster": "brick",
    "alikante": "gas_concrete",
    "anamur": "gas_concrete",
    "arbeyt": "brick",
    "arkada": "frame",
    "asten": "gas_concrete",
    "atrium": "brick",
    "batik": "brick",
    "bavariya": "gas_concrete",
    "bazel": "gas_concrete",
    "bergen": "gas_concrete",
    "bergen-mini": "gas_concrete",
    "berlin": "gas_concrete",
    "born": "frame",
    "brig": "fachwerk",
    "buharest": "brick",
    "chester": "gas_concrete",
    "cyurih": "gas_concrete",
    "davos": "gas_concrete",
    "daysen": "frame",
    "don": "frame",
    "dorn": "gas_concrete",
    "dortmund": "gas_concrete",
    "dover": "gas_concrete",
    "eliot": "gas_concrete",
    "erika": "gas_concrete",
    "fargo": "frame",
    "faron": "brick",
    "favor": "frame",
    "fest": "brick",
    "flagman": "brick",
    "flora": "gas_concrete",
    "forest": "gas_concrete",
    "fort": "gas_concrete",
    "galant": "frame",
    "garden": "gas_concrete",
    "garnet": "brick",
    "glazgo": "gas_concrete",
    "gostinica-12": "gas_concrete",
    "gostinica-3": "gas_concrete",
    "gostinica-4": "frame",
    "gostinica-5": "frame",
    "gostinica-6": "frame",
    "grand": "gas_concrete",
    "greys": "gas_concrete",
    "grot": "frame",
    "hart": "brick",
    "hill": "fachwerk",
    "kanon": "gas_concrete",
    "kantri": "gas_concrete",
    "kasl": "brick",
    "kolorit": "frame",
    "kross": "gas_concrete",
    "lester": "gas_concrete",
    "lids": "frame",
    "lind": "gas_concrete",
    "littl": "gas_concrete",
    "liverpul": "brick",
    "mark": "brick",
    "marokko": "gas_concrete",
    "meliton": "gas_concrete",
    "mersin": "gas_concrete",
    "milan": "gas_concrete",
    "modern": "gas_concrete",
    "moris": "gas_concrete",
    "nord": "gas_concrete",
    "nottingem": "gas_concrete",
    "optima": "gas_concrete",
    "orta": "gas_concrete",
    "otto": "brick",
    "prestizh": "brick",
    "rayt": "brick",
    "reyn": "gas_concrete",
    "richmond": "gas_concrete",
    "ridzh": "gas_concrete",
    "ritm": "gas_concrete",
    "saloniki": "gas_concrete",
    "shtern": "frame",
    "skandik": "frame",
    "stoun": "gas_concrete",
    "terem": "gas_concrete",
    "uayt": "gas_concrete",
    "vald": "brick",
    "valter": "brick",
    "venec": "frame",
    "vermion": "gas_concrete",
    "vernisazh": "gas_concrete",
    "vetter": "frame",
    "vikont": "brick",
    "viladzh": "frame",
    "vinkel": "frame",
    "vitrazh": "frame",
};

const LABEL: Record<Technology, string> = {
    frame: "Каркас",
    gas_concrete: "Газобетон",
    brick: "Кирпич",
    sip: "СИП",
    fachwerk: "Фахверк",
};

export function shownMaterialLabel(tech: Technology): string {
    return LABEL[tech];
}

export function applyShownMaterial<
    T extends {
        slug: string;
        technologies: Technology[];
        variants: Array<{ technology: Technology }>;
    },
>(project: T): T {
    const shown = SHOWN_MATERIAL[project.slug];
    if (!shown) return project;
    const variant = project.variants.find((item) => item.technology === shown);
    if (!variant) return project;
    return {
        ...project,
        variants: [variant],
        technologies: [shown],
    };
}
