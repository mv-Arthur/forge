"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Tab {
    id: string;
    label: string;
}

interface Props {
    tabs: Tab[];
}

/** Sticky header + tabs bar — active section is the last whose top is above this line. */
function spyOffset(): number {
    const header =
        parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
                "--site-header-height",
            ),
        ) || 72;
    const tabsBar = 52;
    return header + tabsBar + 12;
}

export function AnchorTabs({ tabs }: Props) {
    const [active, setActive] = useState<string>(tabs[0]?.id ?? "");
    const clickingRef = useRef(false);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const syncActive = useCallback(() => {
        if (clickingRef.current) return;
        const line = window.scrollY + spyOffset();
        let current = tabs[0]?.id ?? "";

        // Last section whose top is above the sticky line (tabs order = DOM order)
        for (const tab of tabs) {
            const el = document.getElementById(tab.id);
            if (!el) continue;
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (top <= line + 1) current = tab.id;
        }

        // near bottom of page: force last existing section
        const doc = document.documentElement;
        if (window.scrollY + window.innerHeight >= doc.scrollHeight - 8) {
            for (let i = tabs.length - 1; i >= 0; i--) {
                if (document.getElementById(tabs[i].id)) {
                    current = tabs[i].id;
                    break;
                }
            }
        }

        setActive((prev) => (prev === current ? prev : current));
    }, [tabs]);

    useEffect(() => {
        syncActive();
        window.addEventListener("scroll", syncActive, { passive: true });
        window.addEventListener("resize", syncActive);
        return () => {
            window.removeEventListener("scroll", syncActive);
            window.removeEventListener("resize", syncActive);
            if (clickTimer.current) clearTimeout(clickTimer.current);
        };
    }, [syncActive]);

    const onTabClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;

        setActive(id);
        clickingRef.current = true;
        if (clickTimer.current) clearTimeout(clickTimer.current);

        const top =
            el.getBoundingClientRect().top + window.scrollY - spyOffset() + 2;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

        // ignore spy while smooth scroll runs
        clickTimer.current = setTimeout(() => {
            clickingRef.current = false;
            syncActive();
        }, 700);

        history.replaceState(null, "", `#${id}`);
    };

    return (
        <div className="anchor-tabs scroll-hide" role="navigation" aria-label="Разделы страницы">
            {tabs.map((t) => (
                <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={`anchor-tab ${
                        active === t.id ? "anchor-tab-active" : ""
                    }`}
                    onClick={onTabClick(t.id)}
                    aria-current={active === t.id ? "true" : undefined}
                >
                    {t.label}
                </a>
            ))}
        </div>
    );
}
