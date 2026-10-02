export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    throw new Error("Clipboard operations are not supported in this environment");
  }

  // Try modern Clipboard API first
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // If clipboard API fails, try fallback method
      console.warn("Clipboard API failed, trying fallback:", error);
    }
  }

  // Fallback: use document.execCommand (deprecated but widely supported)
  const textArea = document.createElement("textarea");
  const previouslyFocused = document.activeElement;
  try {
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");

    if (!successful) {
      throw new Error("execCommand('copy') returned false");
    }
  } catch (error) {
    throw new Error(
      `Failed to copy to clipboard: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    textArea.remove();
    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
  }
}
