"use client";

import { useCallback, useRef, useState } from "react";
import type { CardSlide, CoverSlide, Slide } from "@/lib/types";
import { BADGE_PRESETS } from "@/lib/presets";

interface Props {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  slide: Slide;
  onChange: (patch: Partial<CardSlide> & Partial<CoverSlide>) => void;
}

const labelCls =
  "block text-[12px] uppercase tracking-[0.05em] text-subtle mt-4 mb-1.5";
const inputCls =
  "w-full rounded-[10px] border border-border bg-card px-3 py-[11px] font-mono text-[14px] text-zinc-50 outline-none focus:border-brand";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ControlPanel({
  projectName,
  onProjectNameChange,
  slide,
  onChange,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      const dataUrl = await fileToDataUrl(file);
      onChange({ screenshot: dataUrl });
    },
    [onChange]
  );

  return (
    <div>
      <h1 className="font-display text-[20px] font-bold">compeye studio</h1>
      <div className="mb-6 text-[13px] text-muted">
        card &amp; cover builder · 1080×1350
      </div>

      <label className={labelCls}>Project name</label>
      <input
        className={inputCls}
        value={projectName}
        onChange={(e) => onProjectNameChange(e.target.value)}
        placeholder="Untitled carousel"
      />

      <div className="mt-5 mb-1 text-[12px] uppercase tracking-[0.05em] text-subtle">
        Editing: {slide.type === "cover" ? "Cover" : "Card"} slide
      </div>

      {slide.type === "card" ? (
        <CardFields
          slide={slide}
          onChange={onChange}
          dragOver={dragOver}
          setDragOver={setDragOver}
          fileInputRef={fileInputRef}
          handleFile={handleFile}
        />
      ) : (
        <CoverFields slide={slide} onChange={onChange} />
      )}
    </div>
  );
}

function CardFields({
  slide,
  onChange,
  dragOver,
  setDragOver,
  fileInputRef,
  handleFile,
}: {
  slide: CardSlide;
  onChange: Props["onChange"];
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFile: (file: File | undefined | null) => void;
}) {
  const isPreset = BADGE_PRESETS.includes(slide.badge);

  return (
    <>
      <label className={labelCls}>Badge preset</label>
      <select
        className={inputCls}
        value={isPreset ? slide.badge : "__custom"}
        onChange={(e) => {
          if (e.target.value !== "__custom") onChange({ badge: e.target.value });
        }}
      >
        {BADGE_PRESETS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
        <option value="__custom">✏️ Custom…</option>
      </select>

      <label className={labelCls}>Badge text</label>
      <input
        className={inputCls}
        value={slide.badge}
        onChange={(e) => onChange({ badge: e.target.value })}
      />

      <label className={labelCls}>Link / headline (accent color)</label>
      <input
        className={inputCls}
        value={slide.link}
        onChange={(e) => onChange({ link: e.target.value })}
      />

      <label className={labelCls}>Description</label>
      <textarea
        className={`${inputCls} min-h-[110px] leading-[1.5] resize-y`}
        value={slide.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />

      <label className={labelCls}>Footer right text</label>
      <input
        className={inputCls}
        value={slide.footerRight}
        onChange={(e) => onChange({ footerRight: e.target.value })}
      />

      <div className="flex gap-2.5">
        <div className="flex-1">
          <label className={labelCls}>Accent color</label>
          <input
            type="color"
            className={`${inputCls} h-11 p-1`}
            value={slide.accent}
            onChange={(e) => onChange({ accent: e.target.value })}
          />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Brand handle</label>
          <input
            className={inputCls}
            value={slide.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
          />
        </div>
      </div>

      <label className={labelCls}>Screenshot</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer items-center justify-center rounded-[10px] border border-dashed px-3 py-6 text-center text-[13px] transition-colors ${
          dragOver
            ? "border-brand bg-brand/10 text-brand"
            : "border-border bg-card text-muted"
        }`}
      >
        {slide.screenshot
          ? "Screenshot loaded — click or drop to replace"
          : "Click to upload or drag & drop a competitor screenshot"}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {slide.screenshot && (
        <button
          type="button"
          className="mt-2 text-[12px] text-muted underline hover:text-subtle"
          onClick={() => onChange({ screenshot: null })}
        >
          Remove screenshot
        </button>
      )}
    </>
  );
}

function CoverFields({
  slide,
  onChange,
}: {
  slide: CoverSlide;
  onChange: Props["onChange"];
}) {
  return (
    <>
      <label className={labelCls}>Title (use * around words to highlight)</label>
      <textarea
        className={`${inputCls} min-h-[110px] leading-[1.5] resize-y`}
        value={slide.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />

      <label className={labelCls}>Subtitle</label>
      <textarea
        className={`${inputCls} min-h-[90px] leading-[1.5] resize-y`}
        value={slide.subtitle}
        onChange={(e) => onChange({ subtitle: e.target.value })}
      />

      <label className={labelCls}>Bottom tag (defaults to brand handle)</label>
      <input
        className={inputCls}
        value={slide.bottomTag}
        onChange={(e) => onChange({ bottomTag: e.target.value })}
        placeholder={slide.brand}
      />

      <label className={labelCls}>Brand handle</label>
      <input
        className={inputCls}
        value={slide.brand}
        onChange={(e) => onChange({ brand: e.target.value })}
      />
    </>
  );
}
