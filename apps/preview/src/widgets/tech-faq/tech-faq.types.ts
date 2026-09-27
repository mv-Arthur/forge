import type { ReactNode } from "react";

export type TechFaqItem = {
    id: string;
    question: string;
    answer: string[];
};

export type TechFaqProps = {
    form: ReactNode;
};
