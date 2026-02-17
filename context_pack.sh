#!/usr/bin/env bash
set -euo pipefail

# context_pack.sh
# Create a minimal documentation bundle for handing off to a new chat.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="${REPO_ROOT}/docs"
OUT_DIR="${REPO_ROOT}/context_packs"
TS="$(date +%Y%m%d-%H%M%S)"
OUT_TAR="${OUT_DIR}/heypage_context_pack_${TS}.tar.gz"

# Minimal doc set for continuity
FILES=(
  "README.md"
  "docs/DOCUMENTATION_MAP.md"
  "docs/CANONICAL_PATHS.md"
  "docs/OPERATIONS.md"
  "docs/ARCHITECTURE_SNAPSHOT.md"
  "docs/NEXT_STEPS.md"
)

cd "$REPO_ROOT"
mkdir -p "$OUT_DIR"

missing=0
for f in "${FILES[@]}"; do
  if [[ ! -f "$REPO_ROOT/$f" ]]; then
    echo "MISSING: $f"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  echo
  echo "One or more required files are missing. Aborting."
  echo "Expected:"
  printf '  - %s\n' "${FILES[@]}"
  exit 1
fi

# Build archive with stable relative paths
tar -czf "$OUT_TAR" "${FILES[@]}"

echo "Wrote: $OUT_TAR"
echo
echo "Contents:"
tar -tzf "$OUT_TAR"
