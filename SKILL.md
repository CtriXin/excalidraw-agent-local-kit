---
name: excalidraw-agent-local-kit
version: "0.3.0"
description: "Local-first Excalidraw MCP workflow for Codex and Claude Code. Use local scene files as truth, prefer local MCP, and verify final share pages when exporting online links."
argument-hint: "diagram goal, existing scene path, or requested patch"
allowed-tools: Read, Write, Bash, Grep, Glob, mcp__excalidraw__read_me, mcp__excalidraw__create_view, mcp__excalidraw__export_to_excalidraw, mcp__excalidraw__save_checkpoint, mcp__excalidraw__read_checkpoint
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

## Layout Defaults (CRITICAL)

元素间距和尺寸的最小规范，防止文字挤在一起或被截断：

- **同层节点横向间距**：≥ 80px（同一行的并列块之间）
- **层间纵向间距**：≥ 100px（上下层级之间）
- **矩形最小尺寸**：240×80（确保 label 不被截断）
- **菱形最小尺寸**：160×120
- **描述文字与所属块间距**：≥ 20px
- **箭头最短长度**：≥ 80px（太短会导致 label 溢出）
- **标题与第一行元素间距**：≥ 60px
- **整体画布留白**：四周至少 40px padding

宁可图大一点，也不要让文字挤在一起。

## Intent Detection

- 用户说"画个图" / "帮我做个流程图" / "导出" → Local-first mode
- 用户说"分享链接" / "发给别人" → Online-share mode
- 默认 → Local-first mode

## Suggested Workflow

### Local-first mode（默认）

1. 读取已有 `*.elements.json`（如存在），patch 而非重建。
2. 生成或 patch 元素数组，**严格遵守 Layout Defaults 间距规范**。
3. 保存 `*.elements.json` 作为 truth source。
4. 运行 `node scripts/export_native_scene.js <scene.elements.json>` 生成 `.excalidraw` 文件。
5. 告知用户 `.excalidraw` 文件路径，可在 excalidraw.com 直接打开。
6. （可选）如客户端支持 GUI 渲染，调用 `mcp__excalidraw__create_view` 预览。

### Online-share mode

用户需要分享链接时：

1. 完成 local-first mode 步骤 1-4。
2. 调用 `mcp__excalidraw__export_to_excalidraw` 获取链接。
3. 验证分享页面文本可见。

## MCP Fallback

- 优先用本地 MCP (`mcp__excalidraw__`)。
- 本地不可用时，尝试远程 MCP (`mcp__excalidraw_remote__`)。
- 都不可用时，走 `Bash` 调用 `node scripts/export_native_scene.js` 生成 `.excalidraw` 文件。

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
