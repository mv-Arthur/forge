import type { ReactNode } from "react";

export type BuildSupportQualityId = "stages" | "checklists" | "photos";

export type BuildSupportQuality = {
    id: BuildSupportQualityId;
    title: string;
    text: string;
    image: string;
};

export type BuildSupportMediaId = "cameras" | "reports" | "daily";

export type BuildSupportMedia = {
    id: BuildSupportMediaId;
    title: string;
    text: string;
};

export type BuildSupportProps = {
    form: ReactNode;
};
