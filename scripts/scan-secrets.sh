#!/usr/bin/env bash
set -euo pipefail

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "Installing gitleaks locally..." >&2
  curl -sSfL https://raw.githubusercontent.com/gitleaks/gitleaks/master/install.sh | bash -s -- -b ./.bin
  PATH="$(pwd)/.bin:$PATH"
fi

echo "Running gitleaks with .gitleaks.toml..."
gitleaks detect --redact --source . --config .gitleaks.toml

