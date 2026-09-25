import { describe, expect, it } from "vitest";
import { formatPKR, formatTyreSize } from "./format";

describe("formatPKR", () => {
  it("formats with the PKR prefix and thousands separators", () => {
    expect(formatPKR(14500)).toBe("PKR 14,500");
    expect(formatPKR(199999)).toBe("PKR 199,999");
    expect(formatPKR(990)).toBe("PKR 990");
  });

  it("rounds fractional amounts", () => {
    expect(formatPKR(14500.6)).toBe("PKR 14,501");
  });

  it("rejects non-finite input", () => {
    expect(() => formatPKR(NaN)).toThrow();
    expect(() => formatPKR(Infinity)).toThrow();
  });
});

describe("formatTyreSize", () => {
  it("builds the standard width/profile/rim label", () => {
    expect(formatTyreSize({ width: 185, profile: 65, rim: 15 })).toBe(
      "185/65 R15",
    );
  });

  it("prefers sizeLabelOverride for commercial sizing", () => {
    expect(
      formatTyreSize({
        width: 0,
        profile: 0,
        rim: 0,
        sizeLabelOverride: "11R22.5",
      }),
    ).toBe("11R22.5");
  });

  it("falls back to the computed label when the override is blank", () => {
    expect(
      formatTyreSize({
        width: 145,
        profile: 70,
        rim: 12,
        sizeLabelOverride: "   ",
      }),
    ).toBe("145/70 R12");
  });
});
