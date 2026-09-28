import { describe, expect, it } from "vitest";
import {
  categoryHeading,
  categoryKeyword,
  categoryPageDescription,
  categoryPageTitle,
} from "./category";

const city = "Karachi";
const category = (name: string, slug: string) => ({ name, slug });

describe("category page copy", () => {
  it("targets the search phrase, not the display label", () => {
    expect(categoryPageTitle(category("Truck / Commercial", "truck"), city)).toBe(
      "Truck Tyres Karachi",
    );
    expect(categoryPageTitle(category("Lifter / Forklift", "lifter"), city)).toBe(
      "Forklift Tyres Karachi",
    );
    expect(categoryPageTitle(category("SUV / 4x4", "suv"), city)).toBe("SUV Tyres Karachi");
    expect(categoryPageTitle(category("Car", "car"), city)).toBe("Car Tyres Karachi");
    expect(categoryPageTitle(category("Off-road", "offroad"), city)).toBe("Off-road Tyres Karachi");
  });

  it("falls back to the category name for a slug it does not know", () => {
    expect(categoryKeyword(category("Tractor", "tractor"))).toBe("tractor");
    expect(categoryPageTitle(category("Tractor", "tractor"), city)).toBe("Tractor Tyres Karachi");
  });

  it("builds the heading and description from the same keyword", () => {
    const truck = category("Truck / Commercial", "truck");
    expect(categoryHeading(truck, city)).toBe("Truck tyres in Karachi");
    expect(categoryPageDescription(truck, "Baber Tyres Corporation", city)).toMatch(
      /^Truck tyres in Karachi from Baber Tyres Corporation\./,
    );
  });
});
