#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_TARGET="${HOME}/.claude/skills/excalidraw-agent-local-kit"
CODEX_TARGET="${HOME}/.codex/skills/excalidraw-agent-local-kit"

mkdir -p "${HOME}/.claude/skills" "${HOME}/.codex/skills"
rm -rf "${CLAUDE_TARGET}" "${CODEX_TARGET}"
ln -s "${REPO_ROOT}" "${CLAUDE_TARGET}"
ln -s "${REPO_ROOT}" "${CODEX_TARGET}"

printf 'linked:\n- %s -> %s\n- %s -> %s\n' "${CLAUDE_TARGET}" "${REPO_ROOT}" "${CODEX_TARGET}" "${REPO_ROOT}"

