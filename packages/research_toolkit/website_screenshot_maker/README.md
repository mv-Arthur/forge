# website_screenshot_maker

SDK: съёмка full-page PNG HTML-страниц сайта (sitemap-индекс ∪ BFS crawl same-origin href от home).

Потребитель — CLI в `apps/preview/research`.

## API

```ts
import { capture, loadConfig, loadMatrix } from "website_screenshot_maker";

const matrix = loadMatrix("./matrix.json");
await capture(loadConfig("./config.json", matrix));
```

| Экспорт | Роль |
|---|---|
| `capture(config)` | прогон съёмки |
| `loadConfig(path, matrix)` | JSON-файл → `CaptureConfig` |
| `parseConfigFile(raw, baseDir, matrix)` | объект JSON → `CaptureConfig` |
| `loadMatrix(path)` / `parseMatrix(raw)` | JSON матрицы → `Device[]` |
| `resolveDevice(id, matrix)` | id пресета → `Device` |
| `CaptureConfig`, `ConfigFile`, `Device` | типы |

`devices` в JSON — только id из матрицы, которую передаёт потребитель.

Выход по умолчанию — `.out` рядом с конфигом: `manifest.json` и `pages/{deviceId}/*.png`.

## atlas()

Второй вход: кластеризация URL по path-pack, съёмка представителей (`inspectOne` — occupancy visible DOM + кропы состояний в одной сессии), каталог `atlas.json`.

```ts
import { atlas, loadConfig, loadMatrix } from "website_screenshot_maker";

await atlas(loadConfig("./config.json", loadMatrix("./matrix.json")), {
    pack: { exactPaths: ["/"], includePathPrefixes: ["/catalog"] },
});
```

`inspectOne` — sibling `captureOne`, тот же goto/cookies/scroll, затем occupancy и crops, потом close. `capture()` не меняется.

Labeler — порт `(input) => labels`. По умолчанию `heuristicLabeler`. Без ключа LLM `atlas()` пишет `labelSource: "heuristic"`. CLI: `npx tsx src/cli.ts atlas`; опционально `ATLAS_LABEL_URL` (HTTP POST).

GWD pack живёт в `apps/preview/research/packs/`, не в `src/core`.

## copy()

Третий вход: те же URL/кластера, что atlas, без PNG. Пишет `copy.json` — блоки текста с `role` / `slot` / `selector`.

```ts
import { copy, loadConfig, loadMatrix } from "website_screenshot_maker";

await copy(loadConfig("./config.json", loadMatrix("./matrix.json")), {
    allow: { exactPaths: ["/"], includePathPrefixes: ["/catalog"] },
});
```

CLI: `npx tsx src/cli.ts copy`.

