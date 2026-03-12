---
name: excalidraw-agent-local-kit
version: "0.2.1"
description: "Local-first Excalidraw MCP workflow for Codex and Claude Code. Use local scene files as truth, prefer local MCP, and verify final share pages when exporting online links."
argument-hint: "diagram goal, existing scene path, or requested patch"
allowed-tools: Read, Write, Bash, Grep, Glob
---

# excalidraw-agent-local-kit

Use this skill when the task is about:

- creating or modifying Excalidraw diagrams through MCP
- keeping local `*.elements.json` files as the truth source
- continuing an existing diagram instead of rebuilding it
- debugging missing text in online share links
- preparing a browser playbook for online-only Claude usage

## Core Rules

1. Prefer **local scene files** over online share links.
2. Prefer **local Excalidraw MCP** over remote mode.
3. For critical labels, titles, notes, and instructions, use explicit `text` elements instead of relying only on shape labels.
4. If the user asks for an online share link, success means the **final share page** visibly contains the expected text.
5. If an existing scene file exists, patch it incrementally instead of redrawing the full diagram.
6. Do not treat a local `*.elements.json` file as a native excalidraw.com upload file. Export a `.excalidraw` scene first if the user needs browser upload/open.

## Suggested Workflow

### Local-first mode

1. Read the existing `*.elements.json` file if one already exists.
2. Patch or extend the scene locally.
3. Use local Excalidraw MCP to preview.
4. Save the updated scene file.

### Online-share mode

Only do this when the user explicitly wants a shareable online link.

1. Prepare the scene locally first.
2. If the user needs a file upload/open path, export a native `.excalidraw` file with `node scripts/export_native_scene.js <scene.elements.json>`.
3. Export or recreate it online.
4. Open the final share page.
5. Verify text is visible on the share page before claiming success.

## If Text Is Missing

Use `references/troubleshooting.md`.

Quick rule:

- editor visible is not enough
- export success is not enough
- final share page visibility is the real acceptance check

## Templates

Generic scene templates:

- `examples/local-scenes/branching_asset_pipeline.elements.json`
- `examples/local-scenes/independent_longform_flow.elements.json`

## Online Claude

If the agent cannot use local MCP and only has browser control, use:

- `prompts/online-claude-browser-playbook.md`
