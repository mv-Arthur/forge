import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JobArchive } from "./job-archive.ts";
import { handleRequest } from "./handle-request.ts";
import { JobStore } from "./jobs.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../ui/dist");
const dataDir =
    process.env.JOBS_DIR ?? path.resolve(here, "../data/jobs");
const port = Number(process.env.PORT ?? 8787);
const jobs = new JobStore();
const archive = new JobArchive(dataDir);

const server = createServer((req, res) => {
    void handleRequest(req, res, { publicDir, jobs, archive }).catch(
        (error) => {
            if (!res.headersSent) {
                res.writeHead(500, {
                    "content-type": "application/json; charset=utf-8",
                });
            }
            res.end(
                JSON.stringify({
                    error: error instanceof Error ? error.message : String(error),
                })
            );
        }
    );
});

server.listen(port, () => {
    process.stderr.write(
        `district-orgs-web http://127.0.0.1:${port} (Telegram mini app)\n`
    );
});
