#!/usr/bin/env bash
set -euo pipefail

# Helper to create/update .env with required secrets.
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
    awk -v k="${key}" -F'=' '$1!=k {print $0}' "$file" > "${file}.tmp"
    mv "${file}.tmp" "$file"
  fi
  printf '%s=%s\n' "$key" "$value" >> "$file"
}

echo "Configuring environment secrets in ${env_file}"
echo "(Press Enter to skip any you don't want to set now)"

# GitHub tokens
gpat=$(prompt_secret GITHUB_PAT "Enter GITHUB_PAT (GitHub Personal Access Token)")
ghp_classic=$(prompt_secret GHP_CLASSIC "Enter GHP_CLASSIC (Classic GitHub token, optional)")
ghpages=$(prompt_secret GH_PAGES_PAT "Enter GH_PAGES_PAT (Token for Pages deploys)")

# OpenAI and related
api_openai=$(prompt_secret API_OPENAI "Enter API_OPENAI (OpenAI API key)")
api_openai_serv=$(prompt_secret API_OPENAI_SERV "Enter API_OPENAI_SERV (OpenAI API base URL, e.g. https://api.openai.com/v1)")
apiopenai=$(prompt_secret APIOPENAI "Enter APIOPENAI (alias; usually same as API_OPENAI)")

# Custom services (if applicable)
api_open_codex=$(prompt_secret API_OPEN_CODEX "Enter API_OPEN_CODEX (Open Codex API key, if used)")
api_open_codex_serv=$(prompt_secret API_OPEN_CODEX_SERV "Enter API_OPEN_CODEX_SERV (Open Codex base URL)")
api_git_codex=$(prompt_secret API_GIT_CODEX "Enter API_GIT_CODEX (Git Codex API key, if used)")

# Write values
upsert_env GITHUB_PAT "$gpat" "$env_file"
upsert_env GHP_CLASSIC "$ghp_classic" "$env_file"
upsert_env GH_PAGES_PAT "$ghpages" "$env_file"

upsert_env API_OPENAI "$api_openai" "$env_file"
upsert_env API_OPENAI_SERV "$api_openai_serv" "$env_file"
upsert_env APIOPENAI "$apiopenai" "$env_file"

# Keep a compatibility alias for tools expecting OPENAI_API_KEY
if [ -n "$api_openai" ]; then
  upsert_env OPENAI_API_KEY "$api_openai" "$env_file"
fi

upsert_env API_OPEN_CODEX "$api_open_codex" "$env_file"
upsert_env API_OPEN_CODEX_SERV "$api_open_codex_serv" "$env_file"
upsert_env API_GIT_CODEX "$api_git_codex" "$env_file"

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
echo "  # GitHub (GITHUB_PAT)"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: token \${GITHUB_PAT}\" https://api.github.com/user"
echo "  # GitHub (GHP_CLASSIC)"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: token \${GHP_CLASSIC}\" https://api.github.com/user"
echo "  # OpenAI (API_OPENAI + optional API_OPENAI_SERV)"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer \${API_OPENAI}\" \"\${API_OPENAI_SERV:-https://api.openai.com/v1}/models\""
echo "  # Open Codex (adjust endpoint path if needed)"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer \${API_OPEN_CODEX}\" \"\${API_OPEN_CODEX_SERV}\" || true"
echo "  # Git Codex (adjust endpoint path if needed)"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -H \"Authorization: Bearer \${API_GIT_CODEX}\" \"\${API_OPEN_CODEX_SERV}\" || true"
