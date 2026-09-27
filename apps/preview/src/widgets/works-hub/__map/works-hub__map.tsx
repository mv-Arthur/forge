"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PillTabs } from "@/ui/pill-tabs";
import {
    WORKS_MAP_ALL,
    WORKS_MAP_BUILDING,
    WORKS_MAP_BUILT,
    WORKS_MAP_CLEAR,
    WORKS_MAP_EMPTY,
    WORKS_MAP_SELECT_ALL,
    WORKS_MAP_WORKS,
} from "@/lib/copy";
import type { WorksMapPoint, WorksMapWorkType } from "../works-hub.types";
import styles from "../works-hub.module.css";

type Status = "all" | "built" | "in-progress";

const STATUS_TABS = [
    { id: "all", label: WORKS_MAP_ALL },
    { id: "in-progress", label: WORKS_MAP_BUILDING },
    { id: "built", label: WORKS_MAP_BUILT },
];

type YMapsNS = {
    ready: (cb: () => void) => void;
    Map: new (
        el: HTMLElement,
        state: object,
        opts?: object,
    ) => YMapInstance;
    ObjectManager: new (opts: object) => YObjectManager;
};

type YMapInstance = {
    geoObjects: { add: (obj: YObjectManager) => void };
    setBounds: (bounds: number[][], opts?: object) => void;
    setCenter: (center: number[], zoom: number) => void;
    container: { fitToViewport: () => void };
    destroy: () => void;
};

type YObjectManager = {
    add: (collection: object) => void;
    setFilter: (fn: (obj: YFeature) => boolean) => void;
    getBounds: () => number[][] | null;
    objects: {
        options: { set: (key: string, value: unknown) => void };
    };
    clusters: {
        options: { set: (key: string, value: unknown) => void };
    };
};

type YFeature = {
    id: string;
    properties: {
        data: {
            status: Status;
            workTypes: string[];
        };
    };
};

declare global {
    interface Window {
        ymaps?: YMapsNS;
    }
}

function ymapsSrc() {
    const key = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
    const base = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    return key ? `${base}&apikey=${encodeURIComponent(key)}` : base;
}

function loadYmaps() {
    return new Promise<YMapsNS>((resolve, reject) => {
        if (window.ymaps) {
            window.ymaps.ready(() => resolve(window.ymaps as YMapsNS));
            return;
        }
        const src = ymapsSrc();
        const existing = document.querySelector(`script[src="${src}"]`);
        const onReady = () => {
            if (!window.ymaps) {
                reject(new Error("ymaps"));
                return;
            }
            window.ymaps.ready(() => resolve(window.ymaps as YMapsNS));
        };
        if (existing) {
            existing.addEventListener("load", onReady, { once: true });
            existing.addEventListener("error", () => reject(), { once: true });
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.addEventListener("load", onReady);
        script.addEventListener("error", () => reject(new Error(src)));
        document.head.appendChild(script);
    });
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function balloonBody(point: WorksMapPoint) {
    const rows = [point.place, point.area, point.term].filter(Boolean);
    const facts = rows
        .map((row) => `<div>${escapeHtml(row as string)}</div>`)
        .join("");
    return `${facts}<div><a href="${escapeHtml(point.href)}">Смотреть</a></div>`;
}

function toFeature(point: WorksMapPoint) {
    return {
        type: "Feature",
        id: point.slug,
        geometry: {
            type: "Point",
            coordinates: [point.lat, point.lng],
        },
        properties: {
            balloonContentHeader: escapeHtml(point.title),
            balloonContentBody: balloonBody(point),
            clusterCaption: point.title,
            data: {
                status: point.status,
                workTypes: point.workTypes,
            },
        },
        options: {
            preset:
                point.status === "in-progress"
                    ? "islands#orangeDotIcon"
                    : "islands#orangeHomeIcon",
        },
    };
}

export function WorksHubMap({
    heading,
    workTypes,
    points,
}: {
    heading: string;
    workTypes: WorksMapWorkType[];
    points: WorksMapPoint[];
}) {
    const [status, setStatus] = useState<Status>("all");
    const [selected, setSelected] = useState<string[]>(() =>
        workTypes.map((type) => type.id),
    );
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<YMapInstance | null>(null);
    const managerRef = useRef<YObjectManager | null>(null);

    const visibleCount = useMemo(() => {
        const types = new Set(selected);
        return points.filter((point) => {
            if (status !== "all" && point.status !== status) return false;
            if (types.size === 0) return false;
            return point.workTypes.some((type) => types.has(type));
        }).length;
    }, [points, selected, status]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        let cancelled = false;
        let ro: ResizeObserver | null = null;
        loadYmaps()
            .then((ymaps) => {
                if (cancelled || !rootRef.current) return;
                const map = new ymaps.Map(
                    rootRef.current,
                    {
                        center: [59.94, 30.32],
                        zoom: 8,
                        controls: ["zoomControl", "fullscreenControl"],
                    },
                    { suppressMapOpenBlock: true },
                );
                const manager = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 64,
                    clusterDisableClickZoom: false,
                });
                manager.clusters.options.set(
                    "preset",
                    "islands#invertedOrangeClusterIcons",
                );
                manager.objects.options.set("preset", "islands#orangeHomeIcon");
                manager.add({
                    type: "FeatureCollection",
                    features: points.map(toFeature),
                });
                map.geoObjects.add(manager);
                mapRef.current = map;
                managerRef.current = manager;
                ro = new ResizeObserver(() => map.container.fitToViewport());
                ro.observe(rootRef.current);
                setReady(true);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });
        return () => {
            cancelled = true;
            ro?.disconnect();
            mapRef.current?.destroy();
            mapRef.current = null;
            managerRef.current = null;
        };
    }, [points]);

    useEffect(() => {
        const map = mapRef.current;
        const manager = managerRef.current;
        if (!map || !manager || !ready) return;
        const types = new Set(selected);
        manager.setFilter((obj) => {
            const data = obj.properties.data;
            if (status !== "all" && data.status !== status) return false;
            if (types.size === 0) return false;
            return data.workTypes.some((type) => types.has(type));
        });
        const visible = points.filter((point) => {
            if (status !== "all" && point.status !== status) return false;
            if (types.size === 0) return false;
            return point.workTypes.some((type) => types.has(type));
        });
        if (visible.length === 0) return;
        const lats = visible.map((point) => point.lat);
        const lngs = visible.map((point) => point.lng);
        const span = Math.max(
            Math.max(...lats) - Math.min(...lats),
            Math.max(...lngs) - Math.min(...lngs),
        );
        if (span < 2.4) {
            const bounds = manager.getBounds();
            if (bounds) map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 48 });
        } else {
            map.setCenter([59.94, 30.32], 8);
        }
    }, [ready, selected, status, points]);

    function toggleType(id: string) {
        setSelected((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    }

    return (
        <section id="map" data-section="works-map" className={styles.map}>
            <div className={styles.mapHead}>
                <h2 className={styles.blockTitle}>{heading}</h2>
            </div>
            <div className={styles.mapPills}>
                <PillTabs
                    items={STATUS_TABS}
                    value={status}
                    onChange={(id) => setStatus(id as Status)}
                />
            </div>
            <div className={styles.mapBoard}>
                <div className={styles.mapMenu}>
                    <div className={styles.mapMenuHead}>
                        <div className={styles.mapMenuTitle}>
                            {WORKS_MAP_WORKS}
                        </div>
                        <div className={styles.mapMenuActions}>
                            <button
                                type="button"
                                className={styles.mapMenuAction}
                                onClick={() => setSelected([])}
                            >
                                {WORKS_MAP_CLEAR}
                            </button>
                            <button
                                type="button"
                                className={styles.mapMenuAction}
                                onClick={() =>
                                    setSelected(workTypes.map((type) => type.id))
                                }
                            >
                                {WORKS_MAP_SELECT_ALL}
                            </button>
                        </div>
                    </div>
                    <ul className={styles.workList}>
                        {workTypes.map((type) => (
                            <li key={type.id}>
                                <label className={styles.workItem}>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(type.id)}
                                        onChange={() => toggleType(type.id)}
                                        className={styles.workCheck}
                                    />
                                    <span>{type.label}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.mapCanvas}>
                    <div ref={rootRef} className={styles.mapRoot} />
                    {failed ? (
                        <p className={styles.mapEmpty}>{WORKS_MAP_EMPTY}</p>
                    ) : null}
                    {ready && visibleCount === 0 ? (
                        <p className={styles.mapEmptyOverlay}>
                            {WORKS_MAP_EMPTY}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
