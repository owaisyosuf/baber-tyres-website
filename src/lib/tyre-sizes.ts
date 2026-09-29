const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, index) => from + index * step);

/**
 * Standard metric sizes for the homepage size finder, so a visitor can pick
 * the size on their sidewall even when it is not listed online yet (the
 * catalog's empty state then offers WhatsApp). Metric widths step by 10 and
 * end in 5; profiles step by 5; rims include the commercial half sizes.
 */
export const STANDARD_TYRE_SIZES = {
  widths: range(135, 335, 10),
  profiles: range(25, 85, 5),
  rims: [...range(12, 24, 1), 17.5, 19.5, 22.5].sort((a, b) => a - b),
} as const;
