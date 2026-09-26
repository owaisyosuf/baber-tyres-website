"use client";

import { useEffect, useRef } from "react";
import { TreadMotif } from "@/components/icons";

/**
 * Pointer-lit tread — the hero's one interactive effect. As the cursor moves
 * over the hero, a soft amber glow follows it and the tread pattern lights up
 * around it. It only ever responds to the pointer (nothing loops or plays on
 * its own), never runs on touch devices, and is skipped entirely under
 * `prefers-reduced-motion`. The pointer position is written straight to CSS
 * variables, so moving the mouse never re-renders React.
 *
 * Sits inside the hero section and listens on its parent element.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect();
        layer.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        layer.style.setProperty("--my", `${event.clientY - rect.top}px`);
        layer.dataset.active = "true";
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      delete layer.dataset.active;
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  const spot = "var(--mx, 50%) var(--my, 50%)";

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out-soft data-[active=true]:opacity-100"
      // Fades out toward the bottom edge so the light never ends in a hard line.
      style={{
        maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(360px circle at ${spot}, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 text-accent"
        style={{
          maskImage: `radial-gradient(240px circle at ${spot}, black, transparent)`,
          WebkitMaskImage: `radial-gradient(240px circle at ${spot}, black, transparent)`,
        }}
      >
        <TreadMotif className="h-full w-full" />
      </div>
    </div>
  );
}
