import type {RenderLines} from "./RenderLines.js";
import type {VirtualScrollOptions} from "./VirtualScrollOptions.js";

export class VirtualScroll {
    private static readonly MAX_SPACER_CHUNK_HEIGHT_PIXELS = 1_000_000;
    private readonly containerElement: HTMLElement;
    private readonly contentWrapperElement: HTMLElement;
    private readonly spacerElement: HTMLSpanElement;
    private readonly renderLayerElement: HTMLSpanElement;

    private totalLineCount: number;
    private estimatedLineHeightPixels: number;
    private viewportOverscanLineCount: number;
    private renderLines: RenderLines;

    private pendingAnimationFrameId: number | null = null;
    private lastRenderedStartLineIndex = -1;
    private lastRenderedEndLineIndexExclusive = -1;

    constructor(containerElement: HTMLElement, options: VirtualScrollOptions) {
        this.containerElement = containerElement;
        this.ensureContainerStyles();

        this.totalLineCount = options.totalLineCount;
        this.estimatedLineHeightPixels = Math.max(1, options.estimatedLineHeightPixels);
        this.viewportOverscanLineCount = Math.max(0, options.viewportOverscanLineCount ?? 20);
        this.renderLines = options.renderLines;

        this.spacerElement = document.createElement("span") as HTMLSpanElement;
        this.spacerElement.style.display = "block";
        this.applySpacerHeight();

        const existingCodeElement = this.containerElement.querySelector("code") as HTMLElement | null;

        this.contentWrapperElement = existingCodeElement ?? (document.createElement("code"));
        this.contentWrapperElement.style.position = "relative";
        this.contentWrapperElement.style.display = "block";
        this.contentWrapperElement.style.whiteSpace = "pre";
        this.contentWrapperElement.style.overflowX = "hidden";
        this.contentWrapperElement.style.width = "100%";

        if (!existingCodeElement) {
            this.containerElement.appendChild(this.contentWrapperElement);
        }

        this.renderLayerElement = document.createElement("span");
        this.renderLayerElement.style.position = "absolute";
        this.renderLayerElement.style.left = "0";
        this.renderLayerElement.style.right = "0";
        this.renderLayerElement.style.top = "0";
        this.renderLayerElement.style.willChange = "transform";
        this.renderLayerElement.style.display = "block";
        this.contentWrapperElement.append(this.spacerElement, this.renderLayerElement);

        this.spacerElement.style.position = "relative";
        this.spacerElement.style.pointerEvents = "none";
        this.spacerElement.style.display = "block";

        this.containerElement.addEventListener("scroll", this.onScroll, {passive: true});
        window.addEventListener("resize", this.onResize, {passive: true});

        this.requestRender();
    }

    public updateTotalLineCount(newTotalLineCount: number): void {
        this.totalLineCount = Math.max(0, newTotalLineCount);
        this.applySpacerHeight();
        this.requestRender();
    }

    public updateEstimatedLineHeightPixels(newEstimatedLineHeightPixels: number): void {
        this.estimatedLineHeightPixels = Math.max(1, newEstimatedLineHeightPixels);
        this.applySpacerHeight();
        this.requestRender();
    }

    public updateRenderLines(newRenderLines: RenderLines): void {
        this.renderLines = newRenderLines;
        this.requestRender(true);
    }

    public scrollToLine(targetLineIndex: number, align: "start" | "center" | "end" = "start"): void {
        const clampedLineIndex = Math.max(0, Math.min(targetLineIndex, this.totalLineCount - 1));
        const targetTopPixels = clampedLineIndex * this.estimatedLineHeightPixels;
        const viewportHeightPixels = this.containerElement.clientHeight;

        let scrollTopPixels = targetTopPixels;
        if (align === "center") {
            scrollTopPixels = targetTopPixels - Math.max(0, Math.floor(viewportHeightPixels / 2));
        } else if (align === "end") {
            scrollTopPixels = targetTopPixels - Math.max(0, viewportHeightPixels - this.estimatedLineHeightPixels);
        }
        this.containerElement.scrollTop = Math.max(0, scrollTopPixels);
        this.requestRender();
    }

    public destroy(): void {
        this.containerElement.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onResize);
        if (this.pendingAnimationFrameId !== null) {
            cancelAnimationFrame(this.pendingAnimationFrameId);
        }
        this.contentWrapperElement.remove();
        this.spacerElement.remove();
    }

    // ——— internals ———

    private ensureContainerStyles(): void {
        const style = this.containerElement.style;
        if (getComputedStyle(this.containerElement).position === "static") {
            style.position = "relative";
        }
        // helps performance in many cases
        style.contain = "strict";
        style.overflowY = "auto";
        style.overflowX = "hidden";
        style.margin = "0";
        style.padding = "0";
    }

    private applySpacerHeight(): void {
        const totalHeightPixels = Math.max(0, Math.round(this.totalLineCount * this.estimatedLineHeightPixels));
        this.spacerElement.textContent = "";
        this.spacerElement.style.height = "";         // use child blocks to avoid scientific notation and engine limits
        let remaining = totalHeightPixels;
        while (remaining > 0) {
            const chunk = Math.min(remaining, VirtualScroll.MAX_SPACER_CHUNK_HEIGHT_PIXELS);
            const block = document.createElement("div");
            block.style.display = "block";
            block.style.height = `${chunk}px`;
            this.spacerElement.appendChild(block);
            remaining -= chunk;
        }
    }

    private onScroll = (): void => {
        this.requestRender();
    };

    private onResize = (): void => {
        this.requestRender(true);
    };

    private requestRender(force = false): void {
        if (this.pendingAnimationFrameId !== null && !force) {
            return;
        }
        this.pendingAnimationFrameId = requestAnimationFrame(async () => {
            this.pendingAnimationFrameId = null;
            await this.renderIfNeeded();
        });
    }

    private computeDesiredRange(): {
        startLineIndex: number;
        endLineIndexExclusive: number;
        translateYPixels: number;
    } {
        const scrollTopPixels = this.containerElement.scrollTop;
        const viewportHeightPixels = this.containerElement.clientHeight;

        const firstVisibleLineIndex = Math.floor(scrollTopPixels / this.estimatedLineHeightPixels);
        const visibleLineCount = Math.ceil(viewportHeightPixels / this.estimatedLineHeightPixels);

        const startLineIndex = Math.max(
            0,
            firstVisibleLineIndex - this.viewportOverscanLineCount
        );
        const endLineIndexExclusive = Math.min(
            this.totalLineCount,
            firstVisibleLineIndex + visibleLineCount + this.viewportOverscanLineCount
        );

        const translateYPixels = startLineIndex * this.estimatedLineHeightPixels;
        return {startLineIndex, endLineIndexExclusive, translateYPixels};
    }

    private async renderIfNeeded(): Promise<void> {
        if (this.totalLineCount === 0) {
            this.contentWrapperElement.style.transform = "translateY(0px)";
            this.contentWrapperElement.style.overflowX = "hidden";
            this.contentWrapperElement.style.width = "100%";
            this.contentWrapperElement.replaceChildren();
            this.lastRenderedStartLineIndex = -1;
            this.lastRenderedEndLineIndexExclusive = -1;
            return;
        }

        const {startLineIndex, endLineIndexExclusive, translateYPixels} = this.computeDesiredRange();

        if (
            startLineIndex === this.lastRenderedStartLineIndex &&
            endLineIndexExclusive === this.lastRenderedEndLineIndexExclusive
        ) {
            return;
        }

        const fragment = await this.renderLines(startLineIndex, endLineIndexExclusive);
        this.renderLayerElement.style.transform = `translateY(${translateYPixels}px)`;
        this.renderLayerElement.replaceChildren(fragment);

        this.lastRenderedStartLineIndex = startLineIndex;
        this.lastRenderedEndLineIndexExclusive = endLineIndexExclusive;
    }
}