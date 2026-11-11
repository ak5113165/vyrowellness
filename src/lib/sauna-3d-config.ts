// Turns a Build Your Sauna selection into a 3D preview configuration.

import { accessorySets, controlPanels, heaters, saunaModels } from "@/content/sauna-catalogue";
import type { HeaterKind, SaunaConfig } from "@/lib/sauna-3d";

const heaterKinds: HeaterKind[] = ["Floor Heater", "Tower Heater", "Wall-Mounted Heater"];

export type BuilderSelection = {
  room: string | null;
  wood: string;
  heater: string | null;
  panel: string | null;
  accessories: string[];
};

export function saunaConfigFromSelection(sel: BuilderSelection): SaunaConfig | null {
  const model = saunaModels.find((m) => m.code === sel.room);
  if (!model) return null;
  const h = heaters.find((x) => x.name === sel.heater);
  const kind = h ? heaterKinds.find((k) => k === h.kind) : undefined;
  const p = controlPanels.find((x) => x.name === sel.panel);
  return {
    series: model.type,
    size: model.size,
    dimsFt: model.dimsFt,
    wood: sel.wood,
    heater: h && kind ? { kind, finish: h.finish } : null,
    panel: p ? (p.kind === "Touch Control" ? "Touch Control" : "Button Control") : null,
    accessories: accessorySets
      .filter((a) => sel.accessories.includes(a.name))
      .map((a) => ({ name: a.name, finish: a.finish })),
  };
}
