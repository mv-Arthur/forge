"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEYS = {
    favorites: "nc:favorites",
    compare: "nc:compare",
} as const;

const COMPARE_LIMIT = 4;

interface SelectionContextValue {
    favorites: string[];
    compare: string[];
    isFavorite: (slug: string) => boolean;
    isCompared: (slug: string) => boolean;
    toggleFavorite: (slug: string) => void;
    toggleCompare: (slug: string) => void;
    removeFavorite: (slug: string) => void;
    removeCompare: (slug: string) => void;
    clearFavorites: () => void;
    clearCompare: () => void;
    compareLimit: number;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

function readStored(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((v): v is string => typeof v === "string");
    } catch {
        return [];
    }
}

export function SelectionProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [compare, setCompare] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setFavorites(readStored(STORAGE_KEYS.favorites));
        setCompare(readStored(STORAGE_KEYS.compare));
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        window.localStorage.setItem(
            STORAGE_KEYS.favorites,
            JSON.stringify(favorites)
        );
    }, [favorites, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        window.localStorage.setItem(
            STORAGE_KEYS.compare,
            JSON.stringify(compare)
        );
    }, [compare, hydrated]);

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEYS.favorites) {
                setFavorites(readStored(STORAGE_KEYS.favorites));
            } else if (event.key === STORAGE_KEYS.compare) {
                setCompare(readStored(STORAGE_KEYS.compare));
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const toggleFavorite = useCallback((slug: string) => {
        setFavorites((prev) =>
            prev.includes(slug)
                ? prev.filter((s) => s !== slug)
                : [...prev, slug]
        );
    }, []);

    const toggleCompare = useCallback((slug: string) => {
        setCompare((prev) => {
            if (prev.includes(slug)) return prev.filter((s) => s !== slug);
            if (prev.length >= COMPARE_LIMIT) return prev;
            return [...prev, slug];
        });
    }, []);

    const removeFavorite = useCallback((slug: string) => {
        setFavorites((prev) => prev.filter((s) => s !== slug));
    }, []);

    const removeCompare = useCallback((slug: string) => {
        setCompare((prev) => prev.filter((s) => s !== slug));
    }, []);

    const clearFavorites = useCallback(() => setFavorites([]), []);
    const clearCompare = useCallback(() => setCompare([]), []);

    const value = useMemo<SelectionContextValue>(
        () => ({
            favorites,
            compare,
            isFavorite: (slug) => favorites.includes(slug),
            isCompared: (slug) => compare.includes(slug),
            toggleFavorite,
            toggleCompare,
            removeFavorite,
            removeCompare,
            clearFavorites,
            clearCompare,
            compareLimit: COMPARE_LIMIT,
        }),
        [
            favorites,
            compare,
            toggleFavorite,
            toggleCompare,
            removeFavorite,
            removeCompare,
            clearFavorites,
            clearCompare,
        ]
    );

    return (
        <SelectionContext.Provider value={value}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection(): SelectionContextValue {
    const ctx = useContext(SelectionContext);
    if (!ctx) {
        throw new Error("useSelection must be used within SelectionProvider");
    }
    return ctx;
}
