import { afterEach, describe, expect, it, vi } from "vitest";
import { loadDaumPostcodeScript } from "@/lib/daum-postcode-script";

afterEach(() => vi.unstubAllGlobals());

describe("Daum Postcode script loading", () => {
  it("shares an in-flight script across component instances", async () => {
    const first = loadDaumPostcodeScript(document);
    const second = loadDaumPostcodeScript(document);
    const script = document.querySelector("script");

    expect(first).toBe(second);
    expect(document.querySelectorAll("script")).toHaveLength(1);

    const failure = expect(first).rejects.toThrow("Failed to load");
    script?.dispatchEvent(new Event("error"));
    await failure;
    expect(document.querySelector("script")).toBeNull();
  });

  it("retries with a fresh script after a failed request", async () => {
    const first = loadDaumPostcodeScript(document);
    const originalScript = document.querySelector("script");
    const failure = expect(first).rejects.toThrow("Failed to load");
    originalScript?.dispatchEvent(new Event("error"));
    await failure;

    const retry = loadDaumPostcodeScript(document);
    const retryScript = document.querySelector("script");
    expect(retry).not.toBe(first);
    expect(retryScript).not.toBe(originalScript);

    const retryFailure = expect(retry).rejects.toThrow("Failed to load");
    retryScript?.dispatchEvent(new Event("error"));
    await retryFailure;
  });

  it("uses an SDK already provided by the host page", async () => {
    vi.stubGlobal("daum", { Postcode: vi.fn() });

    await loadDaumPostcodeScript(document);

    expect(document.querySelector("script")).toBeNull();
  });
});
