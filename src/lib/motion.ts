/**
 * Scroll-reveal timing — design.md §7.6: fade + 16px rise over 400ms, once,
 * staggered 60ms across a group. The stagger is capped so a long grid never
 * makes its last cards wait noticeably.
 */
export const REVEAL_STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 6;

export function staggerDelay(index: number): number {
  return Math.min(Math.max(index, 0), MAX_STAGGER_STEPS) * REVEAL_STAGGER_MS;
}
