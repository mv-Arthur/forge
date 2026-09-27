import type {
    ExteriorChip,
    ExteriorMethod,
    ExteriorWhenStep,
} from "../finishing-exterior.types";

export const HERO_IMAGE = "/media/tech/frame/sample-a.jpg";

export const HERO_CHIPS: ExteriorChip[] = [
    { id: "wood", label: "Каркас, фахверк, СИП" },
    { id: "protect", label: "Защита без облицовки" },
    { id: "early", label: "Первые полгода после сборки" },
];

export const EXTERIOR_METHODS: ExteriorMethod[] = [
    {
        id: "antiseptic",
        n: "1.",
        title: "Колерованные лессирующие антисептики",
        text: "Пропитывают торцы и волокна. Защищают от насекомых, грибка и синевы. Рисунок дерева остаётся, ультрафиолет закрыт.",
        image: "/media/oils/glaze-02-honey.jpg",
    },
    {
        id: "oils",
        n: "2.",
        title: "Полупрозрачные и укрывные масла",
        text: "Подчёркивают материал и держат цвет. В составе антисептик. Снаружи их проще обновлять без полной шлифовки.",
        image: "/media/oils/cover-01-pine.jpg",
    },
    {
        id: "water-glaze",
        n: "3.",
        title: "Лессирующие составы на водной основе",
        text: "Полупрозрачная краска с антисептиком. Дерево видно, фасад защищён от влаги и солнца.",
        image: "/media/oils/glaze-01-pale.jpg",
    },
    {
        id: "cover",
        n: "4.",
        title: "Укрывные краски на водной основе",
        text: "Плотный цвет и полная защита. Когда нужен яркий фасад или закрыть неоднородную древесину.",
        image: "/media/oils/cover-04-black.jpg",
    },
];

export const EXTERIOR_WHEN_STEPS: ExteriorWhenStep[] = [
    {
        n: "01",
        text: "Выбор цвета. Согласования, визуализация и пробные выкрасы на доме.",
    },
    {
        n: "02",
        text: "Контроль влажности. Краска ложится, если влажность не выше 14%.",
    },
    {
        n: "03",
        text: "Шлифовка и антисептик. Состав наносят на обработанную стену - так он идёт глубже.",
    },
    {
        n: "04",
        text: "Грунт и несколько слоёв с промежуточной шлифовкой.",
    },
    {
        n: "05",
        text: "Герметизация торцов и финишный слой.",
    },
];
