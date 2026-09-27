import { MapsRequestError, openMapsSession, searchToponyms } from "./session.ts";

const MOSCOW_LL: [number, number] = [37.6173, 55.7558];
const MOSCOW_SPN: [number, number] = [0.8, 0.5];

export async function resolveDistrictUrl(
    query: string,
    options: {
        fetch: typeof fetch;
        signal?: AbortSignal;
        userAgent?: string;
        origin?: string;
    }
): Promise<string> {
    const text = query.trim();
    if (!text) {
        throw new MapsRequestError("District query is empty");
    }
    const origin = options.origin ?? "https://yandex.ru";
    const session = await openMapsSession(origin, {
        fetch: options.fetch,
        signal: options.signal,
        userAgent: options.userAgent,
    });
    const items = await searchToponyms(session, {
        query: text,
        ll: MOSCOW_LL,
        spn: MOSCOW_SPN,
        fetch: options.fetch,
        signal: options.signal,
    });
    for (const item of items) {
        if (item.type !== "toponym") continue;
        const id =
            typeof item.id === "string" || typeof item.id === "number"
                ? String(item.id)
                : "";
        if (!/^\d+$/.test(id)) continue;
        return `${origin}/maps/?ol=geo&oid=${id}`;
    }
    throw new MapsRequestError(`District not found: ${text}`);
}
