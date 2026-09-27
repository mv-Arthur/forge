import { useCallback, useEffect, useState } from "react";
import {
    deleteMedia,
    listFolders,
    listMedia,
    updateMedia,
    uploadMedia,
    type FolderRow,
    type MediaItem,
} from "../lib/api";

export function useMediaLibrary() {
    const [folders, setFolders] = useState<FolderRow[]>([]);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [total, setTotal] = useState(0);
    const [folder, setFolder] = useState<string | undefined>(undefined);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selected = items.find((item) => item.id === selectedId) ?? null;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 250);
        return () => clearTimeout(timer);
    }, [query]);

    const reload = useCallback(async () => {
        setBusy(true);
        setError(null);
        try {
            const [list, folderRows] = await Promise.all([
                listMedia({ folder, q: debouncedQuery, take: 500 }),
                listFolders(),
            ]);
            setItems(list.items);
            setTotal(list.total);
            setFolders(folderRows);
            setSelectedId((id) =>
                id && list.items.some((item) => item.id === id) ? id : null
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }, [folder, debouncedQuery]);

    useEffect(() => {
        void reload();
    }, [reload]);

    async function upload(files: FileList | File[]) {
        setBusy(true);
        setError(null);
        try {
            let last: MediaItem | null = null;
            for (const file of Array.from(files)) {
                last = await uploadMedia(file, folder || undefined);
            }
            await reload();
            if (last) setSelectedId(last.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setBusy(false);
        }
    }

    async function save(patch: {
        alt?: string;
        folder?: string;
        filename?: string;
    }) {
        if (!selected) return;
        setBusy(true);
        setError(null);
        try {
            const next = await updateMedia(selected.id, patch);
            await reload();
            setSelectedId(next.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setBusy(false);
        }
    }

    async function remove() {
        if (!selected) return;
        setBusy(true);
        setError(null);
        try {
            await deleteMedia(selected.id);
            setSelectedId(null);
            await reload();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setBusy(false);
        }
    }

    return {
        folders,
        items,
        total,
        folder,
        setFolder,
        query,
        setQuery,
        selected,
        setSelectedId,
        busy,
        error,
        reload,
        upload,
        save,
        remove,
    };
}
