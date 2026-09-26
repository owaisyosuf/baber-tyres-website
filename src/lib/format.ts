/**
 * Shared formatters — R8, FR-B3. Price and tyre-size display goes through
 * these two functions everywhere on the site, so the format never drifts
 * between a product card, a detail page, and a WhatsApp message.
 */

export function formatPKR(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error(`formatPKR received a non-finite amount: ${amount}`);
  }
  return `PKR ${Math.round(amount).toLocaleString("en-US")}`;
}

export interface TyreSizeInput {
  width: number;
  profile: number;
  rim: number;
  /**
   * Commercial sizing (truck, forklift, off-road) doesn't fit the
   * width/profile/rim metric triple — e.g. "11R22.5" or "7.00-12".
   * When present, this wins over the computed label.
   */
  sizeLabelOverride?: string | null;
}

export function formatTyreSize(size: TyreSizeInput): string {
  const override = size.sizeLabelOverride?.trim();
  if (override) {
    return override;
  }
  return `${size.width}/${size.profile} R${size.rim}`;
}

/**
 * E.164 → the local form people dial and read, e.g. "+923001234567" →
 * "0300-1234567". Only Pakistani mobile numbers are reformatted; anything
 * else is returned unchanged rather than guessed at.
 */
export function formatPhoneDisplay(e164: string): string {
  const match = /^\+92(3\d{2})(\d{7})$/.exec(e164.trim());
  return match ? `0${match[1]}-${match[2]}` : e164;
}
