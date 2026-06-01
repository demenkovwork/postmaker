import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const WIDTH = 1080;
const HEIGHT = 1350;

interface ExportOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
}

/**
 * Render a node at its real 1080×1350 size into a PNG data URL.
 * The node is expected to already be mounted at full size (offscreen),
 * so we never scale it during capture — that keeps the output crisp.
 */
export async function nodeToPngDataUrl(
  node: HTMLElement,
  opts: ExportOptions = {}
): Promise<string> {
  // Make sure custom fonts are ready, otherwise the first export uses fallbacks.
  if (typeof document !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }

  const { width = WIDTH, height = HEIGHT, pixelRatio = 2 } = opts;

  return toPng(node, {
    width,
    height,
    pixelRatio,
    cacheBust: true,
    canvasWidth: width * pixelRatio,
    canvasHeight: height * pixelRatio,
    style: {
      // Neutralize any preview transform on the captured node.
      transform: "none",
      transformOrigin: "top left",
      margin: "0",
    },
  });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function downloadNodePng(
  node: HTMLElement,
  fileName: string,
  opts: ExportOptions = {}
): Promise<void> {
  const dataUrl = await nodeToPngDataUrl(node, opts);
  saveAs(dataUrl, fileName);
}

export interface ZipEntry {
  node: HTMLElement;
  name: string;
}

export async function downloadSlidesZip(
  entries: ZipEntry[],
  zipName: string,
  opts: ExportOptions = {}
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < entries.length; i += 1) {
    const { node, name } = entries[i];
    // Sequential capture avoids fighting over the same offscreen layout.
    // eslint-disable-next-line no-await-in-loop
    const dataUrl = await nodeToPngDataUrl(node, opts);
    zip.file(name, dataUrlToUint8Array(dataUrl));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
}
