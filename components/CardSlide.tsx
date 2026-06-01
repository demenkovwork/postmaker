import type { CardSlide as CardSlideData } from "@/lib/types";

interface Props {
  slide: CardSlideData;
}

export default function CardSlide({ slide }: Props) {
  return (
    <div className="card">
      <div className="stars" />
      <div className="glow" />
      <div className="wrap">
        <div className="shot">
          <div className="badge">
            <span className="dot" />
            {slide.badge}
          </div>
          {slide.screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.screenshot} alt="competitor screenshot" />
          ) : (
            <div className="ph">your competitor screenshot here</div>
          )}
        </div>
        <div className="link" style={{ color: slide.accent }}>
          {slide.link}
        </div>
        <div className="desc">{slide.description}</div>
        <div className="foot">
          <div className="brand">
            <span className="eye" />
            <span>{slide.brand}</span>
          </div>
          <div>{slide.footerRight}</div>
        </div>
      </div>
    </div>
  );
}
