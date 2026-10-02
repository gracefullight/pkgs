import { useCallback, useEffect, useState } from "react";
import { facebookStrategy } from "@/strategies/facebook";
import { kakaoStrategy } from "@/strategies/kakao";
import { lineStrategy } from "@/strategies/line";
import { createLinkStrategy } from "@/strategies/link";
import { createNativeStrategy } from "@/strategies/native";
import { pinterestStrategy } from "@/strategies/pinterest";
import { threadsStrategy } from "@/strategies/threads";
import { twitterStrategy } from "@/strategies/twitter";
import { whatsappStrategy } from "@/strategies/whatsapp";
import type { HeadlessShareOptions, ShareData, SharePlatform, ShareStrategy } from "@/types";
import { setupFacebookSDK } from "@/utils/facebook";

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js";
const FB_SDK_URL = "https://connect.facebook.net/en_US/sdk.js";

const strategyRegistry = new Map<SharePlatform, ShareStrategy>([
  ["facebook", facebookStrategy],
  ["kakao", kakaoStrategy],
  ["line", lineStrategy],
  ["pinterest", pinterestStrategy],
  ["threads", threadsStrategy],
  ["twitter", twitterStrategy],
  ["whatsapp", whatsappStrategy],
]);

function useExternalScript(src: string | undefined, sdkAvailable: boolean) {
  type ScriptStatus = "idle" | "loading" | "ready" | "error";
  const [state, setState] = useState<{ src?: string; status: ScriptStatus }>({
    src,
    status: src ? "loading" : "idle",
  });

  useEffect(() => {
    const updateStatus = (status: ScriptStatus) => setState({ src, status });
    if (!src || typeof document === "undefined") {
      updateStatus(src ? "error" : "idle");
      return;
    }

    if (sdkAvailable) {
      updateStatus("ready");
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    const isNewScript = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.headlessShareStatus = "loading";
      const trackedScript = script;
      script.addEventListener(
        "load",
        () => {
          trackedScript.dataset.headlessShareStatus = "ready";
        },
        { once: true },
      );
      script.addEventListener(
        "error",
        () => {
          trackedScript.dataset.headlessShareStatus = "error";
        },
        { once: true },
      );
    }

    const storedStatus = script.dataset.headlessShareStatus;
    updateStatus(storedStatus === "ready" || storedStatus === "error" ? storedStatus : "loading");

    const handleLoad = () => updateStatus("ready");
    const handleError = () => updateStatus("error");
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (isNewScript) document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [src, sdkAvailable]);

  return state.src === src ? state.status : src ? "loading" : "idle";
}

export interface UseHeadlessShareProps {
  type: SharePlatform;
  options?: HeadlessShareOptions;
  onShareError?: (error: unknown) => void;
  onCopySuccess?: () => void;
}

export function useHeadlessShare({
  type,
  options,
  onShareError,
  onCopySuccess,
}: UseHeadlessShareProps) {
  const isKakao = type === "kakao";
  const isFacebook = type === "facebook";

  const sdkUrl = (() => {
    if (isKakao) {
      return KAKAO_SDK_URL;
    }
    if (isFacebook) {
      return FB_SDK_URL;
    }
    return undefined;
  })();

  useEffect(() => {
    if (isFacebook) {
      setupFacebookSDK(options?.facebook?.appId);
    }
  }, [isFacebook, options?.facebook?.appId]);

  const sdkAvailable =
    typeof window !== "undefined" &&
    Boolean(isKakao ? window.Kakao : isFacebook ? window.FB : false);
  const scriptStatus = useExternalScript(sdkUrl, sdkAvailable);
  const isSdkReady = sdkUrl ? scriptStatus === "ready" : true;
  const hasScriptError = scriptStatus === "error";

  useEffect(() => {
    if (hasScriptError) {
      onShareError?.(new Error(`Failed to load SDK script for ${type}`));
    }
  }, [hasScriptError, type, onShareError]);

  const share = useCallback(
    async (data: ShareData) => {
      const { url } = data;
      if (!url) {
        onShareError?.(new Error("URL is required for sharing"));
        return;
      }

      try {
        if (type === "link") {
          await createLinkStrategy(onCopySuccess).share(data, options);
          return;
        }

        if (type === "native") {
          await createNativeStrategy(onCopySuccess).share(data, options);
          return;
        }

        const strategy = strategyRegistry.get(type);

        if (strategy) {
          await strategy.share(data, options);
        } else {
          console.warn(`No share strategy found for type: ${type}`);
        }
      } catch (e) {
        onShareError?.(e);
      }
    },
    [type, onShareError, onCopySuccess, options],
  );

  return {
    isSdkReady,
    share,
  };
}

export function registerShareStrategy(type: SharePlatform, strategy: ShareStrategy) {
  strategyRegistry.set(type, strategy);
}

export function unregisterShareStrategy(type: SharePlatform) {
  strategyRegistry.delete(type);
}
