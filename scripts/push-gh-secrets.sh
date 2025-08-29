#!/usr/bin/env bash
set -euo pipefail

here_dir="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
repo_root="$(cd "${here_dir}/.." && pwd)"
cd "$repo_root"

env_file=".env"
scope_repo=""
scope_org=""
scope_env=""
visibility=""
selected_repos=""
app="actions"
dry_run=0
keys_csv=""

all_keys=(
  GITHUB_PAT
  GHP_CLASSIC
  GH_PAGES_PAT
  API_OPENAI
  APIOPENAI
  OPENAI_API_KEY
  API_OPENAI_SERV
  API_OPEN_CODEX
  API_OPEN_CODEX_SERV
  API_GIT_CODEX
)

usage() {
  cat <<EOF
Sync .env variables to GitHub Secrets via gh CLI

Usage:
  $(basename "$0") [options]

Options:
  --from-file <path>       Path to .env file (default: ./.env)
  --repo <owner/name>      Target repository (auto-detected from git remote)
  --org <org>              Use organization-level secrets (requires --visibility)
  --env <name>             Use repository environment secrets (requires repo scope)
  --visibility <v>         Org secrets visibility: all|private|selected
  --repos <list>           With visibility=selected, comma-separated repos (org/name)
  --app <app>              Secret app: actions|dependabot|codespaces (default: actions)
  --keys <k1,k2,...>       Only push the listed keys; defaults to all known
  --dry-run                Print what would be set, do not call gh
  -h, --help               Show this help

Examples:
  $(basename "$0") --dry-run
  $(basename "$0") --repo myorg/site --env production
  $(basename "$0") --org myorg --visibility private --keys GITHUB_PAT,API_OPENAI
  $(basename "$0") --org myorg --visibility selected --repos myorg/site,myorg/app
EOF
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --from-file)
        env_file="$2"; shift 2 ;;
      --repo)
        scope_repo="$2"; shift 2 ;;
      --org)
        scope_org="$2"; shift 2 ;;
      --env|--env-name)
        scope_env="$2"; shift 2 ;;
      --visibility)
        visibility="$2"; shift 2 ;;
      --repos)
        selected_repos="$2"; shift 2 ;;
      --app)
        app="$2"; shift 2 ;;
      --keys)
        keys_csv="$2"; shift 2 ;;
      --dry-run)
        dry_run=1; shift ;;
      -h|--help)
        usage; exit 0 ;;
      *)
        echo "Unknown option: $1" >&2
        usage; exit 1 ;;
    esac
  done
}

require_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "Error: GitHub CLI 'gh' not found. Install: https://cli.github.com/" >&2
    exit 1
  fi
}

detect_repo() {
  if [[ -n "$scope_repo" ]]; then
    return 0
  fi
  local url
  url=$(git remote get-url origin 2>/dev/null || true)
  if [[ -z "$url" ]]; then
    return 0
  fi
  # git@github.com:owner/repo.git
  if [[ "$url" =~ ^git@github.com:([^/]+)/([^\.]+)(\.git)?$ ]]; then
    scope_repo="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return 0
  fi
  # https://github.com/owner/repo(.git)
  if [[ "$url" =~ ^https?://github.com/([^/]+)/([^\.]+)(\.git)?$ ]]; then
    scope_repo="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return 0
  fi
}

load_env_values() {
  if [[ ! -f "$env_file" ]]; then
    echo "Error: .env file not found at: $env_file" >&2
    exit 1
  fi
  declare -gA VALS=()
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip comments and empty
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line//[[:space:]]/}" ]] && continue
    # Strip optional 'export '
    line="${line#export }"
    if [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=(.*)$ ]]; then
      local name="${BASH_REMATCH[1]}"
      local value="${BASH_REMATCH[2]}"
      # Trim surrounding whitespace
      value="${value#${value%%[![:space:]]*}}"
      value="${value%${value##*[![:space:]]}}"
      # Remove surrounding quotes if both ends match
      if { [[ "$value" == \"*\" && "$value" == *\" ]]; } || { [[ "$value" == \'*\' && "$value" == *\' ]]; }; then
        value="${value:1:${#value}-2}"
      fi
      VALS["$name"]="$value"
    fi
  done < "$env_file"
}

set_secret() {
  local name="$1"; shift
  local value="$1"; shift

  # Skip empty values
  if [[ -z "$value" ]]; then
    return 0
  fi

  local cmd=(gh secret set "$name")

  if [[ -n "$scope_org" ]]; then
    cmd+=(--org "$scope_org")
    if [[ -n "$visibility" ]]; then
      cmd+=(--visibility "$visibility")
      if [[ "$visibility" == "selected" && -n "$selected_repos" ]]; then
        cmd+=(--repos "$selected_repos")
      fi
    else
      cmd+=(--visibility private)
    fi
  else
    # Repo-level (default) and environment
    if [[ -n "$scope_env" ]]; then
      cmd+=(--env "$scope_env")
    fi
    if [[ -n "$scope_repo" ]]; then
      cmd+=(--repo "$scope_repo")
    fi
  fi

  if [[ -n "$app" ]]; then
    cmd+=(--app "$app")
  fi

  if (( dry_run )); then
    echo "[dry-run] ${cmd[*]}  # value from $env_file ($name)"
  else
    printf '%s' "$value" | "${cmd[@]}"
  fi
}

main() {
  parse_args "$@"
  require_gh
  detect_repo || true
  load_env_values

  # Determine which keys to use
  local keys_to_use=()
  if [[ -n "$keys_csv" ]]; then
    IFS=',' read -r -a keys_to_use <<< "$keys_csv"
  else
    keys_to_use=("${all_keys[@]}")
  fi

  # Count not-empty
  local found_any=0
  for k in "${keys_to_use[@]}"; do
    local v="${VALS[$k]:-}"
    if [[ -n "$v" ]]; then
      found_any=1; break
    fi
  done
  if (( ! found_any )); then
    echo "No non-empty keys found in $env_file for: ${keys_to_use[*]}" >&2
    exit 2
  fi

  echo "Pushing secrets via gh (${app}), source: $env_file"
  if [[ -n "$scope_org" ]]; then
    echo "Scope: org=$scope_org visibility=${visibility:-private} ${selected_repos:+(repos: $selected_repos)}"
  else
    echo "Scope: repo=${scope_repo:-current} ${scope_env:+env=$scope_env}"
  fi

  for k in "${keys_to_use[@]}"; do
    local v="${VALS[$k]:-}"
    if [[ -n "$v" ]]; then
      echo "Setting secret: $k"
      set_secret "$k" "$v"
    else
      echo "Skipping empty: $k"
    fi
  done

  echo "Done."
}

main "$@"

