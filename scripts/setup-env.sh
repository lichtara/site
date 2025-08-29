#!/usr/bin/env bash
set -euo pipefail

# Simple helper to create/update .env with required secrets.
# Prompts securely (input hidden). Empty input keeps existing value/omits key.

here_dir="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
repo_root="$(cd "${here_dir}/.." && pwd)"
env_file="${repo_root}/.env"

mkdir -p "${repo_root}/scripts"

touch "${env_file}"
chmod 600 "${env_file}" 2>/dev/null || true

prompt_secret() {
  local var_name="$1"
  local prompt_text="$2"
  local value
  read -r -s -p "${prompt_text}: " value || true
  echo
  printf '%s' "$value"
}

upsert_env() {
  local key="$1"
  local value="$2"
  local file="$3"

  # If value is empty, do not write/replace
  if [ -z "$value" ]; then
    return 0
  fi

  # Remove existing lines for the key, then append new value
  if [ -f "$file" ]; then
    # Create temp without existing key lines
    awk -v k="${key}" -F'=' 'BEGIN{printed=0} $1!=k {print $0}' "$file" > "${file}.tmp"
    mv "${file}.tmp" "$file"
  fi
  # Write as KEY=VALUE (unquoted). These keys are alphanumeric-safe.
  printf '%s=%s\n' "$key" "$value" >> "$file"
}

echo "Configuring environment secrets in ${env_file}"
echo "(Press Enter to skip any you don't want to set now)"

gpat=$(prompt_secret GITHUB_PAT "Enter GITHUB_PAT (GitHub Personal Access Token)")
oai=$(prompt_secret OPENAI_API_KEY "Enter OPENAI_API_KEY (OpenAI API key)")
ghpages=$(prompt_secret GH_PAGES_PAT "Enter GH_PAGES_PAT (Token for Pages deploys)")

upsert_env GITHUB_PAT "$gpat" "$env_file"
upsert_env OPENAI_API_KEY "$oai" "$env_file"
upsert_env GH_PAGES_PAT "$ghpages" "$env_file"

chmod 600 "${env_file}" 2>/dev/null || true

# Ensure .env is gitignored
gi_file="${repo_root}/.gitignore"
if [ -f "$gi_file" ]; then
  if ! grep -qE '^\.env(\s|$)' "$gi_file"; then
    echo ".env" >> "$gi_file"
  fi
else
  echo ".env" > "$gi_file"
fi

echo
echo "Done. Secrets written to ${env_file} (chmod 600)."
echo "Load into current shell with:"
echo "  set -a; source .env; set +a"
echo
echo "Validation (expects 200/401; 200 means valid):"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: token \${GITHUB_PAT}\" https://api.github.com/user"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer \${OPENAI_API_KEY}\" https://api.openai.com/v1/models"

