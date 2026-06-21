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
import { usePathname } from "next/navigation";
import { CallbackModal } from "@/components/shared/CallbackModal";

interface CallbackOptions {
    title?: string;
    subtitle?: string;
}

interface CallbackContextValue {
    openCallback: (options?: CallbackOptions) => void;
    closeCallback: () => void;
}

const CallbackContext = createContext<CallbackContextValue | null>(null);

export function CallbackProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<CallbackOptions>({});
    const pathname = usePathname();

    const openCallback = useCallback((opts: CallbackOptions = {}) => {
        setOptions(opts);
        setOpen(true);
    }, []);

    const closeCallback = useCallback(() => setOpen(false), []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const value = useMemo<CallbackContextValue>(
        () => ({ openCallback, closeCallback }),
        [openCallback, closeCallback]
    );

    return (
        <CallbackContext.Provider value={value}>
            {children}
            <CallbackModal
                open={open}
                onClose={closeCallback}
                title={options.title}
                subtitle={options.subtitle}
            />
        </CallbackContext.Provider>
    );
}

export function useCallbackModal(): CallbackContextValue {
    const ctx = useContext(CallbackContext);
    if (!ctx) {
        throw new Error(
            "useCallbackModal must be used within CallbackProvider"
        );
    }
    return ctx;
}
