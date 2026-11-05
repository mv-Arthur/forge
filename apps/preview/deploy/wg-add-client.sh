#!/bin/bash
set -euo pipefail

name=${1:?name}
if ! [[ "$name" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "name: letters, digits, dash, underscore" >&2
    exit 1
fi

umask 077
install -d /etc/wireguard/clients
if [ -f "/etc/wireguard/clients/${name}.conf" ]; then
    echo "client ${name} already exists" >&2
    exit 1
fi

next=2
while grep -q "10.10.0.${next}/32" /etc/wireguard/wg0.conf; do
    next=$((next + 1))
done
if [ "$next" -gt 250 ]; then
    echo "no free addresses" >&2
    exit 1
fi

priv=$(wg genkey)
pub=$(printf '%s\n' "$priv" | wg pubkey)
server_pub=$(cat /etc/wireguard/server.pub)

cat >> /etc/wireguard/wg0.conf << EOF

# ${name}
[Peer]
PublicKey = ${pub}
AllowedIPs = 10.10.0.${next}/32
EOF

cat > "/etc/wireguard/clients/${name}.conf" << EOF
[Interface]
Address = 10.10.0.${next}/24
PrivateKey = ${priv}

[Peer]
PublicKey = ${server_pub}
Endpoint = 83.222.24.12:51820
AllowedIPs = 10.10.0.0/24
PersistentKeepalive = 25
EOF
chmod 600 "/etc/wireguard/clients/${name}.conf"
wg syncconf wg0 <(wg-quick strip /etc/wireguard/wg0.conf)
echo "10.10.0.${next} /etc/wireguard/clients/${name}.conf"
