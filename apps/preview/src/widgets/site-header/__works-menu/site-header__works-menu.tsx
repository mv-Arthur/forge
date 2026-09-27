import Link from "next/link";
import {
    NAV_WORKS_GALLERY,
    NAV_WORKS_MAP,
    NAV_WORKS_STAGES,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import styles from "./site-header__works-menu.module.css";

function HousesIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M4 11.2 12 4.4l8 6.8V20H4z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M12 18.4c-2.5-2.2-4.2-3.5-4.2-5.3 0-1.15.9-2 2.05-2 .8 0 1.5.4 2.15 1.28.65-.88 1.35-1.28 2.15-1.28 1.15 0 2.05.85 2.05 2 0 1.8-1.7 3.1-4.2 5.3z"
                fill="currentColor"
            />
        </svg>
    );
}

function StagesIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" overflow="visible" aria-hidden>
            <rect
                x="2.8"
                y="6.6"
                width="18.4"
                height="13.8"
                rx="3.4"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M2.9 17.6 8.2 12.6l3.8 3 3.2-2.5 5.9 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="8" cy="10.2" r="1.25" fill="currentColor" />
            <path
                d="M17.7 7.15c-1.55-1.35-2.6-2.15-2.6-3.25 0-.7.55-1.25 1.25-1.25.5 0 .92.24 1.35.8.43-.56.85-.8 1.35-.8.7 0 1.25.55 1.25 1.25 0 1.1-1.05 1.9-2.6 3.25z"
                fill="currentColor"
            />
        </svg>
    );
}

function MapClusterIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M7.4 12.4c1.8 1.4 3.7 2.1 6.1 1.15 2.1-.85 3.6.3 5.2 1.85"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="1.4 2.6"
            />
            <path
                d="M8.1 8.8c0 2.55-2.55 4.5-2.55 4.5S3 11.35 3 8.8a2.55 2.55 0 1 1 5.1 0z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <circle cx="5.55" cy="8.55" r=".8" fill="currentColor" />
            <path
                d="M16.6 8.1c0 3.3-3.35 5.8-3.35 5.8S9.9 11.4 9.9 8.1a3.35 3.35 0 1 1 6.7 0z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <circle cx="13.25" cy="7.85" r="1" fill="currentColor" />
            <path
                d="M21.5 13.55c0 2.4-2.4 4.2-2.4 4.2s-2.4-1.8-2.4-4.2a2.4 2.4 0 1 1 4.8 0z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <circle cx="19.1" cy="13.3" r=".75" fill="currentColor" />
        </svg>
    );
}

export const WORKS_NAV_LINKS = [
    {
        href: routes.worksGallery(),
        label: NAV_WORKS_GALLERY,
        Icon: HousesIcon,
    },
    {
        href: routes.worksStagesHub,
        label: NAV_WORKS_STAGES,
        Icon: StagesIcon,
    },
    {
        href: routes.worksMap,
        label: NAV_WORKS_MAP,
        Icon: MapClusterIcon,
    },
];

export function SiteHeaderWorksMenu({ open }: { open: boolean }) {
    return (
        <div
            className={styles.root}
            data-section="header-works-menu"
            data-open={open || undefined}
            aria-hidden={!open}
            inert={!open ? true : undefined}
        >
            <div className={styles.panel}>
                {WORKS_NAV_LINKS.map(({ href, label, Icon }) => (
                    <Link key={href} href={href} className={styles.item}>
                        <span className={styles.icon} aria-hidden>
                            <Icon />
                        </span>
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
