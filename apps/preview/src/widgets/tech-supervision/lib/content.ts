import type {
    TechSupervisionAcceptance,
    TechSupervisionChip,
    TechSupervisionDiffer,
    TechSupervisionWhyItem,
} from "../tech-supervision.types";

export const HERO_IMAGE = "/media/stages/facade.jpg";

export const PARTNERS_IMAGE = "/media/blog/tech-materials.jpg";

export const HERO_CHIPS: TechSupervisionChip[] = [
    { id: "client", label: "Работа на стороне клиента" },
    { id: "hidden", label: "Контроль скрытых работ" },
    { id: "visit", label: "Выезд на приёмку каждого этапа" },
    { id: "norms", label: "Проверки по строительным нормам" },
    { id: "quality", label: "Качество, сроки, смета, проект" },
    { id: "training", label: "Аттестации у поставщиков материалов" },
];

export const WHY_ITEMS: TechSupervisionWhyItem[] = [
    {
        id: "accept",
        text: "контроль стройки и приёмка законченных этапов",
    },
    {
        id: "materials",
        text: "проверка качества материалов, хода работ и сроков",
    },
    {
        id: "norms",
        text: "соответствие конструкций строительным нормам",
    },
    {
        id: "tech",
        text: "предложение более удачной технологии, если она надёжнее или дешевле",
    },
    {
        id: "delay",
        text: "предупреждение срыва сроков и падения качества",
    },
    {
        id: "defects",
        text: "контроль устранения дефектов",
    },
    {
        id: "docs",
        text: "отчётная документация по этапу",
    },
];

export const DIFFER: TechSupervisionDiffer[] = [
    {
        id: "client",
        title: "На стороне клиента",
        text: "Инженер работает в интересах заказчика: качество и соответствие проекту, не скорость ради отчёта.",
    },
    {
        id: "hidden",
        title: "Скрытые работы",
        text: "Принимает то, что потом закроют отделкой: арматура, пирог, узлы.",
    },
    {
        id: "acceptance",
        title: "Приёмка этапа",
        text: "Выезд на каждый ключевой этап, не разовая проверка в конце.",
    },
    {
        id: "norms",
        title: "Нормы и смета",
        text: "Смотрит не только «сделано», но и по нормам, в срок и в бюджете.",
    },
];

export const ACCEPTANCE: TechSupervisionAcceptance[] = [
    {
        id: "walls",
        title: "Приёмка стенового комплекта",
        image: "/media/stages/site.jpg",
    },
    {
        id: "roof",
        title: "Приёмка кровли",
        image: "/media/stages/facade.jpg",
    },
    {
        id: "engineering",
        title: "Приёмка инженерных узлов",
        image: "/media/stages/interior.jpg",
    },
];
