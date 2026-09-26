/**
 * Serialises a JSON-LD object for embedding in a <script> tag. `<` is escaped
 * so a value containing "</script>" (an owner-entered name, say) cannot close
 * the tag and inject markup — the sanitisation Next.js's JSON-LD guide asks for.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
