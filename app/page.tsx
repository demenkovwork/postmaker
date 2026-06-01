"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CardSlide as CardSlideData, CoverSlide as CoverSlideData, Project, Slide } from "@/lib/types";
import {
  createCardSlide,
  createCoverSlide,
  createDefaultProject,
} from "@/lib/presets";
import ControlPanel from "@/components/ControlPanel";
import CardSlide from "@/components/CardSlide";
import CoverSlide from "@/components/CoverSlide";
import SlideThumbnails from "@/components/SlideThumbnails";
import ExportButtons from "@/components/ExportButtons";

const STORAGE_KEY = "compeye-studio-project";

export default function Home() {
  const [project, setProject] = useState<Project>(() => createDefaultProject());
  const [selectedId, setSelectedId] = useState<string>(
    () => project.slides[0]?.id ?? ""
  );
  const [hydrated, setHydrated] = useState(false);

  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load saved draft (real app on Vercel only; harmless if absent).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Project;
        if (parsed?.slides?.length) {
          setProject(parsed);
          setSelectedId(parsed.slides[0].id);
        }
      }
    } catch {
      /* ignore corrupt drafts */
    }
    setHydrated(true);
  }, []);

  // Persist draft.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      /* quota or private mode — non-fatal */
    }
  }, [project, hydrated]);

  const selectedSlide =
    project.slides.find((s) => s.id === selectedId) ?? project.slides[0];

  const updateSlide = useCallback(
    (patch: Partial<CardSlideData> & Partial<CoverSlideData>) => {
      setProject((prev) => ({
        ...prev,
        slides: prev.slides.map((s) =>
          s.id === selectedId ? ({ ...s, ...patch } as Slide) : s
        ),
      }));
    },
    [selectedId]
  );

  const addSlide = useCallback((slide: Slide) => {
    setProject((prev) => ({ ...prev, slides: [...prev.slides, slide] }));
    setSelectedId(slide.id);
  }, []);

  const deleteSlide = useCallback(
    (id: string) => {
      setProject((prev) => {
        if (prev.slides.length <= 1) return prev;
        const slides = prev.slides.filter((s) => s.id !== id);
        if (id === selectedId) {
          setSelectedId(slides[0].id);
        }
        return { ...prev, slides };
      });
    },
    [selectedId]
  );

  const moveSlide = useCallback((id: string, dir: -1 | 1) => {
    setProject((prev) => {
      const idx = prev.slides.findIndex((s) => s.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.slides.length) return prev;
      const slides = [...prev.slides];
      [slides[idx], slides[next]] = [slides[next], slides[idx]];
      return { ...prev, slides };
    });
  }, []);

  if (!selectedSlide) return null;

  return (
    <main className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      {/* Control column */}
      <section className="flex w-full flex-col border-b border-border lg:h-screen lg:w-[420px] lg:flex-shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex-1 overflow-y-auto p-7">
          <ControlPanel
            projectName={project.name}
            onProjectNameChange={(name) =>
              setProject((prev) => ({ ...prev, name }))
            }
            slide={selectedSlide}
            onChange={updateSlide}
          />
          <div className="mt-7">
            <ExportButtons
              slides={project.slides}
              selectedId={selectedId}
              projectName={project.name}
              getNode={(id) => stageRefs.current[id] ?? null}
            />
          </div>
        </div>
        <div className="border-t border-border bg-card/40">
          <SlideThumbnails
            slides={project.slides}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddCard={() => addSlide(createCardSlide())}
            onAddCover={() => addSlide(createCoverSlide())}
            onDelete={deleteSlide}
            onMove={moveSlide}
          />
        </div>
      </section>

      {/* Preview stage */}
      <Stage slide={selectedSlide} />

      {/* Offscreen full-size render targets for crisp export */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }}
      >
        {project.slides.map((slide) => (
          <div
            key={slide.id}
            ref={(el) => {
              stageRefs.current[slide.id] = el;
            }}
            style={{ width: 1080, height: 1350 }}
          >
            {slide.type === "cover" ? (
              <CoverSlide slide={slide} />
            ) : (
              <CardSlide slide={slide} />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function Stage({ slide }: { slide: Slide }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const pad = 48;
      const availW = el.clientWidth - pad;
      const availH = el.clientHeight - pad;
      const next = Math.min(availW / 1080, availH / 1350);
      setScale(Math.max(0.1, Math.min(next, 1)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="flex flex-1 items-center justify-center overflow-hidden bg-panel p-6"
      style={{ minHeight: "60vh" }}
    >
      <div
        style={{
          width: 1080 * scale,
          height: 1350 * scale,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 1080,
            height: 1350,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {slide.type === "cover" ? (
            <CoverSlide slide={slide} />
          ) : (
            <CardSlide slide={slide} />
          )}
        </div>
      </div>
    </section>
  );
}
