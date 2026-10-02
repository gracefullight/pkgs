import { DOCUMENT, isPlatformBrowser, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  PLATFORM_ID,
} from "@angular/core";
import type {
  DaumAddressOptions,
  DaumAddressResult,
  DaumPostcodeData,
} from "@/lib/daum-address.interface";
import {
  calculateLayerPosition,
  getLayerPositionDefaults,
  transformPostcodeData,
} from "@/lib/daum-address.utils";
import { loadDaumPostcodeScript } from "@/lib/daum-postcode-script";

/**
 * Angular component for Daum Postcode address search
 *
 * @example
 * ```html
 * <ng-daum-address
 *   [options]="{ class: 'btn-primary' }"
 *   (result)="onAddressSelected($event)"
 * />
 * ```
 */
@Component({
  selector: "ng-daum-address",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #addressButton
      type="button"
      [ngClass]="buttonClasses()"
      (click)="openAddressSearch()"
    >
      {{ buttonText() }}
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  imports: [NgClass],
})
export class NgDaumAddressComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Configuration options for the address search
   */
  readonly options = input<DaumAddressOptions>({});

  /**
   * Emits when an address is selected
   */
  readonly result = output<DaumAddressResult>();

  protected readonly buttonClasses = computed(() => this.options().class ?? "");
  protected readonly buttonText = computed(() => this.options().buttonText ?? "주소 검색");

  private scriptLoading = false;

  /**
   * Opens the Daum Postcode address search
   */
  openAddressSearch(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scriptLoading) return;
    if (this.document.defaultView?.daum?.Postcode) {
      this.executePostcode();
      return;
    }
    this.scriptLoading = true;
    void loadDaumPostcodeScript(this.document)
      .then(() => {
        if (!this.destroyRef.destroyed) this.executePostcode();
      })
      .catch((error: unknown) => {
        console.error("[ng-daum-address] Failed to load Daum Postcode script", error);
      })
      .finally(() => {
        this.scriptLoading = false;
      });
  }

  private executePostcode(): void {
    const opts = this.options();
    const debug = opts.debug ?? false;

    if (debug) {
      console.log("[ng-daum-address] Options:", opts);
    }

    const postcode = new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        this.handleComplete(data);
      },
      onresize: (size) => {
        if ((opts.type === "layer" || opts.type === "inline") && opts.target) {
          const layer = this.document.getElementById(opts.target);
          if (layer) {
            layer.style.height = `${size.height}px`;
          }
        }
      },
      onclose: (state) => {
        if (debug) {
          console.log("[ng-daum-address] Close state:", state);
        }
        if (opts.type === "layer" && opts.target) {
          const layer = this.document.getElementById(opts.target);
          if (layer) {
            layer.style.display = "none";
          }
        }
      },
    });

    switch (opts.type) {
      case "layer":
        this.openLayerMode(postcode, opts);
        break;
      case "inline":
        this.openInlineMode(postcode, opts);
        break;
      default:
        postcode.open();
    }
  }

  private openLayerMode(
    postcode: ReturnType<typeof window.daum.Postcode.prototype.constructor>,
    opts: DaumAddressOptions,
  ): void {
    if (!opts.target) {
      console.error("[ng-daum-address] Layer mode requires a target element ID");
      return;
    }

    const layer = this.document.getElementById(opts.target);
    if (!layer) {
      console.error(`[ng-daum-address] Target element "${opts.target}" not found`);
      return;
    }

    const { width, height, border } = getLayerPositionDefaults(opts);
    const position = calculateLayerPosition(
      window.innerWidth,
      window.innerHeight,
      width,
      height,
      border,
    );

    layer.style.display = "block";
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
    layer.style.border = `${border}px solid`;
    layer.style.left = `${position.left}px`;
    layer.style.top = `${position.top}px`;

    postcode.embed(layer);

    // Setup close button if exists
    const closeBtn = layer.querySelector("#btnCloseLayer") as HTMLElement | null;
    if (closeBtn) {
      closeBtn.onclick = () => {
        layer.style.display = "none";
      };
    }
  }

  private openInlineMode(
    postcode: ReturnType<typeof window.daum.Postcode.prototype.constructor>,
    opts: DaumAddressOptions,
  ): void {
    if (!opts.target) {
      console.error("[ng-daum-address] Inline mode requires a target element ID");
      return;
    }

    const wrap = this.document.getElementById(opts.target);
    if (!wrap) {
      console.error(`[ng-daum-address] Target element "${opts.target}" not found`);
      return;
    }

    wrap.style.display = "block";
    wrap.style.height = "300px";

    postcode.embed(wrap);

    // Setup fold button if exists
    const foldBtn = wrap.querySelector("#btnFoldWrap") as HTMLElement | null;
    if (foldBtn) {
      foldBtn.onclick = () => {
        wrap.style.display = "none";
      };
    }
  }

  private handleComplete(data: DaumPostcodeData): void {
    const opts = this.options();

    if (opts.debug) {
      console.log("[ng-daum-address] Raw data:", data);
    }

    const result = transformPostcodeData(data);

    if (opts.debug) {
      console.log("[ng-daum-address] Result:", result);
    }

    // Hide layer/inline container if applicable
    if ((opts.type === "layer" || opts.type === "inline") && opts.target) {
      const targetEl = this.document.getElementById(opts.target);
      if (targetEl) {
        targetEl.style.display = "none";
      }
    }

    this.result.emit(result);
  }
}
