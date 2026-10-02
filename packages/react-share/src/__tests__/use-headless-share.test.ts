import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHeadlessShare } from "@/hooks/use-headless-share";
import { facebookStrategy } from "@/strategies/facebook";

// Mocking strategies
vi.mock("@/strategies/facebook", () => ({
  facebookStrategy: { share: vi.fn() },
}));
vi.mock("@/strategies/kakao", () => ({
  kakaoStrategy: { share: vi.fn() },
}));
vi.mock("@/strategies/link", () => ({
  createLinkStrategy: vi.fn(() => ({ share: vi.fn() })),
}));
vi.mock("@/strategies/native", () => ({
  createNativeStrategy: vi.fn(() => ({ share: vi.fn() })),
}));

describe("useHeadlessShare", () => {
  beforeEach(() => {
    const appendChild = document.body.appendChild.bind(document.body);
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      if (node instanceof HTMLScriptElement) node.type = "text/plain";
      return appendChild(node);
    });
  });

  afterEach(() => {
    cleanup();
    document.querySelectorAll("script").forEach((script) => {
      script.remove();
    });
    vi.restoreAllMocks();
  });

  it("waits for a shared SDK script to load for every consumer", () => {
    const first = renderHook(() => useHeadlessShare({ type: "kakao" }));
    const second = renderHook(() => useHeadlessShare({ type: "kakao" }));
    const script = document.querySelector("script");

    expect(document.querySelectorAll("script")).toHaveLength(1);
    expect(first.result.current.isSdkReady).toBe(false);
    expect(second.result.current.isSdkReady).toBe(false);

    act(() => script?.dispatchEvent(new Event("load")));

    expect(first.result.current.isSdkReady).toBe(true);
    expect(second.result.current.isSdkReady).toBe(true);
  });

  it("reports a shared SDK loading error to every consumer", () => {
    const firstError = vi.fn();
    const secondError = vi.fn();
    renderHook(() => useHeadlessShare({ type: "kakao", onShareError: firstError }));
    renderHook(() => useHeadlessShare({ type: "kakao", onShareError: secondError }));

    act(() => document.querySelector("script")?.dispatchEvent(new Event("error")));

    expect(firstError).toHaveBeenCalledOnce();
    expect(secondError).toHaveBeenCalledOnce();
  });

  it("does not reuse readiness after changing SDK platforms", () => {
    const { result, rerender } = renderHook(
      ({ type }: { type: "kakao" | "facebook" }) => useHeadlessShare({ type }),
      { initialProps: { type: "kakao" } },
    );
    act(() => document.querySelector("script")?.dispatchEvent(new Event("load")));
    expect(result.current.isSdkReady).toBe(true);

    rerender({ type: "facebook" });

    expect(result.current.isSdkReady).toBe(false);
  });

  it("should initialize with ready state correctly for non-SDK platforms", () => {
    const { result } = renderHook(() => useHeadlessShare({ type: "twitter" }));
    expect(result.current.isSdkReady).toBe(true);
  });

  it("should call direct strategies correctly", async () => {
    const { result } = renderHook(() => useHeadlessShare({ type: "facebook" }));
    const shareData = { title: "Test", url: "https://example.com" };

    await act(async () => {
      await result.current.share(shareData);
    });

    expect(facebookStrategy.share).toHaveBeenCalledWith(shareData, undefined);
  });

  it("should handle link copy strategy", async () => {
    const onCopySuccess = vi.fn();
    const { result } = renderHook(() =>
      useHeadlessShare({
        onCopySuccess,
        type: "link",
      }),
    );

    const shareData = { url: "https://example.com" };
    await act(async () => {
      await result.current.share(shareData);
    });

    // Strategy creation itself is mocked, so we just check if it was called
    const { createLinkStrategy } = await import("@/strategies/link");
    expect(createLinkStrategy).toHaveBeenCalledWith(onCopySuccess);
  });

  it("should return error if URL is missing", async () => {
    const onShareError = vi.fn();
    const { result } = renderHook(() =>
      useHeadlessShare({
        onShareError,
        type: "twitter",
      }),
    );

    await act(async () => {
      await result.current.share({ url: "" });
    });

    expect(onShareError).toHaveBeenCalled();
  });
});
