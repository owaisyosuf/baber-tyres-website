import { describe, expect, it } from "vitest";
import {
  buildWhatsAppLink,
  productInquiryMessage,
  productWhatsAppLink,
  brandInquiryMessage,
  serviceInquiryMessage,
  genericInquiryMessage,
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
