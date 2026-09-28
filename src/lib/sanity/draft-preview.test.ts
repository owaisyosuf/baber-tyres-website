import { describe, expect, it } from "vitest";
import { shouldShowSampleDrafts } from "./draft-preview";

const on = { NODE_ENV: "development", SHOW_SAMPLE_DRAFTS: "true", SANITY_API_READ_TOKEN: "sk-x" };

describe("shouldShowSampleDrafts", () => {
  it("is on for a dev server with the flag and a token", () => {
    expect(shouldShowSampleDrafts(on)).toBe(true);
  });

  it("is never on in production, even with the flag and a token", () => {
    expect(shouldShowSampleDrafts({ ...on, NODE_ENV: "production" })).toBe(false);
    expect(shouldShowSampleDrafts({ ...on, NODE_ENV: "test" })).toBe(false);
    expect(shouldShowSampleDrafts({ ...on, NODE_ENV: undefined })).toBe(false);
  });

  it('needs the flag to be exactly "true"', () => {
    for (const flag of [undefined, "", "false", "1", "TRUE"]) {
      expect(shouldShowSampleDrafts({ ...on, SHOW_SAMPLE_DRAFTS: flag })).toBe(false);
    }
  });

  it("needs a read token, since drafts are private", () => {
    expect(shouldShowSampleDrafts({ ...on, SANITY_API_READ_TOKEN: undefined })).toBe(false);
    expect(shouldShowSampleDrafts({ ...on, SANITY_API_READ_TOKEN: "" })).toBe(false);
  });
});
