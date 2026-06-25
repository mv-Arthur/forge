import type { LucideIcon } from "lucide-react";
import {
    Briefcase,
    Building2,
    FileText,
    ImageIcon,
    Inbox,
    Newspaper,
    Tag,
    Users,
} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    disabled?: boolean;
    badge?: string;
    adminOnly?: boolean;
}

export interface NavSection {
    label: string;
    items: NavItem[];
}

// Sidebar information architecture. Disabled items are wired up in later epics,
// shown now so the structure is visible.
export const NAV_SECTIONS: NavSection[] = [
    {
        label: "Управление",
        items: [
            { label: "Проекты", href: "/projects", icon: Building2 },
            { label: "Лиды", href: "/leads", icon: Inbox },
            {
                label: "Пользователи",
                href: "/users",
                icon: Users,
                adminOnly: true,
            },
        ],
    },
    {
        label: "Контент сайта",
        items: [
            { label: "Медиа", href: "/media", icon: ImageIcon },
            { label: "Блог", href: "/blog", icon: Newspaper },
            { label: "Акции", href: "/promos", icon: Tag },
            { label: "Вакансии", href: "/vacancies", icon: Briefcase },
            { label: "Контент", href: "/content", icon: FileText },
        ],
    },
];
