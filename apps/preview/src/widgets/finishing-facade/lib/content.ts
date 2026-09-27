import type {
    FacadeChip,
    FacadeCombo,
    FacadeMaterial,
} from "../finishing-facade.types";

export const HERO_IMAGE = "/media/stages/facade.jpg";

export const HERO_CHIPS: FacadeChip[] = [
    { id: "stone", label: "Газобетон и кирпич" },
    { id: "year", label: "Работы круглый год" },
    { id: "whole", label: "В рамках стройки дома" },
];

export const FACADE_MATERIALS: FacadeMaterial[] = [
    {
        id: "brick",
        title: "Облицовочный кирпич",
        text: "Кладем круглый год: зимой - тёплые смеси. Берём кирпич, который держит геометрию и цвет, без боя и высолов.",
        image: "/media/tech/brick/sample-a.jpg",
    },
    {
        id: "plaster",
        title: "Фасадная штукатурка",
        text: "Ровная стена и спокойный цвет. Подходит газобетону: закрывает контур и защищает блок от влаги.",
        image: "/media/tech/gas_concrete/sample-a.jpg",
    },
    {
        id: "planken",
        title: "Планкен из лиственницы",
        text: "Тёплый рисунок дерева на каменном контуре. Лиственница держит улицу, планкен можно комбинировать с кирпичом.",
        image: "/media/tech/frame/sample-b.jpg",
    },
    {
        id: "panels",
        title: "Фасадные панели",
        text: "Современный объём без мокрой отделки. Ставим на подсистему, стыки закрыты, уход минимальный.",
        image: "/media/tech/fachwerk/sample-a.jpg",
    },
    {
        id: "dpk",
        title: "ДПК",
        text: "Древесно-полимерный композит. Вид дерева, без гнили и ежегодной покраски. Удобно вставками и на террасах.",
        image: "/media/tech/frame/sample-a.jpg",
    },
];

export const FACADE_COMBOS: FacadeCombo[] = [
    {
        n: "01",
        title: "Кирпич и планкен",
        text: "Контраст тёплого дерева и прочной кладки. Камень держит цоколь и углы, дерево - плоскости стен.",
    },
    {
        n: "02",
        title: "Штукатурка и панели",
        text: "Спокойный фон и акцентные плоскости. Подходит современным объёмам без лишней массы.",
    },
    {
        n: "03",
        title: "ДПК вставками",
        text: "Вид дерева там, где его видно с участка, камень - на остальном фасаде. Выразительность без лишнего бюджета.",
    },
];
