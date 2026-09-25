import type { SVGProps } from "react";

/**
 * Shared contract for the icon set — design.md §7.7: 24×24, 1.5px stroke,
 * currentColor, inline SVG only (no icon font, no runtime icon library).
 * Icons are always decorative (aria-hidden); the accessible name lives on
 * the interactive element that wraps them (a labelled Button, a link).
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
}

export function svgProps({ size = 24, className, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
    ...rest,
  };
}
