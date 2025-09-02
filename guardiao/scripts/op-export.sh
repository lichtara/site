#!/usr/bin/env bash
set -euo pipefail

here_dir="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
app_dir="$(cd "${here_dir}/.." && pwd)"

from_file="${app_dir}/.env.op"
out_file="${app_dir}/.env"

usage() {
  cat <<EOF
Generate .env from 1Password references using 'op inject'.

Usage:
  $(basename "$0") [--from <.env.op>] [--out <.env>]

Notes:
  - Requires 1Password CLI ('op') and a valid OP_SERVICE_ACCOUNT_TOKEN (or signed-in session).
  - The input file should use {{op://...}} placeholders, like .env.op.example.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from) from_file="$2"; shift 2 ;;
    --out)  out_file="$2";  shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

if ! command -v op >/dev/null 2>&1; then
  echo "Error: 1Password CLI 'op' not found: https://developer.1password.com/docs/cli/get-started/" >&2
  exit 1
fi

if [[ ! -f "$from_file" ]]; then
  echo "Error: input file not found: $from_file" >&2
  echo "Tip: copy ${app_dir}/.env.op.example to ${app_dir}/.env.op and edit the op paths." >&2
  exit 1
fi

echo "Injecting secrets from $from_file → $out_file"
op inject -i "$from_file" -o "$out_file"
chmod 600 "$out_file" || true
echo "Done. Created $out_file"

