"use client";

import { useState } from "react";
import type { Slide } from "@/lib/types";
import { downloadNodePng, downloadSlidesZip } from "@/lib/export";

interface Props {
  slides: Slide[];
  selectedId: string;
  projectName: string;
  getNode: (id: string) => HTMLElement | null;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "carousel"
  );
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function ExportButtons({
  slides,
  selectedId,
  projectName,
  getNode,
}: Props) {
  const [busy, setBusy] = useState<"png" | "zip" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(projectName);

  async function handleCurrent() {
    setError(null);
    const node = getNode(selectedId);
    if (!node) {
      setError("Selected slide is not ready yet.");
      return;
    }
    const idx = slides.findIndex((s) => s.id === selectedId);
    const slide = slides[idx];
    setBusy("png");
    try {
      await downloadNodePng(
        node,
        `${slug}_${pad(idx + 1)}_${slide.type}.png`
      );
    } catch (e) {
      setError("Export failed. Check the console for details.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function handleZip() {
    setError(null);
    const entries = slides
      .map((slide, i) => {
        const node = getNode(slide.id);
        return node
          ? { node, name: `${pad(i + 1)}_${slide.type}.png` }
          : null;
      })
      .filter((e): e is { node: HTMLElement; name: string } => e !== null);

    if (entries.length === 0) {
      setError("No slides are ready to export.");
      return;
    }
    setBusy("zip");
    try {
      await downloadSlidesZip(entries, `${slug}.zip`);
    } catch (e) {
      setError("Zip export failed. Check the console for details.");
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCurrent}
        disabled={busy !== null}
        className="w-full rounded-xl bg-brand px-4 py-3.5 font-display text-[15px] font-bold text-[#1a1206] transition hover:brightness-110 disabled:opacity-60"
      >
        {busy === "png" ? "Rendering…" : "⬇ Download current PNG"}
      </button>
      <button
        type="button"
        onClick={handleZip}
        disabled={busy !== null}
        className="w-full rounded-xl border border-brand px-4 py-3.5 font-display text-[15px] font-bold text-brand transition hover:bg-brand/10 disabled:opacity-60"
      >
        {busy === "zip"
          ? "Zipping…"
          : `⬇ Download all (${slides.length}) as .zip`}
      </button>
      <div className="text-[11px] leading-relaxed text-zinc-600">
        Exports at 2× → 2160×2700 each. Fonts are bundled, so output stays crisp
        offline.
      </div>
      {error && <div className="text-[12px] text-red-400">{error}</div>}
    </div>
  );
}
