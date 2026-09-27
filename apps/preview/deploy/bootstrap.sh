#!/bin/bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
    echo "run as root" >&2
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl nginx rsync xz-utils

if ! /usr/local/bin/node -v 2>/dev/null | grep -q '^v22\.'; then
    tmp=$(mktemp)
    curl -fsSL "https://nodejs.org/dist/v22.18.0/node-v22.18.0-linux-x64.tar.xz" -o "$tmp"
    tar -xJf "$tmp" -C /usr/local --strip-components=1
    rm -f "$tmp"
fi

install -d /opt/ncottage-preview
install -m 644 "$(dirname "$0")/ncottage-preview.service" /etc/systemd/system/ncottage-preview.service
install -m 644 "$(dirname "$0")/nginx-ncottage-preview.conf" /etc/nginx/sites-available/ncottage-preview
ln -sfn /etc/nginx/sites-available/ncottage-preview /etc/nginx/sites-enabled/ncottage-preview
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx
systemctl daemon-reload
systemctl enable ncottage-preview
if [ -f /opt/ncottage-preview/server.js ]; then
    systemctl restart ncottage-preview
fi
