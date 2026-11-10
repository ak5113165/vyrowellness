// Illustrative 3D model of a Haven sauna set-up, drawn with CSS 3D transforms
// (no WebGL library needed). Pure data in, boxes and face styles out, so the
// geometry can be tested without a browser.
//
// IMPORTANT: proportions are illustrative only. Per-cabin dimensions aren't
// confirmed yet; widths follow the midpoint of each size group in
// sauna-catalogue.ts. Never show these numbers to visitors as dimensions.
//
// Coordinates are in centimetres: x across the front (0 = centre), y up from
// the floor, z front-to-back (0 = centre, +z = the front).

export type SaunaSeries = "standard" | "glass-front" | "infrared" | "compact";
export type SaunaSize = "Small" | "Medium" | "Large";
export type HeaterKind = "Floor Heater" | "Tower Heater" | "Wall-Mounted Heater";
export type Finish = "stainless" | "black";

export type SaunaConfig = {
  series: SaunaSeries;
  size: SaunaSize;
  wood: string;
  heater: { kind: HeaterKind; finish: Finish } | null;
  panel: "Button Control" | "Touch Control" | null;
  accessories: { name: string; finish: string }[];
};

/** Parts a cut-away view removes so you can see inside. */
type Part = "shell" | "front" | "roof" | "inside";

export type Box3D = {
  id: string;
  part: Part;
  x: number;
  y: number; // bottom of the box
  z: number;
  w: number;
  h: number;
  d: number;
  color: string;
  /** Glass and other see-through surfaces. */
  glass?: boolean;
  /** Vertical timber boards drawn on the large faces. */
  boards?: boolean;
  /** Soft glow around an exterior item (door window, touch dial). Use only
   *  outside the cabin: a box-shadow can bleed through walls in CSS 3D. */
  glow?: string;
  /** Light painted onto the front face: warm LED under a bench, or the
   *  red-orange of an infrared panel. Stays inside its own face. */
  light?: "led" | "infrared";
  /** Round items (plaques, dials) drawn as discs on the front face. */
  round?: boolean;
  /** Small text printed on the front face (the VYRO plaque). */
  text?: string;
  /** Pattern on the faces: heater stones, tower cage, louvres. */
  pattern?: "stones" | "cage" | "louvres";
};

// Timber colours, chosen to match each wood's description in sauna-catalogue.ts.
export const woodColours: Record<string, string> = {
  Spruce: "#e6cfa6",
  "Thermo Pine": "#9a6a43",
  Hemlock: "#d9b585",
  Cedar: "#c08a55",
  "Red Cedar": "#a05c3b",
  Aspen: "#efe2c6",
  Eucalyptus: "#a9654b",
};

const BLACK = "#222222";
const STAINLESS = "#b9bdc1";
const BRONZE = "#b08a55";
const T = 6; // wall thickness

// Width = midpoint of each size group's range (1.2–1.5 m, 1.4–1.9 m, 1.9–2.2 m).
const widthBySize: Record<SaunaSize, number> = { Small: 135, Medium: 165, Large: 205 };

export function cabinDims(cfg: Pick<SaunaConfig, "series" | "size">): { w: number; d: number; h: number } {
  if (cfg.series === "compact") return { w: 120, d: 105, h: 200 };
  if (cfg.series === "infrared") return { w: 130, d: 105, h: 195 };
  const w = widthBySize[cfg.size];
  if (cfg.series === "glass-front") return { w, d: Math.round(w * 0.78), h: 210 };
  return { w, d: Math.round(w * 0.92), h: 210 };
}

/** Darken (f < 1) or lighten (f > 1) a #rrggbb colour. */
export function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function buildSauna(cfg: SaunaConfig): Box3D[] {
  const wood = woodColours[cfg.wood] ?? woodColours["Spruce"]!;
  const { w: W, d: D, h: H } = cabinDims(cfg);
  const boxes: Box3D[] = [];
  const add = (b: Box3D) => boxes.push(b);

  const left = -W / 2;
  const right = W / 2;
  const back = -D / 2;
  const front = D / 2;
  const base = 5; // plinth height
  const inL = left + T;
  const inR = right - T;
  const inB = back + T;
  const inF = front - T;
  const wallH = H - base;

  // Plinth and floor
  add({ id: "plinth", part: "shell", x: 0, y: 0, z: 0, w: W - 4, h: base, d: D - 4, color: "#4a4038" });
  add({ id: "floor", part: "inside", x: 0, y: base, z: 0, w: W - 2 * T, h: 1, d: D - 2 * T, color: shade(wood, 0.8) });

  // Shell: back and side walls
  add({ id: "wall-back", part: "shell", x: 0, y: base, z: back + T / 2, w: W, h: wallH, d: T, color: wood, boards: true });
  add({ id: "wall-left", part: "shell", x: left + T / 2, y: base, z: 0, w: T, h: wallH, d: D - 2 * T, color: wood, boards: true });
  add({ id: "wall-right", part: "shell", x: right - T / 2, y: base, z: 0, w: T, h: wallH, d: D - 2 * T, color: wood, boards: true });

  // Roof: Classic cabins wear a black cap, as in the product renders
  add({ id: "roof", part: "roof", x: 0, y: H - T, z: 0, w: W, h: T, d: D, color: wood });
  if (cfg.series === "standard") {
    add({ id: "roof-cap", part: "roof", x: 0, y: H, z: 0, w: W + 3, h: 3, d: D + 3, color: BLACK });
  }

  // ------------------------------------------------------------ front ----
  const doorH = Math.min(185, wallH - 15);
  if (cfg.series === "glass-front") {
    // Full glass façade in a black frame, with mullions every ~60 cm.
    add({ id: "glass", part: "front", x: 0, y: base, z: front - 2, w: W - 4, h: wallH, d: 1, color: "rgba(205, 222, 228, 0.18)", glass: true });
    const rail = 4;
    add({ id: "frame-top", part: "front", x: 0, y: H - rail, z: front - 2, w: W, h: rail, d: 4, color: BLACK });
    add({ id: "frame-bottom", part: "front", x: 0, y: base, z: front - 2, w: W, h: rail, d: 4, color: BLACK });
    const panes = Math.max(2, Math.round(W / 60));
    for (let i = 0; i <= panes; i++) {
      const x = left + (W * i) / panes;
      const px = i === 0 ? x + rail / 2 : i === panes ? x - rail / 2 : x;
      add({ id: `frame-v${i}`, part: "front", x: px, y: base, z: front - 2, w: rail, h: wallH, d: 4, color: BLACK });
    }
    // Door is the centre pane; its handle sits on the left stile.
    const doorX = left + (W * Math.floor(panes / 2)) / panes + 8;
    add({ id: "handle", part: "front", x: doorX, y: base + 80, z: front + 2, w: 2.5, h: 45, d: 3, color: BLACK });
    // Black frame around the side edges too
    add({ id: "frame-corner-l", part: "shell", x: left + 2, y: base, z: back + 2, w: 4, h: wallH, d: 4, color: BLACK });
    add({ id: "frame-corner-r", part: "shell", x: right - 2, y: base, z: back + 2, w: 4, h: wallH, d: 4, color: BLACK });
  } else {
    // Timber front with a door; glass door on Infrared and Compact.
    const glassDoor = cfg.series !== "standard";
    const doorW = cfg.series === "infrared" ? W - 34 : cfg.series === "compact" ? 62 : 68;
    const doorCx = cfg.series === "standard" ? right - T - 16 - doorW / 2 : 0;
    const dL = doorCx - doorW / 2;
    const dR = doorCx + doorW / 2;
    const fz = front - T / 2;
    if (dL - left > 0.5) add({ id: "front-l", part: "front", x: (left + dL) / 2, y: base, z: fz, w: dL - left, h: wallH, d: T, color: wood, boards: true });
    if (right - dR > 0.5) add({ id: "front-r", part: "front", x: (dR + right) / 2, y: base, z: fz, w: right - dR, h: wallH, d: T, color: wood, boards: true });
    add({ id: "front-top", part: "front", x: doorCx, y: base + doorH, z: fz, w: doorW, h: wallH - doorH, d: T, color: wood, boards: true });

    if (glassDoor) {
      add({ id: "door-glass", part: "front", x: doorCx, y: base, z: front - 2, w: doorW, h: doorH, d: 1, color: "rgba(205, 222, 228, 0.2)", glass: true });
      const r = 3.5;
      add({ id: "door-frame-l", part: "front", x: dL + r / 2, y: base, z: front - 1, w: r, h: doorH, d: 3, color: BLACK });
      add({ id: "door-frame-r", part: "front", x: dR - r / 2, y: base, z: front - 1, w: r, h: doorH, d: 3, color: BLACK });
      add({ id: "door-frame-t", part: "front", x: doorCx, y: base + doorH - r, z: front - 1, w: doorW, h: r, d: 3, color: BLACK });
      add({ id: "door-frame-b", part: "front", x: doorCx, y: base, z: front - 1, w: doorW, h: r, d: 3, color: BLACK });
      add({ id: "handle", part: "front", x: dR - 10, y: base + 75, z: front + 2, w: 2.5, h: 45, d: 3, color: BLACK });
    } else {
      // Solid timber door with a tall glass strip glowing warm from inside.
      add({ id: "door", part: "front", x: doorCx, y: base, z: front - T / 2 + 0.5, w: doorW, h: doorH, d: T, color: shade(wood, 1.04), boards: true });
      add({ id: "door-window", part: "front", x: doorCx + 4, y: base + 28, z: front + 0.6, w: 18, h: 135, d: 0.6, color: "#d9a35c", glow: "rgba(255, 180, 90, 0.35)" });
      add({ id: "handle", part: "front", x: doorCx - doorW / 2 + 12, y: base + 70, z: front + 2.5, w: 2.5, h: 50, d: 3, color: BLACK });
    }
  }

  // VYRO plaque
  if (cfg.series === "glass-front") {
    add({ id: "plaque", part: "inside", x: 0, y: base + 135, z: inB + 0.6, w: 30, h: 30, d: 0.6, color: "rgba(255,255,255,0.0)", round: true, text: "VYRO" });
  } else if (cfg.series === "standard") {
    add({ id: "plaque", part: "front", x: left + (W - 68 - 16 - T) * 0.45, y: base + 145, z: front + 0.6, w: 24, h: 24, d: 1, color: BRONZE, round: true, text: "VYRO" });
  } else {
    add({ id: "plaque", part: "front", x: 0, y: H - 16, z: front + 0.6, w: 13, h: 13, d: 1, color: BRONZE, round: true, text: "VYRO" });
  }

  // ----------------------------------------------------------- inside ----
  const benchWood = shade(wood, 1.06);
  const inW = inR - inL;
  const inD = inF - inB;
  if (cfg.series === "infrared") {
    // One bench along the back, infrared panels on the back and side walls.
    add({ id: "bench", part: "inside", x: 0, y: base + 42, z: inB + 24, w: inW, h: 5, d: 46, color: benchWood });
    add({ id: "bench-front", part: "inside", x: 0, y: base, z: inB + 46, w: inW, h: 42, d: 2, color: shade(wood, 0.95), boards: true });
    for (const [i, x] of [-inW / 4, inW / 4].entries()) {
      add({ id: `ir-back-${i}`, part: "inside", x, y: base + 55, z: inB + 1, w: inW / 2 - 12, h: 100, d: 1.5, color: "#3a2a24", light: "infrared" });
    }
    add({ id: "ir-left", part: "inside", x: inL + 1, y: base + 20, z: inB + 50, w: 1.5, h: 40, d: 30, color: "#3a2a24", light: "infrared" });
    add({ id: "ir-right", part: "inside", x: inR - 1, y: base + 20, z: inB + 50, w: 1.5, h: 40, d: 30, color: "#3a2a24", light: "infrared" });
  } else {
    // Upper and lower benches with warm LED strips, and a backrest.
    const upperD = Math.min(52, inD * 0.42);
    const lowerD = Math.min(45, inD * 0.3);
    const heaterSpace = cfg.heater && cfg.heater.kind !== "Wall-Mounted Heater" ? 52 : 0;
    add({ id: "bench-upper", part: "inside", x: 0, y: base + 86, z: inB + upperD / 2, w: inW, h: 5, d: upperD, color: benchWood });
    add({ id: "riser-upper", part: "inside", x: 0, y: base + 45, z: inB + upperD - 1, w: inW, h: 41, d: 2, color: shade(wood, 0.95), boards: true, light: "led" });
    const lowerL = inL + heaterSpace;
    const lw = inR - lowerL;
    if (lw > 30) {
      add({ id: "bench-lower", part: "inside", x: (lowerL + inR) / 2, y: base + 44, z: inB + upperD + lowerD / 2, w: lw, h: 5, d: lowerD, color: benchWood });
      add({ id: "riser-lower", part: "inside", x: (lowerL + inR) / 2, y: base, z: inB + upperD + lowerD - 1, w: lw, h: 44, d: 2, color: shade(wood, 0.95), boards: true, light: "led" });
    }
    // Backrest slats over a warm LED wash on the back wall.
    add({ id: "back-light", part: "inside", x: 0, y: base + 95, z: inB + 0.6, w: inW - 2, h: 35, d: 0.5, color: shade(wood, 1.0), light: "led" });
    for (const [i, y] of [118, 134].entries()) {
      add({ id: `backrest-${i}`, part: "inside", x: 0, y: base + y, z: inB + 2, w: inW - 6, h: 8, d: 3, color: shade(wood, 0.9) });
    }
  }

  // ----------------------------------------------------------- heater ----
  if (cfg.heater && cfg.series !== "infrared") {
    const metal = cfg.heater.finish === "black" ? "#2a2a2a" : STAINLESS;
    const hz = inF - 34;
    if (cfg.heater.kind === "Floor Heater") {
      const hx = inL + 26;
      add({ id: "heater", part: "inside", x: hx, y: base + 1, z: hz, w: 40, h: 58, d: 38, color: metal, pattern: "louvres" });
      add({ id: "heater-stones", part: "inside", x: hx, y: base + 59, z: hz, w: 38, h: 9, d: 36, color: "#5f5f5f", pattern: "stones" });
    } else if (cfg.heater.kind === "Tower Heater") {
      const hx = inL + 22;
      add({ id: "heater", part: "inside", x: hx, y: base + 1, z: hz, w: 28, h: 105, d: 28, color: metal, pattern: cfg.heater.finish === "black" ? "louvres" : "cage" });
    } else {
      // Wall-mounted on the left wall, with a stone tray on top.
      const hz2 = inF - 38;
      add({ id: "heater", part: "inside", x: inL + 13, y: base + 62, z: hz2, w: 24, h: 40, d: 44, color: metal });
      add({ id: "heater-stones", part: "inside", x: inL + 13, y: base + 102, z: hz2, w: 22, h: 7, d: 42, color: "#5f5f5f", pattern: "stones" });
    }
  }

  // ----------------------------------------------------- control panel ----
  if (cfg.panel) {
    const touch = cfg.panel === "Touch Control";
    if (cfg.series === "glass-front") {
      // On the right side wall, near the front.
      add({ id: "panel", part: "shell", x: right + 0.8, y: base + 135, z: front - 22, w: 1.5, h: 20, d: 12, color: "#151515" });
      add({ id: "panel-detail", part: "shell", x: right + 1.7, y: base + 142, z: front - 22, w: 0.4, h: touch ? 8 : 4, d: touch ? 8 : 7, color: touch ? "#d38b3a" : "#e6e6e6", round: touch, ...(touch ? { glow: "rgba(230, 150, 60, 0.6)" } : {}) });
    } else {
      // On the front, beside the door.
      const px = cfg.series === "standard" ? right - T - 16 - 68 - 12 : left + 9;
      add({ id: "panel", part: "front", x: px, y: base + 110, z: front + 0.8, w: 12, h: 20, d: 1.5, color: "#151515" });
      add({ id: "panel-detail", part: "front", x: px, y: base + 117, z: front + 1.7, w: touch ? 8 : 7, h: touch ? 8 : 4, d: 0.4, color: touch ? "#d38b3a" : "#e6e6e6", round: touch, ...(touch ? { glow: "rgba(230, 150, 60, 0.6)" } : {}) });
    }
  }

  // ------------------------------------------------------- accessories ----
  if (cfg.accessories.length && cfg.series !== "infrared") {
    const first = cfg.accessories[0]!;
    const black = first.finish.startsWith("Black");
    const bucketColour = black ? "#1d1d1d" : woodColours["Spruce"]!;
    const benchTopY = base + 91;
    const bx = inR - 22;
    add({ id: "bucket", part: "inside", x: bx, y: benchTopY, z: inB + 26, w: 20, h: 18, d: 20, color: bucketColour, round: false });
    add({ id: "towel", part: "inside", x: 0, y: benchTopY, z: inB + 26, w: 46, h: 3, d: 30, color: black ? "#2b2b2b" : "#e9e5dc" });
    if (cfg.accessories.some((a) => a.name !== "Ritual Classic")) {
      add({ id: "headrest", part: "inside", x: -inW / 4, y: benchTopY, z: inB + 12, w: 32, h: 9, d: 18, color: black && first.finish === "Black" ? "#1d1d1d" : woodColours["Spruce"]! });
    }
  }

  return boxes;
}

// --------------------------------------------------------- CSS faces ----

export type FaceStyle = {
  position: "absolute";
  left: number;
  top: number;
  width: string;
  height: string;
  transformOrigin: string;
  transform: string;
  backfaceVisibility: "hidden";
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
};
export type Face = { key: string; style: FaceStyle; text?: string };

const faceShade = { front: 1, back: 0.82, right: 0.88, left: 0.9, top: 1.08, bottom: 0.6 } as const;

function patternFor(b: Box3D, face: keyof typeof faceShade, scale: number): string | undefined {
  if (b.pattern === "stones" && face === "top") {
    return "radial-gradient(circle at 30% 30%, #8a8a8a 0 22%, transparent 24%), radial-gradient(circle at 70% 60%, #777 0 20%, transparent 22%)";
  }
  if (b.pattern === "stones") return "radial-gradient(circle, #808080 0 30%, transparent 32%)";
  if (b.pattern === "cage" && face !== "top" && face !== "bottom") {
    return "repeating-linear-gradient(90deg, #d4d7da 0 2px, #5d5d5d 2px 9px)";
  }
  if (b.pattern === "louvres" && face !== "top" && face !== "bottom") {
    return "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 8px)";
  }
  if (b.boards && face !== "top" && face !== "bottom") {
    const step = Math.max(4, 11 * scale);
    return `repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0 1px, transparent 1px ${step}px)`;
  }
  return undefined;
}

/**
 * The six faces of a box as absolutely-positioned elements for a CSS 3D
 * scene (transform-style: preserve-3d). `scale` is pixels per centimetre.
 */
export function boxFaces(b: Box3D, scale: number): Face[] {
  const s = scale;
  const cx = b.x * s;
  const cy = -(b.y + b.h / 2) * s; // CSS y points down
  const cz = b.z * s;
  const w = b.w * s;
  const h = b.h * s;
  const d = b.d * s;
  const faces: [keyof typeof faceShade, number, number, string][] = [
    ["front", w, h, `translate3d(${cx}px, ${cy}px, ${cz + d / 2}px)`],
    ["back", w, h, `translate3d(${cx}px, ${cy}px, ${cz - d / 2}px) rotateY(180deg)`],
    ["right", d, h, `translate3d(${cx + w / 2}px, ${cy}px, ${cz}px) rotateY(90deg)`],
    ["left", d, h, `translate3d(${cx - w / 2}px, ${cy}px, ${cz}px) rotateY(-90deg)`],
    ["top", w, d, `translate3d(${cx}px, ${cy - h / 2}px, ${cz}px) rotateX(90deg)`],
    ["bottom", w, d, `translate3d(${cx}px, ${cy + h / 2}px, ${cz}px) rotateX(-90deg)`],
  ];
  return faces.map(([face, fw, fh, place]) => {
    const style: FaceStyle = {
      position: "absolute",
      left: 0,
      top: 0,
      width: `${fw}px`,
      height: `${fh}px`,
      transformOrigin: "0 0",
      transform: `${place} translate(-50%, -50%)`,
      backfaceVisibility: "hidden",
    };
    if (b.glass) {
      style.background = b.color;
      style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.25)";
    } else if (b.text && b.color.startsWith("rgba")) {
      // Etched logo on glass-front back wall: outline only.
      style.border = `${Math.max(1, 0.8 * s)}px solid rgba(255,255,255,0.75)`;
    } else {
      style.backgroundColor = b.color.startsWith("#") ? shade(b.color, faceShade[face]) : b.color;
      let pattern = patternFor(b, face, s);
      if (b.light && face === "front") {
        const wash =
          b.light === "infrared"
            ? "radial-gradient(ellipse at 50% 50%, rgba(255, 110, 50, 0.55), rgba(120, 40, 20, 0.15) 70%)"
            : "linear-gradient(to bottom, rgba(255, 196, 120, 0.85), rgba(255, 196, 120, 0) 45%)";
        pattern = pattern ? `${wash}, ${pattern}` : wash;
      }
      if (pattern) {
        style.backgroundImage = pattern;
        if (b.pattern === "stones") style.backgroundSize = `${Math.max(4, 7 * s)}px ${Math.max(4, 7 * s)}px`;
      }
    }
    if (b.round) style.borderRadius = "50%";
    if (b.glow) style.boxShadow = `0 0 ${Math.max(6, 10 * s)}px ${Math.max(2, 3 * s)}px ${b.glow}`;
    return face === "front" && b.text ? { key: face, style, text: b.text } : { key: face, style };
  });
}

/** Boxes to draw for a given view (cut-away hides the front and the roof). */
export function visibleBoxes(boxes: Box3D[], cutaway: boolean): Box3D[] {
  return cutaway ? boxes.filter((b) => b.part !== "front" && b.part !== "roof") : boxes;
}
