import type { ReactNode } from "react";
import type { EnrichedBuiltObject, Technology } from "@/types/catalog";

export type WorksCatalogProps = {
    objects: EnrichedBuiltObject[];
    filters: ReactNode;
    extraFilter: ReactNode;
    lightbox: ReactNode;
    onOpen: (slug: string, index: number) => void;
};

export type WorksCatalogFiltersProps = {
    areaLabel: string;
    areaMin: number;
    areaMax: number;
    areaFrom: number;
    areaTo: number;
    areaEnabled: boolean;
    onAreaChange: (from: number, to: number) => void;
    onAreaClear: () => void;
    areaClearLabel: string;
    materialsLabel: string;
    allLabel: string;
    materials: Array<{ id: Technology; label: string }>;
    selected: Technology | "all" | null;
    onSelect: (id: Technology | "all") => void;
};

export type WorksCatalogItemProps = {
    object: EnrichedBuiltObject;
    onOpen: (slug: string, index: number) => void;
};

export type WorksCatalogLightboxProps = {
    object: EnrichedBuiltObject;
    index: number;
    onIndex: (index: number) => void;
    onClose: () => void;
};
