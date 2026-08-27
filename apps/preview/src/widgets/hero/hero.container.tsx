"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    DRAG_ARM_PX,
    dragFlipDir,
    keyDir,
    prefersReducedMotion,
    stepIndex,
    type SlideDir,
} from "./lib/slider";
import { toHeroContent } from "./lib/images";
import { Hero } from "./hero";
import type { HeroPayload } from "./hero.types";

type Drag = {
    x: number;
    live: boolean;
    id: number;
};

export function HeroContainer({
    payload,
    intervalMs = 5000,
}: {
    payload: HeroPayload;
    intervalMs?: number;
}) {
    const content = toHeroContent(payload);
    const n = content.cards.length;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const drag = useRef<Drag | null>(null);
    const ignoreClick = useRef(false);

    const go = useCallback(
        (dir: SlideDir) => {
            setIndex((i) => stepIndex(i, dir, n));
        },
        [n],
    );

    function onPointerDown(e: React.PointerEvent) {
        if (n < 2 || e.button !== 0) return;
        ignoreClick.current = false;
        drag.current = { x: e.clientX, live: false, id: e.pointerId };
    }

    function onPointerMove(e: React.PointerEvent) {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        if (Math.abs(e.clientX - d.x) < DRAG_ARM_PX) return;
        if (!d.live) {
            d.live = true;
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        if (e.pointerType === "touch") e.preventDefault();
    }

    function onPointerUp(e: React.PointerEvent) {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const dir = dragFlipDir(e.clientX - d.x, d.live);
        if (!dir) return;
        ignoreClick.current = true;
        go(dir);
    }

    function onPointerCancel() {
        drag.current = null;
    }

    function onDragStart(e: React.DragEvent) {
        e.preventDefault();
    }

    function onClickCapture(e: React.MouseEvent) {
        if (!ignoreClick.current) return;
        e.preventDefault();
        e.stopPropagation();
        ignoreClick.current = false;
    }

    function onKeyDown(e: React.KeyboardEvent) {
        const dir = keyDir(e.key);
        if (!dir) return;
        e.preventDefault();
        go(dir);
    }

    useEffect(() => {
        if (n < 2 || intervalMs <= 0 || paused) return;
        if (prefersReducedMotion()) return;
        const t = setInterval(() => go(1), intervalMs);
        return () => clearInterval(t);
    }, [n, intervalMs, go, paused]);

    const promo = {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onKeyDown,
        tabIndex: n > 1 ? (0 as const) : undefined,
    };
    const slider = {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onDragStart,
        onClickCapture,
    };

    return (
        <Hero
            {...content}
            index={index}
            onSelect={setIndex}
            promo={promo}
            slider={slider}
        />
    );
}
