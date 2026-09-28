import { describe, expect, it } from "vitest";
import {
  buildWhatsAppLink,
  productInquiryMessage,
  productWhatsAppLink,
  brandInquiryMessage,
  categoryInquiryMessage,
  serviceInquiryMessage,
  genericInquiryMessage,
  sizeInquiryMessage,
  sizeWhatsAppLink,
} from "./whatsapp";
import { siteConfig } from "./site";

const expectedDigits = siteConfig.whatsappE164.replace(/[^\d]/g, "");

describe("buildWhatsAppLink", () => {
  it("strips non-digits from a supplied phone number and URL-encodes the message", () => {
    const spacedOutNumber = siteConfig.whatsappE164.replace(
      /(\+\d{2})(\d{3})(\d+)/,
      "$1 $2-$3",
    );
    const link = buildWhatsAppLink("Hello there!", spacedOutNumber);
    expect(link).toBe(
      `https://wa.me/${expectedDigits}?text=` +
        encodeURIComponent("Hello there!"),
    );
  });

  it("defaults to the shop's WhatsApp number", () => {
    const link = buildWhatsAppLink("test");
    expect(link.startsWith(`https://wa.me/${expectedDigits}?text=`)).toBe(
      true,
    );
  });
});

describe("context-aware messages", () => {
  it("includes product name and formatted size", () => {
    const msg = productInquiryMessage({
      name: "Yokohama BluEarth",
      size: { width: 185, profile: 65, rim: 15 },
    });
    expect(msg).toContain("Yokohama BluEarth");
    expect(msg).toContain("185/65 R15");
    expect(msg).toContain(siteConfig.shopName);
  });

  it("includes the brand name", () => {
    expect(brandInquiryMessage("Michelin")).toContain("Michelin");
  });

  it("includes the category keyword", () => {
    expect(categoryInquiryMessage("truck")).toContain("looking for truck tyres");
  });

  it("includes the service name", () => {
    expect(serviceInquiryMessage("Computerized Wheel Alignment")).toContain(
      "Computerized Wheel Alignment",
    );
  });

  it("generic message names the shop with no product context", () => {
    expect(genericInquiryMessage()).toContain(siteConfig.shopName);
  });
});

describe("productWhatsAppLink", () => {
  it("produces a fully encoded deep link with product context", () => {
    const link = productWhatsAppLink({
      name: "Dunlop SP Sport",
      size: { width: 0, profile: 0, rim: 0, sizeLabelOverride: "11R22.5" },
    });
    expect(link).toContain(`https://wa.me/${expectedDigits}?text=`);
    expect(decodeURIComponent(link.split("text=")[1])).toContain("11R22.5");
  });
});

describe("size inquiries", () => {
  it("names the size when the filter has all three parts", () => {
    const msg = sizeInquiryMessage({ width: 185, profile: 65, rim: 15 });
    expect(msg).toContain("185/65 R15");
    expect(msg).toContain(siteConfig.shopName);
  });

  it("supports a decimal rim", () => {
    expect(sizeInquiryMessage({ width: 295, profile: 80, rim: 22.5 })).toContain("295/80 R22.5");
  });

  it("falls back to the generic message when the size is incomplete", () => {
    expect(sizeInquiryMessage({})).toBe(genericInquiryMessage());
    expect(sizeInquiryMessage({ width: 185, profile: 65 })).toBe(genericInquiryMessage());
  });

  it("builds a wa.me link carrying the encoded message", () => {
    const link = sizeWhatsAppLink({ width: 185, profile: 65, rim: 15 });
    expect(link.startsWith(`https://wa.me/${expectedDigits}?text=`)).toBe(true);
    expect(decodeURIComponent(link.split("text=")[1])).toContain("185/65 R15");
  });
});
