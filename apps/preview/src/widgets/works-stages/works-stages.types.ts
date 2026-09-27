import type { ReactNode } from "react";
import type { WorksStagePayload } from "@/types/catalog";

export type WorksStagesCols = 1 | 2 | 3;

export type WorksStagesViewProps = {
    payload: WorksStagePayload;
    menu: ReactNode;
    chips: ReactNode;
    secret: ReactNode;
    tags: ReactNode;
    gallery: ReactNode;
    lightbox: ReactNode;
};

export type WorksStagesMenuProps = {
    title: string;
    items: WorksStagePayload["menu"];
};

export type WorksStagesChipsProps = {
    items: WorksStagePayload["chips"];
};

export type WorksStagesSecretProps = {
    src: string;
};

export type WorksStagesTagsProps = {
    items: WorksStagePayload["tags"];
    activeId: string;
    onSelect: (id: string) => void;
};

export type WorksStagesGalleryProps = {
    title: string;
    photos: string[];
    cols: WorksStagesCols;
    onCols: (cols: WorksStagesCols) => void;
    onOpen: (index: number) => void;
};

export type WorksStagesLightboxProps = {
    photos: string[];
    index: number;
    caption: string;
    onIndex: (index: number) => void;
    onClose: () => void;
};
