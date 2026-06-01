"use client";

import type { Slide } from "@/lib/types";
import CardSlide from "./CardSlide";
import CoverSlide from "./CoverSlide";

interface Props {
  slides: Slide[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddCard: () => void;
  onAddCover: () => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

const THUMB_W = 80;
const SCALE = THUMB_W / 1080;
const THUMB_H = Math.round(1350 * SCALE);

export default function SlideThumbnails({
  slides,
  selectedId,
  onSelect,
  onAddCard,
  onAddCover,
  onDelete,
  onMove,
}: Props) {
  return (
    <div className="flex items-stretch gap-3 overflow-x-auto p-3">
      {slides.map((slide, i) => {
        const active = slide.id === selectedId;
        return (
          <div key={slide.id} className="flex flex-shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => onSelect(slide.id)}
              className={`relative overflow-hidden rounded-md border-2 transition-colors ${
                active ? "border-brand" : "border-border hover:border-muted"
              }`}
              style={{ width: THUMB_W, height: THUMB_H }}
              title={`${slide.type} slide`}
            >
              <div
                style={{
                  width: 1080,
                  height: 1350,
                  transform: `scale(${SCALE})`,
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                {slide.type === "cover" ? (
                  <CoverSlide slide={slide} />
                ) : (
                  <CardSlide slide={slide} />
                )}
              </div>
              <span className="absolute left-0 top-0 bg-black/60 px-1 text-[9px] uppercase text-zinc-200">
                {i + 1} · {slide.type}
              </span>
            </button>
            <div className="flex items-center justify-between gap-0.5 text-[11px] text-muted">
              <button
                type="button"
                className="px-1 hover:text-subtle disabled:opacity-30"
                onClick={() => onMove(slide.id, -1)}
                disabled={i === 0}
                title="Move left"
              >
                ◀
              </button>
              <button
                type="button"
                className="px-1 hover:text-red-400 disabled:opacity-30"
                onClick={() => onDelete(slide.id)}
                disabled={slides.length <= 1}
                title="Delete slide"
              >
                ✕
              </button>
              <button
                type="button"
                className="px-1 hover:text-subtle disabled:opacity-30"
                onClick={() => onMove(slide.id, 1)}
                disabled={i === slides.length - 1}
                title="Move right"
              >
                ▶
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex flex-shrink-0 flex-col justify-center gap-2 pl-1">
        <button
          type="button"
          onClick={onAddCover}
          className="rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-subtle hover:border-brand hover:text-brand"
        >
          + Cover
        </button>
        <button
          type="button"
          onClick={onAddCard}
          className="rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-subtle hover:border-brand hover:text-brand"
        >
          + Card
        </button>
      </div>
    </div>
  );
}
