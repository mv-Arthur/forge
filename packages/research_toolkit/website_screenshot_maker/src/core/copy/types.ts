/** Роль куска текста на странице. */
export type CopyRole =
    | "h1"
    | "h2"
    | "h3"
    | "eyebrow"
    | "body"
    | "cta"
    | "nav"
    | "kpi-value"
    | "kpi-label"
    | "form-label"
    | "placeholder"
    | "alt";

/**
 * Слот лейаута. Совпадает с AtlasSlot.kind,
 * плюс hero (первый h1 в main) и main.
 */
export type CopySlot =
    | "header"
    | "nav"
    | "hero"
    | "main"
    | "form"
    | "footer"
    | "dialog"
    | "tabs"
    | "gallery";

export type CopyBlock = {
    role: CopyRole;
    text: string;
    slot: CopySlot;
    selector: string;
    nearbyHeading: string | null;
    href: string | null;
    source: "visible" | "attr";
};

export type CopyPage = {
    url: string;
    slug: string;
    /** AtlasTemplate.id, например "/" или "/projects/:id" */
    templateId: string;
    title: string;
    status: "ok" | "skipped";
    reason: string | null;
    blocks: CopyBlock[];
};

/** Корень copy.json. */
export type CopyDump = {
    site: string;
    generatedAt: string;
    deviceId: string;
    pages: CopyPage[];
};
