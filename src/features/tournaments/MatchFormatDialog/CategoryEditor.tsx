"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Category, MatchFormat, MatchFormatType } from "../types";
import RoundRobinConfig from "./RoundRobinConfig";

type Props = {
    activeCategory: Category | null;
    activeSelection: MatchFormat | null;
    updateFormatMeta: (categoryId: string, patch: Partial<MatchFormat>) => void;
    setFormatForCategory: (categoryId: string, type: MatchFormatType) => void;
};

const FORMAT_LABELS: Record<MatchFormatType, string> = {
    "rr+ko": "Round robin + Knockout",
    league: "League / Round-robin",
    knockout: "Knockout / Elimination",
    custom: "Custom",
};

export default function CategoryEditor({ activeCategory, activeSelection, updateFormatMeta, setFormatForCategory }: Props) {
    if (!activeCategory || !activeSelection) {
        return <div className="text-sm text-slate-500">No category selected or categories are empty.</div>;
    }

    const onRRChange = (patch: Partial<MatchFormat>) => updateFormatMeta(activeCategory.id, patch);

    return (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-lg font-semibold">{activeCategory.label}</div>
                    <div className="text-xs text-slate-500">
                        {activeCategory.registered ?? 0}
                        {activeCategory.capacity ? ` / ${activeCategory.capacity}` : ""}
                    </div>
                </div>
            </div>

            {/* Format options — using shadcn RadioGroup */}
            <div className="mt-4">
                <div className="text-sm font-medium mb-2">Choose format</div>

                <RadioGroup value={activeSelection.type} onValueChange={(v) => setFormatForCategory(activeCategory.id, v as MatchFormatType)} className="grid grid-cols-2 gap-2">
                    {(["rr+ko", "league", "knockout", "custom"] as MatchFormatType[]).map((fmt) => (
                        <label key={fmt} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                            <RadioGroupItem value={fmt} />
                            <div className="select-none">
                                <div className="text-sm">{FORMAT_LABELS[fmt]}</div>
                                <div className="text-xs text-slate-500">
                                    {fmt === "rr+ko"
                                        ? "League then knockout"
                                        : fmt === "league"
                                            ? "Only league matches"
                                            : fmt === "knockout"
                                                ? "Single-elimination"
                                                : "Custom structure"}
                                </div>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </div>

            {/* Generic settings */}
            <div className="mt-4 grid grid-cols-3 gap-4">
                <label>
                    <div className="text-xs text-slate-600">Points per game</div>
                    <input
                        type="number"
                        min={1}
                        value={activeSelection.pointsPerGame ?? 11}
                        onChange={(e) => updateFormatMeta(activeCategory.id, { pointsPerGame: Number(e.target.value) })}
                        className="w-full rounded border px-2 py-1"
                    />
                </label>

                <label>
                    <div className="text-xs text-slate-600">Games per match</div>
                    <input
                        type="number"
                        min={1}
                        value={activeSelection.gamesPerMatch ?? 3}
                        onChange={(e) => updateFormatMeta(activeCategory.id, { gamesPerMatch: Number(e.target.value) })}
                        className="w-full rounded border px-2 py-1"
                    />
                </label>

                <label>
                    <div className="text-xs text-slate-600">Tie-break to (optional)</div>
                    <input
                        type="number"
                        min={1}
                        value={activeSelection.tieBreakTo ?? ""}
                        onChange={(e) => updateFormatMeta(activeCategory.id, { tieBreakTo: e.target.value === "" ? null : Number(e.target.value) })}
                        className="w-full rounded border px-2 py-1"
                    />
                </label>
            </div>

            {activeSelection.type === "custom" && (
                <label className="col-span-2 block mt-4">
                    <div className="text-xs text-slate-600">Custom format description</div>
                    <textarea
                        value={activeSelection.description ?? ""}
                        onChange={(e) => updateFormatMeta(activeCategory.id, { description: e.target.value })}
                        className="w-full rounded border px-2 py-1 h-24"
                    />
                </label>
            )}

            {activeSelection.type === "rr+ko" && (
                <div className="mt-6">
                    <RoundRobinConfig activeCategory={activeCategory} activeSelection={activeSelection} onChange={onRRChange} />
                </div>
            )}
        </>
    );
}
