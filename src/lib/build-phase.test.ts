import { describe, expect, it } from "vitest";
import { rethrowDuringBuild } from "./build-phase";

describe("rethrowDuringBuild", () => {
  const failure = new Error("Sanity unreachable");

  it("rethrows the original error while building, so the build fails", () => {
    expect(() => rethrowDuringBuild(failure, { NEXT_PHASE: "phase-production-build" })).toThrow(
      failure,
    );
  });

  it("does nothing at request time, so the page falls back and still renders", () => {
    for (const phase of [undefined, "phase-production-server", "phase-development-server"]) {
      expect(() => rethrowDuringBuild(failure, { NEXT_PHASE: phase })).not.toThrow();
    }
  });
});
