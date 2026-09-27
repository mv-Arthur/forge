import type { ReactNode } from "react";

export type SiteSurveyChip = {
    id: string;
    label: string;
};

export type SiteSurveyAudience = {
    id: string;
    n: string;
    title: string;
    text: string;
    hint: string;
    image: string;
};

export type SiteSurveyDeliverableId = "report" | "checklist" | "advice" | "estimate";

export type SiteSurveyDeliverable = {
    id: SiteSurveyDeliverableId;
    title: string;
    text: string;
};

export type SiteSurveyWhyItem = {
    id: string;
    text: string;
};

export type SiteSurveyProps = {
    form: ReactNode;
};
