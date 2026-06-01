export type SlideType = "cover" | "card";

export interface CardSlide {
  id: string;
  type: "card";
  badge: string;
  link: string;
  description: string;
  footerRight: string;
  accent: string;
  brand: string;
  /** base64 data URL of an uploaded screenshot, or null for placeholder */
  screenshot: string | null;
}

export interface CoverSlide {
  id: string;
  type: "cover";
  title: string;
  subtitle: string;
  bottomTag: string;
  brand: string;
  accent: string;
}

export type Slide = CardSlide | CoverSlide;

export interface Project {
  name: string;
  slides: Slide[];
}
