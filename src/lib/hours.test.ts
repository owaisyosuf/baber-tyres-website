import { describe, expect, it } from "vitest";
import { formatOpenDays, formatOpeningHours, formatTime12h } from "./hours";
import { siteConfig } from "./site";

describe("formatTime12h", () => {
  it("converts 24-hour times to 12-hour with AM/PM", () => {
    expect(formatTime12h("10:00")).toBe("10:00 AM");
    expect(formatTime12h("19:00")).toBe("7:00 PM");
    expect(formatTime12h("09:30")).toBe("9:30 AM");
    expect(formatTime12h("13:05")).toBe("1:05 PM");
  });

  it("handles noon and midnight", () => {
    expect(formatTime12h("12:00")).toBe("12:00 PM");
    expect(formatTime12h("00:00")).toBe("12:00 AM");
    expect(formatTime12h("23:59")).toBe("11:59 PM");
  });

  it("returns anything that is not HH:mm as typed instead of guessing", () => {
    expect(formatTime12h("7pm")).toBe("7pm");
    expect(formatTime12h(" 24:00 ")).toBe("24:00");
    expect(formatTime12h("")).toBe("");
  });
});

describe("formatOpenDays", () => {
  it("collapses three or more consecutive days into a range", () => {
    expect(
      formatOpenDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
    ).toBe("Monday–Saturday");
    expect(formatOpenDays(["Tuesday", "Wednesday", "Thursday"])).toBe("Tuesday–Thursday");
  });

  it("orders by the week whatever order the days were entered in", () => {
    expect(formatOpenDays(["Wednesday", "Monday", "Tuesday"])).toBe("Monday–Wednesday");
  });

  it("lists days that are not a run of three or more", () => {
    expect(formatOpenDays(["Monday", "Tuesday"])).toBe("Monday, Tuesday");
    expect(formatOpenDays(["Monday", "Wednesday", "Friday"])).toBe("Monday, Wednesday, Friday");
    expect(formatOpenDays(["Saturday"])).toBe("Saturday");
  });

  it("ignores duplicates and unknown day names", () => {
    expect(formatOpenDays(["Monday", "Monday", "Someday", "Tuesday", "Wednesday"])).toBe(
      "Monday–Wednesday",
    );
    expect(formatOpenDays([])).toBe("");
    expect(formatOpenDays(["Funday"])).toBe("");
  });
});

describe("formatOpeningHours", () => {
  it("renders the shop's confirmed hours: Mon–Sat 10 AM–7 PM, Sunday closed", () => {
    expect(
      formatOpeningHours({
        open: siteConfig.hours.open,
        close: siteConfig.hours.close,
        openDays: siteConfig.hours.openDays,
        closedDay: siteConfig.hours.closedDay,
      }),
    ).toEqual({
      days: "Monday–Saturday",
      time: "10:00 AM – 7:00 PM",
      closedDay: "Sunday",
    });
  });

  it("passes a missing closed day through as null", () => {
    expect(
      formatOpeningHours({
        open: "09:00",
        close: "17:00",
        openDays: ["Monday", "Tuesday", "Wednesday"],
        closedDay: null,
      }).closedDay,
    ).toBeNull();
  });
});
