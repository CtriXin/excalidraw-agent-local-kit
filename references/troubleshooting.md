# Troubleshooting

## Symptom: editor has text, share link loses text

This is the most important pitfall.

## Symptom: upload/open says invalid file

This usually means you uploaded the local `*.elements.json` truth-source file directly into excalidraw.com.

That file is for the MCP/local workflow, not for native browser import.

Use:

```bash
node scripts/export_native_scene.js path/to/scene.elements.json
```

Then upload the generated `.excalidraw` file instead.

If the file opens but text is missing or reduced to tiny marks, your export path likely wrapped the JSON without converting shorthand MCP text elements into native Excalidraw text elements. Use the helper above, which runs Excalidraw's own conversion step before writing the `.excalidraw` file.

### Wrong success criteria

- "the editor shows text"
- "the export tool returned success"
- "the diagram looked fine before sharing"

None of these are enough.

### Correct success criteria

The final **shared page** must visibly show the expected text.

## Safer practice

1. Keep a local `*.elements.json` scene as the truth source.
2. Use explicit `text` elements for titles, notes, and key labels.
3. Generate share links only when needed.
4. Open the final shared page and verify it.

## Local-first recommendation

Prefer this order:

1. local scene file
2. local Excalidraw MCP
3. optional online share link

## Remote-only fallback

If only browser automation is available:

1. patch the existing online diagram
2. recreate missing text as standalone text elements
3. re-export
4. verify the final share page
