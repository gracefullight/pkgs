export {};

declare global {
  interface Window {
    FB: {
      init(params: {
        appId: string;
        cookie?: boolean;
        version: string;
        xfbml?: boolean;
      }): void;
      getAppId?(): string;
      ui(params: Record<string, unknown>, callback?: (response: unknown) => void): void;
    };
    fbAsyncInit: () => void;
  }
}
