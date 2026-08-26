import http from "node:http";

export type TestRoute = {
    status?: number;
    type?: string;
    body?: string;
    location?: string;
    drop?: boolean;
};

export async function startTestServer(
    routes: Record<string, TestRoute>,
): Promise<{ origin: URL; close: () => Promise<void> }> {
    const server = http.createServer((req, res) => {
        const url = (req.url ?? "/").split("?")[0] || "/";
        const route = routes[url];
        if (!route) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("not found");
            return;
        }
        if (route.drop) {
            req.socket.destroy();
            return;
        }
        if (route.location) {
            res.writeHead(route.status ?? 302, { Location: route.location });
            res.end();
            return;
        }
        res.writeHead(route.status ?? 200, {
            "Content-Type": route.type ?? "text/html; charset=utf-8",
        });
        res.end(route.body ?? "");
    });
    await new Promise<void>((resolve) => {
        server.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("no address");
    return {
        origin: new URL(`http://127.0.0.1:${addr.port}/`),
        close: () =>
            new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            }),
    };
}
