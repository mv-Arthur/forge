import type { LucideIcon } from "lucide-react";
import { Building2, FileText, ImageIcon, Inbox } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    disabled?: boolean;
    badge?: string;
}

export interface NavSection {
    label: string;
    items: NavItem[];
}

// Sidebar information architecture. Disabled items are wired up in later epics
// (Media → B2, Content → E*), shown now so the structure is visible.
export const NAV_SECTIONS: NavSection[] = [
    {
        label: "Управление",
        items: [
            { label: "Проекты", href: "/projects", icon: Building2 },
            { label: "Лиды", href: "/leads", icon: Inbox },
        ],
    },
    {
        label: "Контент сайта",
        items: [
            {
                label: "Медиа",
                href: "/media",
                icon: ImageIcon,
                disabled: true,
                badge: "скоро",
            },
            {
                label: "Контент",
                href: "/content",
                icon: FileText,
                disabled: true,
                badge: "скоро",
            },
        ],
    },
];
