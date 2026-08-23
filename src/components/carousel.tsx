"use client";

import { useRef, type ReactNode } from "react";

const CARD_GAP_PX = 20;

export function Carousel({ items }: { items: ReactNode[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function go(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.getBoundingClientRect().width + CARD_GAP_PX : el.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= maxScroll - 8;
    const atStart = el.scrollLeft <= 8;

    if (direction === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  }

  return (
    <div className="flex items-stretch gap-3">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous"
        className="hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-md border border-border transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] sm:inline-flex"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-hide flex flex-1 snap-x snap-mandatory scroll-smooth gap-5 overflow-x-auto"
      >
        {items.map((item, index) => (
          <div
            key={index}
            data-carousel-card
            className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.3333%-14px)]"
          >
            {item}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next"
        className="hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-md border border-border transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] sm:inline-flex"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
