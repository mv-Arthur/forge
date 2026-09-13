import { useEffect, useState } from "react";
import { parseRoute } from "../../src/route.ts";
import type { AppRoute } from "../../src/route.ts";

export function useRoute(): [AppRoute, (path: string, replace?: boolean) => void] {
    const [route, setRoute] = useState(() => parseRoute(location.pathname));

    useEffect(() => {
        const onPop = () => setRoute(parseRoute(location.pathname));
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    function go(path: string, replace = false) {
        if (replace) history.replaceState(null, "", path);
        else history.pushState(null, "", path);
        setRoute(parseRoute(new URL(path, location.origin).pathname));
    }

    return [route, go];
}
