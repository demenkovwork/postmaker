import type { CardSlide, CoverSlide, Project } from "./types";

export const BRAND_ACCENT = "#e9960d";
export const BRAND_HANDLE = "compeye.app";

/** Frequent competitive-intelligence signal badges. */
export const BADGE_PRESETS: string[] = [
  "🔥 Trending on Reddit",
  "👀 Spotted on HN",
  "📈 +14 hires this week",
  "💰 New funding",
  "🚀 New launch",
  "⚠️ Pricing change",
  "🆕 New feature",
];

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function createCardSlide(overrides: Partial<CardSlide> = {}): CardSlide {
  return {
    id: uid("card"),
    type: "card",
    badge: BADGE_PRESETS[0],
    link: "linear.app · raises $82M Series C",
    description:
      "Linear just closed an $82M round led by Accel. Spotted across Reddit & HN before any press release. Their hiring page added 14 new roles this week — mostly enterprise sales.",
    footerRight: "Save this post 🔖",
    accent: BRAND_ACCENT,
    brand: BRAND_HANDLE,
    screenshot: null,
    ...overrides,
  };
}

export function createCoverSlide(overrides: Partial<CoverSlide> = {}): CoverSlide {
  return {
    id: uid("cover"),
    type: "cover",
    title: "Who's *winning* the SaaS race?",
    subtitle:
      "New launches & competitor moves, spotted before the press release.",
    bottomTag: "",
    brand: BRAND_HANDLE,
    accent: BRAND_ACCENT,
    ...overrides,
  };
}

/** Default carousel template: a cover + one card. */
export function createDefaultProject(): Project {
  return {
    name: "Untitled carousel",
    slides: [createCoverSlide(), createCardSlide()],
  };
}
