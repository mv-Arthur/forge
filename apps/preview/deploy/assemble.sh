#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

server=$(find .next/standalone -path '*/node_modules' -prune -o -name server.js -print -quit)
if [ -z "$server" ]; then
    echo "standalone server.js not found" >&2
    exit 1
fi

app=$(dirname "$server")
rm -rf "$app/.next/static" "$app/public"
mkdir -p "$app/.next"
cp -a .next/static "$app/.next/static"
if [ -d public ]; then
    cp -a public "$app/public"
fi

echo "$app"
