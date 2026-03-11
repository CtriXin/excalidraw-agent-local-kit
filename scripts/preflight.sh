#!/usr/bin/env bash
set -euo pipefail

JSON=0
if [[ "${1:-}" == "--json" ]]; then
  JSON=1
fi

DIST_PATH="${EXCALIDRAW_MCP_DIST:-$HOME/auto-skills/excalidraw-mcp/dist/index.js}"
NODE_OK=0
DIST_OK=0

if command -v node >/dev/null 2>&1; then
  NODE_OK=1
fi

if [[ -f "${DIST_PATH}" ]]; then
  DIST_OK=1
fi

STATUS="missing"
EXIT_CODE=3
if [[ "${NODE_OK}" -eq 1 && "${DIST_OK}" -eq 1 ]]; then
  STATUS="ready"
  EXIT_CODE=0
elif [[ "${NODE_OK}" -eq 1 || "${DIST_OK}" -eq 1 ]]; then
  STATUS="partial"
  EXIT_CODE=2
fi

if [[ "${JSON}" -eq 1 ]]; then
  printf '{"status":"%s","node_ok":%s,"dist_ok":%s,"dist_path":"%s"}\n' \
    "${STATUS}" "${NODE_OK}" "${DIST_OK}" "${DIST_PATH}"
else
  printf 'status: %s\nnode_ok: %s\ndist_ok: %s\ndist_path: %s\n' \
    "${STATUS}" "${NODE_OK}" "${DIST_OK}" "${DIST_PATH}"
fi

exit "${EXIT_CODE}"

