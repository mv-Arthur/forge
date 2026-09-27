import type { ReactNode } from "react";
import type { EngineeringArticleSlug } from "@/lib/engineering";

export type EngineeringFigureKind =
    | "collector"
    | "floor"
    | "windows"
    | "valves"
    | "recuperator"
    | "smart"
    | "stack"
    | "supply";

export type EngineeringArticleBlock =
    | { type: "h2"; id: string; text: string }
    | { type: "h3"; id: string; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "table"; caption: string; rows: { label: string; value: string }[] }
    | { type: "image"; src: string; alt: string }
    | { type: "figure"; kind: EngineeringFigureKind; caption: string };

export type EngineeringTocItem = {
    id: string;
    text: string;
    level: 2 | 3;
};

export type EngineeringArticlePage = {
    slug: EngineeringArticleSlug;
    title: string;
    lead: string;
    offer: string[];
    blocks: EngineeringArticleBlock[];
};

export type EngineeringArticleProps = {
    page: EngineeringArticleSlug;
    form: ReactNode;
};
