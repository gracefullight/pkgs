import { afterEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "@/utils/clipboard";
import { formatShareText, formatTweetText } from "@/utils/text";

afterEach(() => vi.restoreAllMocks());

describe("share text", () => {
  it("includes descriptions when the optional title is missing", () => {
    expect(formatShareText(undefined, "Description", "https://example.com")).toBe(
      "Description\nhttps://example.com",
    );
    expect(formatTweetText(undefined, "Description")).toBe("Description");
  });
});

describe("clipboard fallback", () => {
  it("removes the temporary textarea and restores focus when copying throws", async () => {
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Unavailable"));
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => {
        throw new Error("Copy denied");
      }),
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(copyToClipboard("test")).rejects.toThrow("Copy denied");
    expect(document.querySelector("textarea")).toBeNull();
    expect(document.activeElement).toBe(button);
    button.remove();
  });
});
