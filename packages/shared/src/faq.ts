// Доменный тип вопроса FAQ (плоская коллекция с полем group). Общий для
// backend и www (fallback). www группирует элементы по `group` при выводе.

export interface FaqItem {
    slug: string;
    question: string;
    answer: string;
    group: string;
}
