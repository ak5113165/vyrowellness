import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Eye, RotateCcw, RotateCw, X } from "lucide-react";
import { boxFaces, buildSauna, cabinDims, visibleBoxes } from "@/lib/sauna-3d";
import type { SaunaConfig } from "@/lib/sauna-3d";

// Interactive, illustrative 3D preview of a Build Your Sauna set-up.
// Drawn with CSS 3D transforms: no WebGL, nothing extra to download.

const START = { yaw: -28, pitch: -14 };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Sauna3DViewer({ config }: { config: SaunaConfig }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [yaw, setYaw] = useState(START.yaw);
  const [pitch, setPitch] = useState(START.pitch);
  const [dragging, setDragging] = useState(false);
  // Closed timber fronts start outside; "See Inside" removes the front and roof.
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dims = cabinDims(config);
  const scale = size.w && size.h ? (Math.min(size.w, size.h * 1.05) * 0.56) / Math.max(dims.w, dims.h, dims.d) : 0;

  const faces = useMemo(() => {
    if (!scale) return [];
    return visibleBoxes(buildSauna(config), inside).flatMap((b) =>
      boxFaces(b, scale).map((f) => ({ ...f, id: `${b.id}-${f.key}`, box: b })),
    );
  }, [config, inside, scale]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, yaw, pitch };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setYaw(d.yaw + (e.clientX - d.x) * 0.4);
    if (e.pointerType !== "touch") setPitch(clamp(d.pitch - (e.clientY - d.y) * 0.25, -40, -2));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setYaw((y) => y - 15);
    else if (e.key === "ArrowRight") setYaw((y) => y + 15);
    else if (e.key === "ArrowUp") setPitch((p) => clamp(p - 5, -40, -2));
    else if (e.key === "ArrowDown") setPitch((p) => clamp(p + 5, -40, -2));
    else return;
    e.preventDefault();
  };

  const sceneStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "56%",
    transformStyle: "preserve-3d",
    transform: `rotateX(${pitch}deg) rotateY(${yaw}deg) translateY(${(dims.h * scale) / 2}px)`,
    transition: dragging ? "none" : "transform 0.5s ease",
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-sm border border-border bg-card/90 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-foreground backdrop-blur transition-colors hover:border-foreground/50";

  return (
    <div className="flex h-full flex-col">
      <div
        ref={stageRef}
        role="img"
        aria-label="Interactive 3D preview of your sauna. Drag, or use the arrow keys, to turn it."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative min-h-[300px] flex-1 cursor-grab touch-pan-y select-none overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#fbf8f3,#e7dfd2)] outline-none focus-visible:ring-2 focus-visible:ring-bronze active:cursor-grabbing"
        style={{ perspective: "1300px" }}
      >
        {scale > 0 && (
          <div style={sceneStyle} aria-hidden>
            {/* Soft floor shadow */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: `${dims.w * scale * 1.5}px`,
                height: `${dims.d * scale * 1.6}px`,
                transformOrigin: "0 0",
                transform: "rotateX(90deg) translate(-50%, -50%)",
                background: "radial-gradient(closest-side, rgba(60, 40, 20, 0.28), transparent)",
              }}
            />
            {faces.map((f) => (
              <div
                key={f.id}
                style={{
                  ...f.style,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(f.text
                    ? {
                        fontSize: `${Math.max(5, f.box.w * scale * 0.22)}px`,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: f.box.color.startsWith("rgba") ? "rgba(255,255,255,0.85)" : "#3b2a14",
                      }
                    : {}),
                }}
              >
                {f.text}
              </div>
            ))}
          </div>
        )}
        <p className="pointer-events-none absolute left-3 top-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Drag to turn
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-card px-3 py-3">
        <button type="button" className={btn} onClick={() => setYaw((y) => y - 45)} aria-label="Turn left">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button type="button" className={btn} onClick={() => setYaw((y) => y + 45)} aria-label="Turn right">
          <RotateCw className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setYaw(START.yaw);
            setPitch(START.pitch);
          }}
        >
          Reset View
        </button>
        <button type="button" className={btn} aria-pressed={inside} onClick={() => setInside((v) => !v)}>
          <Eye className="h-3.5 w-3.5" aria-hidden /> {inside ? "Show Outside" : "See Inside"}
        </button>
      </div>
    </div>
  );
}

export function Sauna3DDialog({
  open,
  onOpenChange,
  config,
  title,
  rows,
  onEnquire,
  whatsappHref,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SaunaConfig | null;
  title: string;
  rows: { label: string; value: string }[];
  onEnquire: () => void;
  whatsappHref: string | null;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-2 z-50 grid overflow-y-auto border border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:inset-6 lg:left-1/2 lg:top-1/2 lg:h-[min(760px,90svh)] lg:w-[min(1180px,94vw)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:grid-cols-[1fr_320px] lg:overflow-hidden">
          <div className="flex min-h-[60svh] flex-col lg:min-h-0">
            {config && <Sauna3DViewer config={config} />}
          </div>
          <aside className="flex flex-col border-t border-border bg-card p-6 lg:border-l lg:border-t-0">
            <p className="eyebrow text-bronze-strong">3D Preview</p>
            <DialogPrimitive.Title className="mt-2 font-display text-3xl font-medium">{title}</DialogPrimitive.Title>
            <dl className="mt-5 space-y-3 text-sm">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="eyebrow text-bronze-strong">{r.label}</dt>
                  <dd className="mt-0.5">{r.value}</dd>
                </div>
              ))}
            </dl>
            <DialogPrimitive.Description className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Shown at the cabin's standard size; benches, heater placement and other details are illustrative. Your
              consultant confirms the layout and finishes for your space in your quote.
            </DialogPrimitive.Description>
            <div className="mt-6 space-y-3 lg:mt-auto">
              <button
                type="button"
                onClick={onEnquire}
                className="w-full rounded-sm bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Enquire About This Setup
              </button>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[12px] uppercase tracking-[0.16em] underline underline-offset-4 hover:text-bronze-strong"
                >
                  Send on WhatsApp
                </a>
              )}
            </div>
          </aside>
          <DialogPrimitive.Close
            className="absolute right-3 top-3 z-10 rounded-full border border-border bg-card p-1.5 text-foreground/80 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
            aria-label="Close 3D preview"
          >
            <X className="h-5 w-5" aria-hidden />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
