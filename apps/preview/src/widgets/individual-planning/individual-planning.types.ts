import type { ReactNode } from "react";
import type { MergedProject } from "@/types/catalog";

export type IndividualPlanningBenefitId =
    | "complex"
    | "engineers"
    | "site"
    | "budget"
    | "viz"
    | "sketch"
    | "archive";

export type IndividualPlanningBenefit = {
    id: IndividualPlanningBenefitId;
    title: string;
    text: string;
};

export type IndividualPlanningStep = {
    n: string;
    text: string;
};

export type IndividualPlanningProps = {
    projects: MergedProject[];
    form: ReactNode;
};
