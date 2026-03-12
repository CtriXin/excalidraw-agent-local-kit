#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function resolveExcalidrawMcpRoot() {
  const distPath = process.env.EXCALIDRAW_MCP_DIST || path.join(process.env.HOME || "", "auto-skills", "excalidraw-mcp", "dist", "index.js");
  return path.dirname(path.dirname(distPath));
}

function usage() {
  console.error(
    [
      "usage:",
      "  node scripts/export_native_scene.js <input> [output]",
      "",
      "supported input formats:",
      "  - local skill scene: {\"elements\":[...]}",
      "  - raw MCP array: [...]",
      "  - native scene: {\"type\":\"excalidraw\",...}",
      "",
      "note:",
      "  - converting local/raw scenes uses Bun-backed Excalidraw conversion",
    ].join("\n"),
  );
}

function defaultOutputPath(inputPath) {
  if (inputPath.endsWith(".elements.json")) {
    return inputPath.slice(0, -".elements.json".length) + ".excalidraw";
  }
  if (inputPath.endsWith(".json")) {
    return inputPath.slice(0, -".json".length) + ".excalidraw";
  }
  return inputPath + ".excalidraw";
}

function main() {
  const [, , inputPath, outputArg] = process.argv;
  if (!inputPath) {
    usage();
    process.exit(1);
  }

  const absInput = path.resolve(inputPath);
  const absOutput = path.resolve(outputArg || defaultOutputPath(absInput));
  const parsed = JSON.parse(fs.readFileSync(absInput, "utf8"));
  const excalidrawMcpRoot = resolveExcalidrawMcpRoot();

  if (parsed && parsed.type === "excalidraw" && Array.isArray(parsed.elements)) {
    fs.writeFileSync(absOutput, JSON.stringify(parsed, null, 2) + "\n");
    console.log(
      JSON.stringify(
        {
          status: "ok",
          input: absInput,
          output: absOutput,
          inputFormat: "native_scene",
          totalCount: parsed.elements.length,
          exportedCount: parsed.elements.length,
          removedPseudoCount: 0,
        },
        null,
        2,
      ),
    );
    return;
  }

  const bun = spawnSync("bun", [path.join(__dirname, "export_native_scene_impl.mjs"), absInput, absOutput], {
    cwd: excalidrawMcpRoot,
    stdio: "inherit",
  });

  if (bun.error) {
    console.error(`export_native_scene failed: ${bun.error.message}`);
    process.exit(1);
  }
  process.exit(bun.status ?? 1);
}

try {
  main();
} catch (error) {
  console.error(`export_native_scene failed: ${error.message}`);
  process.exit(1);
}
