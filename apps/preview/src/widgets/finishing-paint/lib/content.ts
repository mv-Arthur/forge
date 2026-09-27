import type {
    PaintBenefit,
    PaintChip,
    PaintCoatingGroup,
    PaintRisk,
    PaintStep,
} from "../finishing-paint.types";

export const HERO_IMAGE = "/media/tech/fachwerk/sample-a.jpg";

export const HERO_CHIPS: PaintChip[] = [
    { id: "safe", label: "Безопасные материалы" },
    { id: "spec", label: "По регламенту производителя" },
    { id: "estimate", label: "Смета в договоре" },
    { id: "since", label: "Красим с 2007 года" },
];

export const PAINT_BENEFITS: PaintBenefit[] = [
    {
        id: "materials",
        title: "Профессиональные ЛКМ",
        text: "Берём составы для деревянных домов: масла, лессирующие и укрывные. Не бытовой магазинный набор.",
    },
    {
        id: "spec",
        title: "Регламент производителя",
        text: "Влажность, слои и межслойная выдержка - как требует материал. Иначе покрытие не держится.",
    },
    {
        id: "estimate",
        title: "Смета до старта",
        text: "Считаем внешнюю и внутреннюю покраску целиком. Объём и состав работ фиксируем в договоре.",
    },
    {
        id: "prep",
        title: "Готовим поверхность",
        text: "Замер влажности, шлифовка, антисептик и защита торцов. Краска ложится на подготовленное дерево.",
    },
];

export const PAINT_RISKS: PaintRisk[] = [
    {
        id: "age",
        text: "сереют, теряют плотность и внешний вид",
    },
    {
        id: "fungus",
        text: "появляются грибок и гниль, которые сложно вывести",
    },
    {
        id: "rework",
        text: "позже придётся шлифовать до здорового слоя - это дороже, чем вовремя покрасить",
    },
];

export const PAINT_STEPS: PaintStep[] = [
    {
        n: "01",
        text: "Выбор цвета и материалов. Рекомендации и выкрасы прямо на доме.",
    },
    {
        n: "02",
        text: "Замер влажности древесины. Не красим, пока она выше нормы производителя.",
    },
    {
        n: "03",
        text: "Шлифовка. Выравниваем поверхность и открываем поры под покрытие.",
    },
    {
        n: "04",
        text: "Антисептирование. Состав с антисептиком, чтобы не сели грибок и синева.",
    },
    {
        n: "05",
        text: "Грунтовочный слой. Основа сцепления и равномерный цвет.",
    },
    {
        n: "06",
        text: "Промежуточная шлифовка. Снимаем ворс после грунта, покрытие гладкое.",
    },
    {
        n: "07",
        text: "Защита торцов. Закрываем торцы, чтобы влага не шла вдоль волокон.",
    },
    {
        n: "08",
        text: "Промежуточный слой. Для внутренних работ - водные составы 3 в 1.",
    },
    {
        n: "09",
        text: "Финишное покрытие. Основной материал: защита и нужный облик дома.",
    },
    {
        n: "10",
        text: "Контроль качества. Приёмка слоёв до сдачи объекта.",
    },
];

export const PAINT_COATINGS: PaintCoatingGroup[] = [
    {
        id: "glaze",
        title: "Лессирующие",
        text: "Полупрозрачные антисептики и масла. Рисунок дерева остаётся, ультрафиолет и грибок - нет.",
        cover: "/media/oils/grid-glaze.jpg",
        swatches: [
            {
                id: "pale",
                label: "Бледный",
                image: "/media/oils/glaze-01-pale.jpg",
            },
            {
                id: "honey",
                label: "Мёд",
                image: "/media/oils/glaze-02-honey.jpg",
            },
            {
                id: "cedar",
                label: "Кедр",
                image: "/media/oils/glaze-03-cedar.jpg",
            },
            {
                id: "walnut",
                label: "Орех",
                image: "/media/oils/glaze-04-walnut.jpg",
            },
        ],
    },
    {
        id: "cover",
        title: "Укрывные",
        text: "Плотный цвет и полная защита. Когда нужен яркий фасад или закрыть неоднородную древесину.",
        cover: "/media/oils/grid-cover.jpg",
        swatches: [
            {
                id: "pine",
                label: "Сосна",
                image: "/media/oils/cover-01-pine.jpg",
            },
            {
                id: "white",
                label: "Белый",
                image: "/media/oils/cover-02-white.jpg",
            },
            {
                id: "brown",
                label: "Коричневый",
                image: "/media/oils/cover-03-brown.jpg",
            },
            {
                id: "black",
                label: "Чёрный",
                image: "/media/oils/cover-04-black.jpg",
            },
        ],
    },
];
