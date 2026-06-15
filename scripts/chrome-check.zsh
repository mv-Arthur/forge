#!/bin/zsh
set -euo pipefail

ROOT="${0:A:h:h}"
cd "$ROOT"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    echo "Usage: scripts/chrome-check.zsh [/route|url ...]"
    echo "Env: BASE_URL=http://127.0.0.1:3000 PORT=3000 WIDTH=1440 HEIGHT=1800 WAIT_MS=5000 MODE=screenshot|dom"
    exit 0
fi

BASE_URL="${BASE_URL:-http://127.0.0.1:${PORT:-3000}}"
OUT_DIR="${OUT_DIR:-$ROOT/.iron-solver/chrome-checks}"
WIDTH="${WIDTH:-1440}"
HEIGHT="${HEIGHT:-1800}"
WAIT_MS="${WAIT_MS:-5000}"
MODE="${MODE:-screenshot}"
CHROME_PROFILE="${CHROME_PROFILE:-/private/tmp/forge-chrome-profile}"

if [[ -n "${CHROME_BIN:-}" ]]; then
    chrome="$CHROME_BIN"
elif [[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]; then
    chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [[ -x "/Applications/Chromium.app/Contents/MacOS/Chromium" ]]; then
    chrome="/Applications/Chromium.app/Contents/MacOS/Chromium"
else
    echo "Chrome binary not found. Set CHROME_BIN=/path/to/chrome" >&2
    exit 1
fi

mkdir -p "$OUT_DIR" "$CHROME_PROFILE"

routes=("$@")
if (( ${#routes[@]} == 0 )); then
    routes=("/")
fi

stamp="$(date +%Y%m%d-%H%M%S)"

for route in "${routes[@]}"; do
    if [[ "$route" == http://* || "$route" == https://* ]]; then
        url="$route"
    else
        if [[ "$route" != /* ]]; then
            route="/$route"
        fi
        url="${BASE_URL}${route}"
    fi

    slug="${url//[^A-Za-z0-9._-]/-}"

    case "$MODE" in
        screenshot)
            file="$OUT_DIR/$stamp-$slug.png"
            "$chrome" \
                --headless=new \
                --disable-gpu \
                --hide-scrollbars \
                --no-first-run \
                --user-data-dir="$CHROME_PROFILE" \
                --window-size="${WIDTH},${HEIGHT}" \
                --virtual-time-budget="$WAIT_MS" \
                --screenshot="$file" \
                "$url" >/dev/null
            echo "$file"
            ;;
        dom)
            "$chrome" \
                --headless=new \
                --disable-gpu \
                --no-first-run \
                --user-data-dir="$CHROME_PROFILE" \
                --window-size="${WIDTH},${HEIGHT}" \
                --virtual-time-budget="$WAIT_MS" \
                --dump-dom \
                "$url"
            ;;
        *)
            echo "Unknown MODE: $MODE" >&2
            echo "Use MODE=screenshot or MODE=dom" >&2
            exit 2
            ;;
    esac
done
