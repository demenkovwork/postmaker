import { Fragment } from "react";
import type { CoverSlide as CoverSlideData } from "@/lib/types";

interface Props {
  slide: CoverSlideData;
}

/** Render *word* highlights as accent-colored spans, without dangerous HTML. */
function renderTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span className="hl" key={i}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function CoverSlide({ slide }: Props) {
  return (
    <div className="cover">
      <div className="stars" />
      <div className="glow" />
      <div className="cwrap">
        <div className="eyebig" />
        <div className="ctitle">{renderTitle(slide.title)}</div>
        <div className="csub">{slide.subtitle}</div>
      </div>
      <div className="ctag">
        <span className="dot" />
        <span>{slide.bottomTag || slide.brand}</span>
      </div>
    </div>
  );
}
