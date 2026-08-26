# preview/research

CLI над SDK `website_screenshot_maker`. Конфиги здесь: `config.json` и `matrix.json`.

```bash
cd apps/preview/research
npm i
npx playwright install chromium
npm run capture
npm run atlas
npm run copy
```

`capture` — full-page PNG каждой URL. `atlas` — каталог шаблонов (path-pack) + представители + кропы; `atlas.json` в `.out/`. `copy` — текст представителей в `copy.json` (без PNG).

Пишет в `.out/`: `manifest.json` и `pages/{deviceId}/*.png` (capture); `atlas.json` и `crops/` (atlas); `copy.json` (copy).
