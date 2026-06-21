"use client";

import {
    type FormEvent,
    type KeyboardEvent as ReactKeyboardEvent,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { ArrowRightGlyph } from "./icons";
import {
    PROJECT_HUB_CATEGORIES,
    PROJECT_TECHNOLOGY_LABELS,
} from "@/domain/technology";
import type { Project } from "@/domain/project";
import styles from "./SiteSearch.module.css";

interface SiteSearchProps {
    open: boolean;
    onClose: () => void;
    placeholder?: string;
}

interface QuickTag {
    label: string;
    href: string;
}

const CATALOG_PATH = "/projects/all";

const POPULAR_TAGS: QuickTag[] = [
    { label: "До 100 м²", href: `${CATALOG_PATH}?areaMax=100` },
    { label: "Одноэтажные", href: `${CATALOG_PATH}?floors=1` },
    { label: "С террасой", href: `${CATALOG_PATH}?features=terrace` },
    { label: "С гаражом", href: `${CATALOG_PATH}?features=garage` },
    {
        label: "С панорамными окнами",
        href: `${CATALOG_PATH}?features=panoramic-windows`,
    },
];

const MAX_RESULTS = 6;
const SUGGESTED_COUNT = 4;
const PRICE_FORMATTER = new Intl.NumberFormat("ru-RU");

function formatPrice(value: number): string {
    return `от ${PRICE_FORMATTER.format(value)} ₽`;
}

function matchesQuery(project: Project, query: string): boolean {
    return (
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        PROJECT_TECHNOLOGY_LABELS[project.technology]
            .toLowerCase()
            .includes(query)
    );
}

export function SiteSearch({
    open,
    onClose,
    placeholder = "Найти проект",
}: SiteSearchProps) {
    const [query, setQuery] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const labelId = useId();

    // Каталог для поиска подгружаем один раз с публичного прокси-роута.
    useEffect(() => {
        let cancelled = false;
        fetch("/api/projects")
            .then((res) => (res.ok ? res.json() : []))
            .then((data: Project[]) => {
                if (!cancelled) setProjects(data);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setQuery("");
            return;
        }
        const id = window.setTimeout(() => inputRef.current?.focus(), 60);
        return () => window.clearTimeout(id);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        const onPointerDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            if (panelRef.current?.contains(target)) return;
            if (target.closest("[data-search-trigger]")) return;
            onClose();
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("mousedown", onPointerDown);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("mousedown", onPointerDown);
        };
    }, [open, onClose]);

    const trimmed = query.trim().toLowerCase();
    const hasQuery = trimmed.length > 0;

    const results = useMemo<Project[]>(() => {
        if (!trimmed) return [];
        return projects
            .filter((p) => matchesQuery(p, trimmed))
            .slice(0, MAX_RESULTS);
    }, [trimmed, projects]);

    const suggested = useMemo<Project[]>(
        () => projects.filter((p) => p.featured).slice(0, SUGGESTED_COUNT),
        [projects]
    );

    const navItems = useMemo<Array<{ key: string; href: string }>>(() => {
        if (hasQuery) {
            return results.map((p) => ({
                key: `result-${p.slug}`,
                href: `/project/${p.slug}`,
            }));
        }
        return [
            ...POPULAR_TAGS.map((t) => ({
                key: `tag-${t.label}`,
                href: t.href,
            })),
            ...PROJECT_HUB_CATEGORIES.map((c) => ({
                key: `cat-${c.slug}`,
                href: c.slug === "all" ? CATALOG_PATH : `/projects/${c.slug}`,
            })),
            ...suggested.map((p) => ({
                key: `sug-${p.slug}`,
                href: `/project/${p.slug}`,
            })),
        ];
    }, [hasQuery, results, suggested]);

    const [focusedIndex, setFocusedIndex] = useState(-1);

    useEffect(() => {
        setFocusedIndex(-1);
    }, [hasQuery, open]);

    const focusedKey =
        focusedIndex >= 0 && focusedIndex < navItems.length
            ? navItems[focusedIndex].key
            : null;

    useEffect(() => {
        if (!focusedKey || !panelRef.current) return;
        const el = panelRef.current.querySelector(
            `[data-search-key="${focusedKey}"]`
        ) as HTMLElement | null;
        el?.scrollIntoView({ block: "nearest" });
    }, [focusedKey]);

    const submitFullSearch = () => {
        const target = trimmed
            ? `${CATALOG_PATH}?q=${encodeURIComponent(query.trim())}`
            : CATALOG_PATH;
        router.push(target);
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < navItems.length) {
            router.push(navItems[focusedIndex].href);
            onClose();
            return;
        }
        submitFullSearch();
    };

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLFormElement>) => {
        if (navItems.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((i) => (i + 1) % navItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((i) => (i <= 0 ? navItems.length - 1 : i - 1));
        }
    };

    return (
        <div
            ref={panelRef}
            className={styles.panel}
            data-open={open || undefined}
            role="dialog"
            aria-labelledby={labelId}
            aria-hidden={!open}
        >
            <Container className={styles.inner}>
                <form
                    className={styles.field}
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
                >
                    <span className={styles.fieldIcon} aria-hidden="true">
                        <SearchIcon />
                    </span>
                    <label htmlFor={labelId} className={styles.srOnly}>
                        Поиск по проектам
                    </label>
                    <input
                        ref={inputRef}
                        id={labelId}
                        type="search"
                        className={styles.input}
                        placeholder={placeholder}
                        value={query}
                        autoComplete="off"
                        spellCheck={false}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            className={styles.clearBtn}
                            aria-label="Очистить запрос"
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                        >
                            <CloseIcon width={14} height={14} />
                        </button>
                    )}
                    <button
                        type="button"
                        className={styles.escBtn}
                        onClick={onClose}
                        aria-label="Закрыть поиск"
                    >
                        Esc
                    </button>
                </form>

                <div className={styles.body}>
                    {hasQuery ? (
                        <ResultsView
                            query={query.trim()}
                            results={results}
                            focusedKey={focusedKey}
                            onNavigate={onClose}
                            onShowAll={submitFullSearch}
                        />
                    ) : (
                        <EmptyView
                            suggested={suggested}
                            focusedKey={focusedKey}
                            onNavigate={onClose}
                        />
                    )}
                </div>
            </Container>
        </div>
    );
}

interface EmptyViewProps {
    suggested: Project[];
    focusedKey: string | null;
    onNavigate: () => void;
}

function EmptyView({ suggested, focusedKey, onNavigate }: EmptyViewProps) {
    return (
        <>
            <Section title="Популярные запросы">
                <div className={styles.tags}>
                    {POPULAR_TAGS.map((tag) => {
                        const key = `tag-${tag.label}`;
                        return (
                            <Link
                                key={key}
                                href={tag.href}
                                className={styles.tag}
                                data-search-key={key}
                                data-focused={focusedKey === key || undefined}
                                onClick={onNavigate}
                            >
                                {tag.label}
                            </Link>
                        );
                    })}
                </div>
            </Section>

            <Section title="Категории">
                <div className={styles.categories}>
                    {PROJECT_HUB_CATEGORIES.map((cat) => {
                        const href =
                            cat.slug === "all"
                                ? CATALOG_PATH
                                : `/projects/${cat.slug}`;
                        const key = `cat-${cat.slug}`;
                        return (
                            <Link
                                key={key}
                                href={href}
                                className={styles.categoryTile}
                                data-search-key={key}
                                data-focused={focusedKey === key || undefined}
                                onClick={onNavigate}
                            >
                                <Image
                                    src={cat.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 50vw, 200px"
                                    className={styles.categoryImage}
                                />
                                <span
                                    className={styles.categoryGradient}
                                    aria-hidden="true"
                                />
                                <span className={styles.categoryTitle}>
                                    {cat.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </Section>

            <Section title="Возможно, понравится">
                <ul className={styles.suggestList}>
                    {suggested.map((p) => {
                        const key = `sug-${p.slug}`;
                        return (
                            <ProjectRow
                                key={key}
                                navKey={key}
                                project={p}
                                focused={focusedKey === key}
                                onNavigate={onNavigate}
                            />
                        );
                    })}
                </ul>
            </Section>
        </>
    );
}

interface ResultsViewProps {
    query: string;
    results: Project[];
    focusedKey: string | null;
    onNavigate: () => void;
    onShowAll: () => void;
}

function ResultsView({
    query,
    results,
    focusedKey,
    onNavigate,
    onShowAll,
}: ResultsViewProps) {
    if (results.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                    По запросу «{query}» ничего не нашли
                </p>
                <p className={styles.emptyHint}>
                    Попробуйте изменить запрос или открыть полный каталог.
                </p>
                <button
                    type="button"
                    className={styles.emptyAction}
                    onClick={onShowAll}
                >
                    Открыть каталог
                </button>
            </div>
        );
    }

    return (
        <>
            <Section title={`Результаты для «${query}»`}>
                <ul className={styles.suggestList}>
                    {results.map((p) => {
                        const key = `result-${p.slug}`;
                        return (
                            <ProjectRow
                                key={key}
                                navKey={key}
                                project={p}
                                focused={focusedKey === key}
                                onNavigate={onNavigate}
                            />
                        );
                    })}
                </ul>
            </Section>
            <button
                type="button"
                className={styles.showAllBtn}
                onClick={onShowAll}
            >
                Все результаты в каталоге
                <ArrowRightGlyph />
            </button>
        </>
    );
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            {children}
        </section>
    );
}

interface ProjectRowProps {
    project: Project;
    navKey: string;
    focused: boolean;
    onNavigate: () => void;
}

function ProjectRow({ project, navKey, focused, onNavigate }: ProjectRowProps) {
    return (
        <li>
            <Link
                href={`/project/${project.slug}`}
                className={styles.row}
                data-search-key={navKey}
                data-focused={focused || undefined}
                onClick={onNavigate}
            >
                <span className={styles.rowThumb}>
                    <Image src={project.image} alt="" fill sizes="80px" />
                </span>
                <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{project.name}</span>
                    <span className={styles.rowMeta}>
                        {PROJECT_TECHNOLOGY_LABELS[project.technology]} ·{" "}
                        {project.area} м² · {project.floors}{" "}
                        {project.floors === 1 ? "этаж" : "этажа"}
                    </span>
                </span>
                <span className={styles.rowPrice}>
                    {formatPrice(project.price)}
                </span>
            </Link>
        </li>
    );
}
