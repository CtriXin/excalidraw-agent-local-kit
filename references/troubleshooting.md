# Troubleshooting

## Symptom: editor has text, share link loses text

This is the most important pitfall.

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

