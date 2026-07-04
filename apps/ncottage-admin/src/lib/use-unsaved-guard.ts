"use client";

import { useEffect } from "react";

// Предупреждает о несохранённых изменениях при закрытии/перезагрузке вкладки.
// Посекционные формы редактора страниц сохраняются по отдельности, поэтому без
// этого уход со страницы тихо терял правки.
export function useUnsavedGuard(when: boolean): void {
    useEffect(() => {
        if (!when) return;
        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [when]);
}
