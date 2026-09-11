#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.cursor/user-rule-templates"
DEST="${HOME}/.cursor/rules"

if [[ ! -d "$SRC" ]]; then
  echo "Missing templates directory: $SRC" >&2
  exit 1
fi

shopt -s nullglob
files=("$SRC"/*.mdc)
if [[ ${#files[@]} -eq 0 ]]; then
  echo "No .mdc templates in $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"
cp "${files[@]}" "$DEST/"

echo "Installed Cursor user rules to $DEST"
ls -1 "$DEST"/*.mdc
