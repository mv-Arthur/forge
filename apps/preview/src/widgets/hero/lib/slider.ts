export type SlideDir = 1 | -1;

export const DRAG_ARM_PX = 12;
export const DRAG_FLIP_PX = 48;

export function stepIndex(i: number, dir: SlideDir, n: number): number {
    if (n < 2) return i;
    return (i + dir + n) % n;
}

export function dragFlipDir(dx: number, live: boolean): SlideDir | null {
    if (!live || Math.abs(dx) < DRAG_FLIP_PX) return null;
    return dx < 0 ? 1 : -1;
}

export function keyDir(key: string): SlideDir | null {
    if (key === "ArrowRight") return 1;
    if (key === "ArrowLeft") return -1;
    return null;
}

export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
