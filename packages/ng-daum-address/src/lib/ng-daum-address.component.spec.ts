import "@angular/compiler";
import { DOCUMENT } from "@angular/common";
import { Injector, PLATFORM_ID, runInInjectionContext } from "@angular/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DaumPostcodeOptions } from "@/lib/daum-address.interface";
import { NgDaumAddressComponent } from "@/lib/ng-daum-address.component";

function createComponent() {
  const injector = Injector.create({
    providers: [
      { provide: DOCUMENT, useValue: document },
      { provide: PLATFORM_ID, useValue: "browser" },
    ],
  });
  const component = runInInjectionContext(injector, () => new NgDaumAddressComponent());
  return { component, injector };
}

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe("NgDaumAddressComponent", () => {
  it("opens only one popup when clicked repeatedly during SDK loading", async () => {
    const { component } = createComponent();
    component.openAddressSearch();
    component.openAddressSearch();
    const open = vi.fn();
    const Postcode = vi.fn(
      class {
        open = open;
        embed = vi.fn();
      },
    );
    vi.stubGlobal("daum", { Postcode });
    document.querySelector("script")?.dispatchEvent(new Event("load"));
    await vi.waitFor(() => expect(open).toHaveBeenCalledOnce());
    expect(Postcode).toHaveBeenCalledOnce();
  });

  it("does not open a popup after its component is destroyed", async () => {
    const { component, injector } = createComponent();
    component.openAddressSearch();
    injector.destroy();
    const Postcode = vi.fn();
    vi.stubGlobal("daum", { Postcode });
    document.querySelector("script")?.dispatchEvent(new Event("load"));
    await Promise.resolve();
    expect(Postcode).not.toHaveBeenCalled();
  });

  it("resizes the inline container when the SDK reports a new height", () => {
    const { component } = createComponent();
    Object.defineProperty(component, "options", {
      value: () => ({ type: "inline", target: "inline-address" }),
    });
    const target = document.createElement("div");
    target.id = "inline-address";
    document.body.appendChild(target);
    let postcodeOptions: DaumPostcodeOptions | undefined;
    const Postcode = vi.fn(
      class {
        open = vi.fn();
        embed = vi.fn();
        constructor(options: DaumPostcodeOptions) {
          postcodeOptions = options;
        }
      },
    );
    vi.stubGlobal("daum", { Postcode });

    component.openAddressSearch();
    postcodeOptions?.onresize?.({ width: 400, height: 600 });

    expect(target.style.height).toBe("600px");
  });
});
