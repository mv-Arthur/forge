// Доменный тип вакансии (коллекция). Общий для backend и www (fallback).

export interface Vacancy {
    slug: string;
    order: number;
    title: string;
    intro: string;
    salary: string;
    experience: string;
    requirements: string[];
    conditions: string[];
}
