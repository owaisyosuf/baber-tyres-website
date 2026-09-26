/**
 * Opening-hours display — FR-A6, FR-D3. Turns the shop's stored hours
 * (24-hour "HH:mm" strings and a list of weekday names) into the wording the
 * site shows, so the footer, contact page, and structured data never format
 * hours differently from one another.
 */

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

const TIME_24H = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/** True for a valid 24-hour "HH:mm" time. */
export function isTime24h(time: string): boolean {
  return TIME_24H.test(time.trim());
}

/** "19:00" → "7:00 PM". Anything that isn't a valid HH:mm is returned as typed. */
export function formatTime12h(time: string): string {
  const match = TIME_24H.exec(time.trim());
  if (!match) return time.trim();
  const hours = Number(match[1]);
  const period = hours < 12 ? "AM" : "PM";
  return `${hours % 12 || 12}:${match[2]} ${period}`;
}

/** Known day names only, deduplicated and in week order. */
export function sortWeekdays(days: readonly string[]): Weekday[] {
  return WEEKDAYS.filter((day) => days.includes(day));
}

/**
 * Three or more consecutive days collapse to a range ("Monday–Saturday");
 * anything else is listed. Unknown names are dropped, and order follows the
 * week regardless of the order they were entered in.
 */
export function formatOpenDays(days: readonly string[]): string {
  const indexes = sortWeekdays(days).map((day) => WEEKDAYS.indexOf(day));

  if (indexes.length === 0) return "";

  const consecutive = indexes.every(
    (index, i) => i === 0 || index === indexes[i - 1] + 1,
  );
  if (consecutive && indexes.length >= 3) {
    return `${WEEKDAYS[indexes[0]]}–${WEEKDAYS[indexes[indexes.length - 1]]}`;
  }
  return indexes.map((index) => WEEKDAYS[index]).join(", ");
}

export interface ShopHours {
  open: string;
  close: string;
  openDays: readonly string[];
  closedDay: string | null;
}

export interface OpeningHoursDisplay {
  /** e.g. "Monday–Saturday" */
  days: string;
  /** e.g. "10:00 AM – 7:00 PM" */
  time: string;
  /** e.g. "Sunday", or null when the shop has no closed day. */
  closedDay: string | null;
}

export function formatOpeningHours(hours: ShopHours): OpeningHoursDisplay {
  return {
    days: formatOpenDays(hours.openDays),
    time: `${formatTime12h(hours.open)} – ${formatTime12h(hours.close)}`,
    closedDay: hours.closedDay,
  };
}
