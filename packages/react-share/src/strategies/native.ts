import type { HeadlessShareListeners, HeadlessShareOptions, ShareStrategy } from "@/types";

import { copyToClipboard } from "@/utils/clipboard";

interface ShareData {
  text?: string;
  title?: string;
  url: string;
  files?: File[];
}

const isShareSupported = (): boolean => typeof navigator !== "undefined" && "share" in navigator;

const canShareFiles = (files: File[]): boolean => navigator.canShare?.({ files }) ?? false;

const buildShareData = (
  data: { description?: string | null; title?: string | null; url: string },
  files?: File[],
): ShareData => {
  const shareData: ShareData = {
    text: data.description ?? undefined,
    title: data.title ?? undefined,
    url: data.url,
  };

  if (files && files.length > 0 && canShareFiles(files)) {
    Object.assign(shareData, { files });
  }

  return shareData;
};

const handleShareError = (err: unknown): void => {
  if (err instanceof Error && err.name !== "AbortError") {
    console.error("Navigator share failed", err);
  }
};

const isAbortError = (err: unknown): boolean => err instanceof Error && err.name === "AbortError";

const tryNativeShare = async (
  data: { description?: string | null; title?: string | null; url: string },
  files?: File[],
): Promise<boolean> => {
  if (!isShareSupported()) {
    return false;
  }

  try {
    const shareData = buildShareData(data, files);
    await navigator.share(shareData);
    return true;
  } catch (err) {
    handleShareError(err);
    if (isAbortError(err)) {
      return true;
    }
    return false;
  }
};

export const createNativeStrategy = (
  onCopySuccess?: HeadlessShareListeners["onCopySuccess"],
): ShareStrategy => ({
  share: async (data, options) => {
    const { url } = data;
    const files = (options as HeadlessShareOptions | undefined)?.native?.files;

    const success = await tryNativeShare(data, files);
    if (success) {
      return;
    }

    await copyToClipboard(url);
    onCopySuccess?.();
  },
});
