# excalidraw-agent-local-kit

Local-first Excalidraw MCP workflow kit for Codex and Claude Code, with scene-file editing and practical fixes for missing-text share links.

## What This Repo Is

This repo is a thin integration layer around the upstream `excalidraw/excalidraw-mcp` server.

It does **not** re-publish the upstream server code as a new product. Instead, it packages the parts that are usually missing in real usage:

- a local-first scene workflow
- a reusable agent skill
- local scene templates
- online Claude browser playbooks
- practical guidance for the "share link has no text" pitfall

## What Problem It Solves

Most Excalidraw MCP demos stop at "the tool connected". Real usage usually needs more:

- keep a **local scene file** as the source of truth
- let **Codex** and **Claude Code** use the same local MCP server
- avoid treating online share links as the source of truth
- debug cases where the editor shows text but the final share page loses it

## Requirements

| Tool | Required | Purpose |
|------|----------|---------|
| Node.js | yes | runs the local MCP server |
| Excalidraw MCP upstream | yes | actual diagram server |
| Codex or Claude Code | recommended | local MCP clients |
| Browser | optional | final share-link verification |

## Quick Start

### 1. Install upstream Excalidraw MCP

```bash
git clone https://github.com/excalidraw/excalidraw-mcp.git "$HOME/auto-skills/excalidraw-mcp"
cd "$HOME/auto-skills/excalidraw-mcp"
pnpm install
pnpm build
```

### 2. Configure Codex

Add this to `~/.codex/config.toml`:

```toml
[mcp_servers.excalidraw]
command = "node"
args = ["/Users/you/auto-skills/excalidraw-mcp/dist/index.js", "--stdio"]

[mcp_servers.excalidraw_remote]
url = "https://mcp.excalidraw.com"
```

Recommendation:

- use `excalidraw` as the local default
- keep `excalidraw_remote` only as a fallback

### 3. Configure Claude Code

Add the same local server to Claude Code:

```bash
claude mcp add excalidraw -- node "$HOME/auto-skills/excalidraw-mcp/dist/index.js" --stdio
claude mcp add excalidraw_remote https://mcp.excalidraw.com
```

### 4. Install this skill via symlink

```bash
./scripts/install_symlinks.sh
```

This will create:

- `~/.claude/skills/excalidraw-agent-local-kit`
- `~/.codex/skills/excalidraw-agent-local-kit`

Both symlinks will point to this repo.

## Workflow

Two modes, depending on what the user needs:

### Local-first mode (default)

1. Read or create a local `*.elements.json` scene file.
2. Patch or extend the elements array.
3. Save `*.elements.json` as the truth source.
4. Run `node scripts/export_native_scene.js <scene.elements.json>` to generate a native `.excalidraw` file.
5. User opens the `.excalidraw` file in excalidraw.com.

### Online-share mode

1. Complete local-first steps 1–4.
2. Call `mcp export_to_excalidraw` to upload and get a shareable link.
3. Verify text is visible on the final share page.

> See the workflow diagram: [`examples/local-scenes/v030_workflow_test.excalidraw`](examples/local-scenes/v030_workflow_test.excalidraw) — open it in excalidraw.com to view.

## File Formats

This kit intentionally uses a lightweight local scene format:

- local truth source: `*.elements.json`
- native Excalidraw import file: `*.excalidraw`

Important:

- `*.elements.json` is for the MCP/local workflow
- it is **not** the native file format that excalidraw.com accepts via upload/open
- if you upload a local `*.elements.json` file directly to excalidraw.com, Excalidraw will reject it as an invalid file

To generate a native `.excalidraw` file from a local scene:

```bash
node scripts/export_native_scene.js path/to/scene.elements.json
```

This writes `path/to/scene.excalidraw`, strips MCP-only pseudo-elements such as `cameraUpdate`, and converts shorthand MCP elements into native Excalidraw elements with proper text metrics.

The export helper uses Bun to run Excalidraw's browser-side conversion logic locally, so `bun` must be available on `PATH`.

## Share-Link Text Pitfall

The most common failure mode is:

- text appears in the editor
- the final share link opens without text

This kit uses a stricter rule:

- critical labels should be real `text` elements
- final success means **the share page** visibly contains text
- never stop at "export succeeded"

See:

- [`references/troubleshooting.md`](references/troubleshooting.md)
- [`prompts/online-claude-browser-playbook.md`](prompts/online-claude-browser-playbook.md)

## Scene Templates

Starter templates live in [`examples/local-scenes`](examples/local-scenes):

- `branching_asset_pipeline.elements.json`
- `independent_longform_flow.elements.json`

These are generic workflow examples with no business-specific content.

## File Structure

```text
excalidraw-agent-local-kit/
├── SKILL.md
├── README.md
├── CHANGELOG.md
├── docs/
│   └── v0.3.0-iteration-plan.md
├── scripts/
│   ├── export_native_scene.js
│   ├── export_native_scene_impl.mjs
│   ├── install_symlinks.sh
│   └── preflight.sh
├── prompts/
│   └── online-claude-browser-playbook.md
├── references/
│   ├── troubleshooting.md
│   └── upstream-attribution.md
└── examples/
    └── local-scenes/
        ├── README.md
        ├── branching_asset_pipeline.elements.json
        ├── independent_longform_flow.elements.json
        └── v030_workflow_test.excalidraw
```

## License

MIT

## Attribution

This repo depends on the upstream Excalidraw MCP project:

- <https://github.com/excalidraw/excalidraw-mcp>

The upstream server remains upstream work. This repo only open-sources the local workflow, scene-file practices, and agent-facing integration layer.
