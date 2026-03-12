import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const PSEUDO_TYPES = new Set(["cameraUpdate", "delete", "restoreCheckpoint"]);

class DummyElement {}

class DummyFontFace {
  constructor(family, source, descriptors) {
    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
  }

  load() {
    return Promise.resolve(this);
  }
}

function createMeasureContext() {
  return {
    font: "16px sans-serif",
    measureText(text) {
      const match = /(\d+(?:\.\d+)?)px/.exec(this.font);
      const fontSize = match ? Number(match[1]) : 16;
      let width = 0;
      for (const char of String(text)) {
        if (/\s/.test(char)) {
          width += fontSize * 0.35;
        } else if (/[\u2e80-\u9fff\uac00-\ud7af\uff00-\uffef]/u.test(char)) {
          width += fontSize;
        } else {
          width += fontSize * 0.55;
        }
      }
      return {
        width,
        actualBoundingBoxAscent: fontSize * 0.8,
        actualBoundingBoxDescent: fontSize * 0.2,
      };
    },
  };
}

function installBrowserShims() {
  globalThis.FontFace = DummyFontFace;
  globalThis.Element = DummyElement;
  globalThis.HTMLElement = DummyElement;
  globalThis.SVGElement = DummyElement;
  globalThis.Node = DummyElement;
  globalThis.devicePixelRatio = 1;
  globalThis.window = {
    location: { origin: "https://excalidraw.com" },
    navigator: { platform: "", userAgent: "" },
    devicePixelRatio: 1,
    matchMedia: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }),
  };
  globalThis.navigator = globalThis.window.navigator;
  globalThis.matchMedia = globalThis.window.matchMedia;
  globalThis.performance = { now: () => Date.now() };
  globalThis.document = {
    documentElement: {},
    body: {},
    fonts: {
      add() {},
      ready: Promise.resolve(),
    },
    createElement: () => ({
      style: {},
      getContext: () => createMeasureContext(),
    }),
  };
}

function normalizeRawInput(parsed) {
  const rawElements = Array.isArray(parsed) ? parsed : parsed?.elements;
  if (!Array.isArray(rawElements)) {
    throw new Error("unsupported input: expected an elements array or wrapper object");
  }

  const real = rawElements.filter((element) => !PSEUDO_TYPES.has(element?.type));
  const withDefaults = real.map((element) =>
    element?.label
      ? {
          ...element,
          label: {
            textAlign: "center",
            verticalAlign: "middle",
            ...element.label,
          },
        }
      : element,
  );

  return {
    inputFormat: Array.isArray(parsed) ? "raw_elements_array" : "local_elements_wrapper",
    totalCount: rawElements.length,
    removedPseudoCount: rawElements.length - real.length,
    withDefaults,
  };
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error("expected input and output paths");
  }

  installBrowserShims();

  const parsed = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const { inputFormat, totalCount, removedPseudoCount, withDefaults } = normalizeRawInput(parsed);

  const excalidrawEntry = path.join(
    process.cwd(),
    "node_modules",
    "@excalidraw",
    "excalidraw",
    "dist",
    "prod",
    "index.js",
  );
  const { convertToExcalidrawElements, FONT_FAMILY, serializeAsJSON } = await import(
    pathToFileURL(excalidrawEntry).href
  );
  const converted = convertToExcalidrawElements(withDefaults, { regenerateIds: false }).map((element) =>
    element.type === "text" ? { ...element, fontFamily: FONT_FAMILY.Excalifont ?? 1 } : element,
  );

  const nativeJson = serializeAsJSON(
    converted,
    { viewBackgroundColor: "transparent", exportBackground: false },
    null,
    "local",
  );

  fs.writeFileSync(outputPath, nativeJson + "\n");

  console.log(
    JSON.stringify(
      {
        status: "ok",
        input: path.resolve(inputPath),
        output: path.resolve(outputPath),
        inputFormat,
        totalCount,
        exportedCount: converted.length,
        removedPseudoCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(`export_native_scene_impl failed: ${error.message}`);
  process.exit(1);
});
