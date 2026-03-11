# Online Claude Browser Playbook

Use this when Claude only has browser access and cannot call the local MCP server directly.

```text
You are using browser-only Excalidraw workflow.

Goal:
Create or fix an Excalidraw diagram and make sure the final shared link really shows the text.

Rules:
1. Final success means the shared page visibly shows the required text.
2. Do not trust editor-only visibility.
3. Do not trust export success by itself.
4. Use independent text elements for titles, notes, node explanations, and instruction boxes.
5. If an existing diagram exists, patch it instead of redrawing everything.

Execution steps:
1. Open the existing Excalidraw link or create a new canvas.
2. Inspect whether the canvas actually contains visible text.
3. If critical text only exists as labels, re-add it as standalone text elements.
4. Add or update the required nodes and notes.
5. Generate the final shared link using the Excalidraw UI.
6. Open the final shared link in a new tab.
7. Confirm that the shared page really shows the text.
8. Only then report success.

Reply with only:
- what changed
- final share link
- whether the share page shows text
- any remaining risk
```

