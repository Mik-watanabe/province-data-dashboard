"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PROVINCE_MAP } from "@/app/lib/data/province";

type CanadaMapProps = {
  onProvinceHover?: (province: string | null) => void;
  highlightedProvinceCode?: string;
  maxWidthClassName?: string;
  showHoverHint?: boolean;
};

export default function CanadaMap({
  onProvinceHover,
  highlightedProvinceCode,
  maxWidthClassName = "max-w-2xl",
  showHoverHint = true,
}: CanadaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [navigatingToCode, setNavigatingToCode] = useState<string | null>(null);

  /** Overlay until URL matches destination — avoids setState in an effect on pathname change. */
  const showNavigatingOverlay =
    navigatingToCode !== null &&
    pathname !== `/province/${navigatingToCode}`;

  const selectedProvinceName =
    highlightedProvinceCode && PROVINCE_MAP[highlightedProvinceCode]
      ? PROVINCE_MAP[highlightedProvinceCode]
      : null;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const controller = new AbortController();

    fetch("/canada-map.svg", { signal: controller.signal })
      .then((res) => res.text())
      .then((svgText) => {
        if (cancelled) return;
        container.innerHTML = svgText;

        const svg = container.querySelector("svg");
        if (!svg) return;

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
        svg.style.touchAction = "none";

        const provinceCodes = Object.keys(PROVINCE_MAP);

        svg.setAttribute("role", "img");
        svg.setAttribute(
          "aria-label",
          "Interactive map of Canada provinces and territories",
        );

        const baseViewBoxAttr = svg.getAttribute("viewBox");
        let [baseX, baseY, baseWidth, baseHeight] = baseViewBoxAttr
          ? baseViewBoxAttr.split(/\s+/).map(Number)
          : [0, 0, 1000, 700];

        if (![baseX, baseY, baseWidth, baseHeight].every(Number.isFinite)) {
          baseX = 0;
          baseY = 0;
          baseWidth = 1000;
          baseHeight = 700;
        }

        const setViewBox = (
          x: number,
          y: number,
          width: number,
          height: number,
        ) => {
          const maxX = baseX + baseWidth - width;
          const maxY = baseY + baseHeight - height;
          const clampedX = Math.min(Math.max(x, baseX), maxX);
          const clampedY = Math.min(Math.max(y, baseY), maxY);
          svg.setAttribute(
            "viewBox",
            `${clampedX} ${clampedY} ${width} ${height}`,
          );
          return { x: clampedX, y: clampedY, width, height };
        };

        let currentView = {
          x: baseX,
          y: baseY,
          width: baseWidth,
          height: baseHeight,
        };
        if (highlightedProvinceCode) {
          const activeGroup = svg.querySelector(
            `#${highlightedProvinceCode}`,
          ) as SVGGElement | null;
          if (activeGroup) {
            const bbox = activeGroup.getBBox();
            const zoom = 2.4;
            const targetWidth = baseWidth / zoom;
            const targetHeight = baseHeight / zoom;
            const targetX = bbox.x + bbox.width / 2 - targetWidth / 2;
            const targetY = bbox.y + bbox.height / 2 - targetHeight / 2;
            currentView = setViewBox(
              targetX,
              targetY,
              targetWidth,
              targetHeight,
            );
          }
        }

        let dragging = false;
        let startClientX = 0;
        let startClientY = 0;
        let startViewX = currentView.x;
        let startViewY = currentView.y;

        const isProvinceTarget = (target: EventTarget | null): boolean => {
          const el = target as Element | null;
          if (!el || el === svg) return false;
          const g = el.closest("g[id]");
          const id = g?.getAttribute("id");
          return id !== null && id !== undefined && provinceCodes.includes(id);
        };

        const onPointerDown = (e: PointerEvent) => {
          if (isProvinceTarget(e.target)) return;

          dragging = true;
          startClientX = e.clientX;
          startClientY = e.clientY;
          startViewX = currentView.x;
          startViewY = currentView.y;
          svg.style.cursor = "grabbing";
          svg.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (!dragging) return;
          const rect = svg.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const dx = e.clientX - startClientX;
          const dy = e.clientY - startClientY;
          const unitsPerPixelX = currentView.width / rect.width;
          const unitsPerPixelY = currentView.height / rect.height;
          const nextX = startViewX - dx * unitsPerPixelX;
          const nextY = startViewY - dy * unitsPerPixelY;
          currentView = setViewBox(
            nextX,
            nextY,
            currentView.width,
            currentView.height,
          );
        };

        const onPointerUp = (e: PointerEvent) => {
          dragging = false;
          svg.style.cursor = "grab";
          try {
            svg.releasePointerCapture(e.pointerId);
          } catch {
            // ignore if pointer capture was not active
          }
        };

        svg.style.cursor = highlightedProvinceCode ? "grab" : "default";
        if (highlightedProvinceCode) {
          svg.addEventListener("pointerdown", onPointerDown);
          svg.addEventListener("pointermove", onPointerMove);
          svg.addEventListener("pointerup", onPointerUp);
          svg.addEventListener("pointercancel", onPointerUp);
          svg.addEventListener("pointerleave", onPointerUp);
        }

        provinceCodes.forEach((code) => {
          const group = svg.querySelector(`#${code}`);
          if (!group) return;

          const el = group as SVGGElement;
          const name = PROVINCE_MAP[code];
          const isActive = highlightedProvinceCode === code;

          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", `${name} — click to view details`);
          el.style.cursor = "pointer";
          el.style.transition = "fill 0.2s ease";
          el.style.outline = "none";
          if (isActive) {
            el.style.fill = "#4a90c4";
          }

          const highlight = () => {
            el.style.fill = "#4a90c4";
            setHoveredProvince(name);
            onProvinceHover?.(name);
          };

          const unhighlight = () => {
            el.style.fill = isActive ? "#4a90c4" : "";
            setHoveredProvince(null);
            onProvinceHover?.(null);
          };

          el.addEventListener("mouseenter", highlight);
          el.addEventListener("mouseleave", unhighlight);
          el.addEventListener("focus", highlight);
          el.addEventListener("blur", unhighlight);

          const goToProvince = () => {
            const path = window.location.pathname;
            const match = path.match(/^\/province\/([^/]+)/);
            const currentProvinceKey = match?.[1];
            if (currentProvinceKey === code) return;
            setNavigatingToCode(code);
            router.push(`/province/${code}`);
          };

          el.addEventListener("click", goToProvince);

          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToProvince();
            }
          });
        });
      })
      .catch((err: unknown) => {
        const name =
          err && typeof err === "object" && "name" in err
            ? String((err as { name: string }).name)
            : "";
        if (name === "AbortError") return;
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [router, onProvinceHover, highlightedProvinceCode]);

  const navigatingName =
    navigatingToCode && PROVINCE_MAP[navigatingToCode]
      ? PROVINCE_MAP[navigatingToCode]
      : null;

  return (
    <div>
      <div
        className={`relative mx-auto h-[420px] overflow-hidden rounded ${maxWidthClassName}`}
        aria-busy={showNavigatingOverlay}
      >
        <div ref={containerRef} className="h-full w-full" />
        {showNavigatingOverlay && navigatingName ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded bg-card-bg/85 backdrop-blur-[2px]"
            aria-live="polite"
            aria-label={`Loading ${navigatingName}`}
          >
            <span
              className="h-9 w-9 shrink-0 animate-spin rounded-full border-2 border-card-border border-t-[#4a90c4]"
              aria-hidden
            />
            <span className="px-4 text-center text-sm font-medium text-foreground">
              Opening {navigatingName}…
            </span>
          </div>
        ) : null}
      </div>
      {showHoverHint ? (
        <p className="mt-2 text-center text-base text-muted font-bold h-5">
          {hoveredProvince ??
            selectedProvinceName ??
            "Hover over a province to see its name"}
        </p>
      ) : selectedProvinceName ? (
        <p className="mt-2 text-center text-base text-muted font-bold h-5">
          {selectedProvinceName}
        </p>
      ) : null}
    </div>
  );
}
