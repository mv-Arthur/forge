import type { Certificate } from "@/domain/certificate";

// Fallback-данные сертификатов: отдаются, когда ncottage-api недоступен. Этот же
// массив — источник сидов в БД.
export const CERTIFICATES: Certificate[] = [
    {
        slug: "reestr-dobrosovestnyh-ispolniteley",
        title: "Реестр добросовестных исполнителей",
    },
    {
        slug: "menedzhment-bezopasnosti-truda",
        title: "Система менеджмента безопасности труда и охраны здоровья",
    },
    {
        slug: "ekologicheskiy-menedzhment",
        title: "Система экологического менеджмента в строительстве",
    },
    {
        slug: "znak-sootvetstviya",
        title: "Разрешение на применение знака соответствия системы сертификации",
    },
    {
        slug: "sootvetstvie-osb",
        title: "Сертификат соответствия на ОСБ",
    },
    {
        slug: "pozharobezopasnost-penopolistirol",
        title: "Сертификат пожаробезопасности на пенополистирол строительный",
    },
    {
        slug: "sootvetstvie-penopolistirol",
        title: "Сертификат соответствия на пенополистирол строительный",
    },
];
