import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KEY_ID } from "@/constants";
import { addToWindow, registerMenus, removeFromWindow, unregisterMenus } from "@/core/menu";

describe("Zotero 8 keyboard shortcut", () => {
  let key: {
    id: string;
    setAttribute: ReturnType<typeof vi.fn>;
    addEventListener: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let document: {
    getElementById: ReturnType<typeof vi.fn>;
    createXULElement: ReturnType<typeof vi.fn>;
  };
  let window: Window;
  let onCommand: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    key = { id: "", setAttribute: vi.fn(), addEventListener: vi.fn(), remove: vi.fn() };
    document = {
      getElementById: vi.fn((id: string) =>
        id === "mainKeyset" ? { appendChild: vi.fn() } : null,
      ),
      createXULElement: vi.fn(() => key),
    };
    window = { document } as unknown as Window;
    onCommand = vi.fn(async () => {});
    vi.stubGlobal("Zotero", {
      debug: vi.fn(),
      getMainWindows: () => [window],
      Menu: { registerMenu: vi.fn(), unregisterMenu: vi.fn() },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("registers the shortcut in existing windows alongside native menus", () => {
    registerMenus(onCommand);
    expect(document.createXULElement).toHaveBeenCalledWith("key");
    expect(key.id).toBe(KEY_ID);
    expect(key.setAttribute).toHaveBeenCalledWith("modifiers", "accel,shift");
    expect(key.setAttribute).toHaveBeenCalledWith("key", "U");
    expect(key.addEventListener).toHaveBeenCalledWith("command", onCommand);
  });

  it("registers the shortcut in a newly opened window", () => {
    addToWindow(window, onCommand);
    expect(document.createXULElement).toHaveBeenCalledWith("key");
  });

  it("removes the shortcut from a closed window", () => {
    document.getElementById.mockImplementation((id: string) => (id === KEY_ID ? key : null));
    removeFromWindow(window);
    expect(key.remove).toHaveBeenCalledOnce();
  });

  it("removes shortcuts when the plugin shuts down", () => {
    document.getElementById.mockImplementation((id: string) => (id === KEY_ID ? key : null));
    unregisterMenus();
    expect(key.remove).toHaveBeenCalledOnce();
  });
});
