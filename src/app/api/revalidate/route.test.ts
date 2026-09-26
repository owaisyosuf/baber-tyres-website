import { NextRequest } from "next/server";
import { encodeSignatureHeader } from "@sanity/webhook";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));
vi.mock("next/cache", () => ({ revalidateTag }));

const { POST } = await import("./route");

const SECRET = "test-secret";

async function signedRequest(
  body: string,
  { secret = SECRET, headers = {} as Record<string, string> } = {},
) {
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    body,
    headers: { "sanity-webhook-signature": signature, ...headers },
  });
}

// parseBody waits 3s for Content Lake to catch up after a validly signed
// request, so those tests need more than vitest's default 5s budget.
const SIGNED_TIMEOUT = 10_000;

const send = (request: NextRequest) => POST(request);

beforeEach(() => {
  vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  revalidateTag.mockClear();
});

describe("POST /api/revalidate", () => {
  it("revalidates the affected tags for a validly signed request", { timeout: SIGNED_TIMEOUT }, async () => {
    const body = JSON.stringify({ _type: "product", slug: "bluearth-es32" });
    const res = await send(await signedRequest(body));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      revalidated: ["product", "product:bluearth-es32"],
    });
    expect(revalidateTag).toHaveBeenCalledWith("product", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("product:bluearth-es32", {
      expire: 0,
    });
  });

  it("returns 200 and revalidates nothing for a document type it does not track", { timeout: SIGNED_TIMEOUT }, async () => {
    const res = await send(
      await signedRequest(JSON.stringify({ _type: "sanity.imageAsset" })),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: [] });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header", async () => {
    const res = await send(
      new NextRequest("http://localhost/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ _type: "product", slug: "x" }),
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a body that was changed after signing", async () => {
    const signed = await signedRequest(
      JSON.stringify({ _type: "product", slug: "harmless" }),
    );
    const signature = signed.headers.get("sanity-webhook-signature")!;
    const tampered = new NextRequest("http://localhost/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ _type: "brand", slug: "yokohama" }),
      headers: { "sanity-webhook-signature": signature },
    });
    const res = await send(tampered);

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request signed with the wrong secret", async () => {
    const body = JSON.stringify({ _type: "product", slug: "x" });
    const res = await send(await signedRequest(body, { secret: "other" }));

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a malformed signature header", async () => {
    const res = await send(
      new NextRequest("http://localhost/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ _type: "product", slug: "x" }),
        headers: { "sanity-webhook-signature": "not-a-signature" },
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a non-JSON body with 401 rather than leaking a parse error", async () => {
    const res = await send(
      new NextRequest("http://localhost/api/revalidate", {
        method: "POST",
        body: "not json",
        headers: { "sanity-webhook-signature": "t=1,v1=bad" },
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a validly signed body with no document in it with 400", { timeout: SIGNED_TIMEOUT }, async () => {
    const res = await send(await signedRequest("null"));

    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("fails closed with 500 when the secret is not configured", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "");
    const res = await send(
      await signedRequest(JSON.stringify({ _type: "product", slug: "x" })),
    );

    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
