import type {RenderLines} from "./RenderLines.js";

export interface VirtualScrollOptions {
    totalLineCount: number;
    estimatedLineHeightPixels: number;        // fixed or best guess
    viewportOverscanLineCount?: number;       // extra lines above/below viewport
    renderLines: RenderLines;                  // must return one HTML string for the requested range
}