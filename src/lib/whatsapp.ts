/**
 * WhatsApp deep-link builder — FR-D2. Every inquiry action on the site goes
 * through here so the message text stays context-aware (product, brand,
 * service, or generic) and the number is only ever read from site.ts (R6).
 */

import { siteConfig } from "./site";
import { formatTyreSize, type TyreSizeInput } from "./format";

function toWhatsAppDigits(e164: string): string {
  return e164.replace(/[^\d]/g, "");
}

export function buildWhatsAppLink(
  message: string,
  phoneE164: string = siteConfig.whatsappE164,
): string {
  const digits = toWhatsAppDigits(phoneE164);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(product: {
  name: string;
  size: TyreSizeInput;
}): string {
  return `Hi ${siteConfig.shopName}, I'm interested in ${product.name} (${formatTyreSize(product.size)}). Is it in stock?`;
}

export function brandInquiryMessage(brandName: string): string {
  return `Hi ${siteConfig.shopName}, I'm looking for ${brandName} tyres. Can you help?`;
}

export function categoryInquiryMessage(keyword: string): string {
  return `Hi ${siteConfig.shopName}, I'm looking for ${keyword} tyres. Can you help?`;
}

export function serviceInquiryMessage(serviceName: string): string {
  return `Hi ${siteConfig.shopName}, I'd like to inquire about ${serviceName}.`;
}

export function genericInquiryMessage(): string {
  return `Hi ${siteConfig.shopName}, I have a question about your tyres.`;
}

/**
 * For a visitor who searched for a size and found nothing: names the size they
 * were after when the filter carries a full width/profile/rim, and falls back
 * to the generic message otherwise.
 */
export function sizeInquiryMessage(size: {
  width?: number;
  profile?: number;
  rim?: number;
}): string {
  const { width, profile, rim } = size;
  if (width === undefined || profile === undefined || rim === undefined) {
    return genericInquiryMessage();
  }
  return `Hi ${siteConfig.shopName}, I'm looking for ${formatTyreSize({ width, profile, rim })} tyres. Do you have them in stock?`;
}

export function productWhatsAppLink(product: {
  name: string;
  size: TyreSizeInput;
}): string {
  return buildWhatsAppLink(productInquiryMessage(product));
}

export function brandWhatsAppLink(brandName: string): string {
  return buildWhatsAppLink(brandInquiryMessage(brandName));
}

export function serviceWhatsAppLink(serviceName: string): string {
  return buildWhatsAppLink(serviceInquiryMessage(serviceName));
}

export function genericWhatsAppLink(): string {
  return buildWhatsAppLink(genericInquiryMessage());
}

export function sizeWhatsAppLink(
  size: { width?: number; profile?: number; rim?: number },
  phoneE164?: string,
): string {
  return buildWhatsAppLink(sizeInquiryMessage(size), phoneE164);
}
