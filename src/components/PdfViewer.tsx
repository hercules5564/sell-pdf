"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsAny: any = pdfjsLib;

type Props = {
  pdfUrl: string;
  watermarkText: string;
};

function drawWatermark(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = Math.max(14, Math.floor(Math.min(width, height) / 28));
  ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;

  // rotate around center
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-25 * Math.PI) / 180);

  // repeat pattern
  const stepX = Math.max(180, Math.floor(width / 1.7));
  const stepY = Math.max(140, Math.floor(height / 2.2));

  for (let y = -height; y <= height; y += stepY) {
    for (let x = -width; x <= width; x += stepX) {
      ctx.fillText(text, x, y);
    }
  }

  ctx.restore();
}

export function PdfViewer({ pdfUrl, watermarkText }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.25);
  const [isLoading, setIsLoading] = useState(true);

  const safeWatermark = useMemo(() => watermarkText.trim() || "WATERMARK", [watermarkText]);

  useEffect(() => {
    // Worker setup for bundlers
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    pdfjsAny.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url
    ).toString();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    pdfjsAny
      .getDocument({ url: pdfUrl, withCredentials: false })
      .promise.then((loaded: PDFDocumentProxy) => {
        if (cancelled) return;
        setDoc(loaded);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load PDF");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !doc) return;

    let cancelled = false;
    el.innerHTML = "";

    const render = async () => {
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
        if (cancelled) return;
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const wrapper = document.createElement("div");
        wrapper.className =
          "relative mx-auto my-4 w-fit overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm";

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.className = "block select-none";
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D | null;
        if (!ctx) continue;

        await page.render({
          // `as never` to satisfy slightly stricter RenderParameters typing in this setup.
          canvasContext: ctx as never,
          viewport,
          canvas,
        }).promise;
        if (cancelled) return;

        // watermark AFTER rendering page
        drawWatermark(canvas, safeWatermark);

        // page footer
        const footer = document.createElement("div");
        footer.className =
          "pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[11px] text-white";
        footer.textContent = `Page ${pageNumber} of ${doc.numPages}`;
        wrapper.appendChild(footer);

        el.appendChild(wrapper);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [doc, scale, safeWatermark]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Block common save/print shortcuts
      if ((e.ctrlKey || e.metaKey) && (key === "p" || key === "s")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true } as never);
  }, []);

  return (
    <div
      className="select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-card-border bg-muted-bg px-4 py-3">
        <div className="text-sm font-medium text-muted">
          View-only mode · Watermarked
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded-lg border-2 border-card-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
            onClick={() => setScale((s) => Math.max(0.75, Math.round((s - 0.1) * 100) / 100))}
          >
            –
          </button>
          <div className="min-w-20 text-center text-sm tabular-nums font-medium text-foreground">
            {Math.round(scale * 100)}%
          </div>
          <button
            type="button"
            className="h-9 rounded-lg border-2 border-card-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
            onClick={() => setScale((s) => Math.min(2.0, Math.round((s + 0.1) * 100) / 100))}
          >
            +
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border-2 border-card-border bg-muted-bg p-10 text-center text-sm font-medium text-muted">
          Loading PDF…
        </div>
      ) : error ? (
        <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-10 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  );
}

