import type { HomeStageItem } from "../home-stages.types";

export const STAGE_ITEMS: HomeStageItem[] = [
    {
        id: "plot",
        title: "Комплексная проверка участка",
        text: "Геодезия, геология\nи юридическая проверка",
        image: "/media/stages/plot.jpg",
    },
    {
        id: "site",
        title: "Наружные сети и участок",
        text: "Дренаж, отмостка, ливнёвка, скважина, септик, вода и электричество",
        image: "/media/stages/site.jpg",
    },
    {
        id: "facade",
        title: "Отделка фасадов",
        text: "Штукатурка, облицовка,\nутепление фасада",
        image: "/media/stages/facade.jpg",
    },
    {
        id: "interior",
        title: "Внутренняя отделка и инженерия",
        text: "Перегородки, отопление, вентиляция, вода и канализация, электрика, тёплые полы, стяжка, отделка стен и потолка",
        image: "/media/stages/interior.jpg",
    },
];
