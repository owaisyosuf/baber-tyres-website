"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { staggerDelay } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Position in a group, for the 60ms stagger. */
  index?: number;
  className?: string;
}

/**
 * Scroll reveal — design.md §7.6, Constitution §IV. The server renders the
 * content in its final, visible state, so nothing is hidden without JavaScript
 * and nothing waits on hydration. Once mounted, only an element that starts
 * *below* the viewport is tucked away (opacity 0, 16px down) and then fades in
 * once as it scrolls into view. So:
 *   - nothing above the fold ever animates, LCP included;
 *   - under `prefers-reduced-motion` nothing is touched at all;
 *   - it runs once and never loops.
 * The hidden and shown looks live in globals.css, keyed on `data-reveal`,
 * which is set here on the DOM node rather than through React state.
 */
export function Reveal({ children, index = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    // Already on screen (or above it, after a scroll restore): leave it be.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ "--reveal-delay": `${staggerDelay(index)}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
