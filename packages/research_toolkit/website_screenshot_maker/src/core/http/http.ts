import http from "http";
import https from "https";
import { apexHost } from "../url/index.js";

const MAX_REDIRECTS = 3;

export type FetchTextResult = {
    status: number;
    body: string;
};

/** Скачать URL как UTF-8. До MAX_REDIRECTS редиректов, только same-apex. */
export function fetchText(url: string): Promise<FetchTextResult> {
    const originApex = apexHost(new URL(url).hostname);
    return fetchHop(url, 0, originApex);
}

function fetchHop(
    url: string,
    hops: number,
    originApex: string,
): Promise<FetchTextResult> {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith("https") ? https : http;
        const req = lib.get(
            url,
            { headers: { "User-Agent": "Mozilla/5.0 website-screenshot-maker/1.0" } },
            (res) => {
                if (
                    res.statusCode &&
                    res.statusCode >= 300 &&
                    res.statusCode < 400 &&
                    res.headers.location
                ) {
                    if (hops >= MAX_REDIRECTS) {
                        res.resume();
                        return reject(new Error("too many redirects " + url));
                    }
                    let next: URL;
                    try {
                        next = new URL(res.headers.location, url);
                    } catch {
                        res.resume();
                        return reject(new Error("bad redirect " + url));
                    }
                    if (apexHost(next.hostname) !== originApex) {
                        res.resume();
                        return reject(new Error("redirect off origin " + next.href));
                    }
                    res.resume();
                    return resolve(fetchHop(next.href, hops + 1, originApex));
                }
                const chunks: Buffer[] = [];
                res.on("data", (c: Buffer) => chunks.push(c));
                res.on("end", () =>
                    resolve({
                        status: res.statusCode ?? 0,
                        body: Buffer.concat(chunks).toString("utf8"),
                    }),
                );
            },
        );
        req.on("error", reject);
        req.setTimeout(60000, () => {
            req.destroy(new Error("timeout " + url));
        });
    });
}
