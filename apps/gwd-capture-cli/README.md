# gwd-capture-cli

Съёмка [gwd.ru](https://www.gwd.ru/) через `website_screenshot_maker`. Конфиги: `config.json`, `matrix.json`. Выход: `.out/` в этом приложении.

```bash
cd apps/gwd-capture-cli
npm i
npx playwright install chromium
npm run capture
npm run atlas
npm run copy
```

`capture` - full-page PNG каждой URL. `atlas` - каталог шаблонов (path-pack) + представители + кропы; `atlas.json` в `.out/`. `copy` - текст представителей в `copy.json` (без PNG).

`.out/`: `manifest.json` и `pages/{deviceId}/*.png` (capture); `atlas.json` и `crops/` (atlas); `copy.json` (copy).
