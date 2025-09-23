// features/tournaments/MatchFormatPreview.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Category, MatchFormat, MatchFormatType } from "../types";

type Props = {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    category: Category;
    format: MatchFormat;
};

function placeholderTeams(n: number) {
    return Array.from({ length: Math.max(0, n) }, (_, i) => `Team ${i + 1}`);
}

function distributeToPools(teams: string[], pools: number) {
    if (pools <= 0) return [];
    const out: string[][] = Array.from({ length: pools }, () => []);
    for (let i = 0; i < teams.length; i++) {
        out[i % pools].push(teams[i]);
    }
    return out;
}

function buildKnockoutPairs(teams: string[], bracketSize: number, seedMethod: string | null) {
    let arr = [...teams];
    if (seedMethod === "random") {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    const byes = bracketSize - arr.length;
    for (let i = 0; i < byes; i++) arr.push("BYE");
    const pairs: [string, string][] = [];
    for (let i = 0; i < bracketSize / 2; i++) {
        pairs.push([arr[i], arr[bracketSize - 1 - i]]);
    }
    return { pairs, byes };
}

function nearestPowerOfTwo(n: number) {
    let p = 1;
    while (p < n) p <<= 1;
    return p;
}

export default function MatchFormatPreview({ open, onOpenChange, category, format }: Props) {
    const registered = category.registered ?? 0;
    const teams = placeholderTeams(registered);

    const type = format.type as MatchFormatType;

    // rr params
    const rrPools = format.rrPools ?? Math.max(1, Math.round(registered / 4));
    const rrQualPerPool = format.rrQualPerPool ?? (registered / Math.max(1, rrPools) >= 4 ? 2 : 1);

    // knockout params
    const totalQual = rrPools * rrQualPerPool;
    const koBracket = format.koBracketSize ?? nearestPowerOfTwo(Math.max(1, totalQual || registered));
    const koSeedMethod = (format.koSeedMethod as string) ?? "ranking";

    // derived
    const pools = distributeToPools(teams, rrPools);
    const knockoutTeams = teams.slice(0, totalQual); // placeholder: first qualifiers
    const { pairs, byes } = buildKnockoutPairs(knockoutTeams.length ? knockoutTeams : teams, koBracket, koSeedMethod);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl bg-white text-[#0f172a] rounded-lg shadow-lg p-4">
                <DialogHeader>
                    <DialogTitle>Preview — {category.label}</DialogTitle>
                    <div className="text-xs text-slate-500 mt-1">Visual preview of selected format (placeholders shown for teams)</div>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium">Category</div>
                            <div className="text-sm">
                                {category.label} • {registered} registered {category.capacity ? `/ ${category.capacity}` : ""}
                            </div>
                        </div>

                        <div className="text-right text-xs text-slate-500">
                            <div>Format: <strong className="text-slate-700">{type}</strong></div>
                            <div>Points: {format.pointsPerGame ?? 11} • Games: {format.gamesPerMatch ?? 3}</div>
                        </div>
                    </div>

                    {type === "rr+ko" && (
                        <div className="border rounded p-3 bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium">Round-robin pools</div>
                                <div className="text-xs text-slate-500">
                                    Pools: {rrPools} • Qualifiers per pool: {rrQualPerPool} • Total qualifiers: {totalQual}
                                </div>
                            </div>

                            {/* Responsive, scrollable pools grid */}
                            <div
                                className="grid gap-3"
                                style={{
                                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                    maxHeight: "42vh",
                                    overflowY: "auto",
                                    paddingRight: 8, // keep some space for scrollbar
                                }}
                            >
                                {pools.map((pool, idx) => (
                                    <div
                                        key={idx}
                                        className="border rounded p-2 bg-white flex flex-col"
                                        style={{ minHeight: 80 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold">Pool {idx + 1}</div>
                                            <div className="text-xs text-slate-400">{pool.length} teams</div>
                                        </div>

                                        <div className="mt-2 overflow-auto" style={{ maxHeight: 120 }}>
                                            <ul className="text-sm list-disc ml-5">
                                                {pool.length ? pool.map((t) => <li key={t}>{t}</li>) : <li className="text-xs text-slate-400">No teams</li>}
                                            </ul>
                                        </div>

                                        <div className="text-xs text-slate-500 mt-2">Qualifiers: {rrQualPerPool}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-medium">Knockout qualifiers</div>
                                <div className="text-xs text-slate-500">
                                    Total qualifiers: {totalQual} • recommended bracket: {koBracket} • byes: {byes}
                                </div>

                                <div className="mt-2 border rounded p-2 bg-white" style={{ maxHeight: "28vh", overflow: "auto" }}>
                                    <div className="text-sm font-semibold">Round of {koBracket}</div>
                                    <ul className="mt-2 space-y-1">
                                        {pairs.map(([a, b], i) => (
                                            <li key={i} className="text-sm">
                                                {a} <span className="text-xs text-slate-400">vs</span> {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {type === "league" && (
                        <div className="border rounded p-3 bg-slate-50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium">League (Round-robin) preview</div>
                                <div className="text-xs text-slate-500">
                                    Pools: {rrPools} • teams per pool (approx): {Math.ceil(registered / Math.max(1, rrPools))}
                                </div>
                            </div>

                            <div
                                className="grid gap-3"
                                style={{
                                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                    maxHeight: "42vh",
                                    overflowY: "auto",
                                    paddingRight: 8,
                                }}
                            >
                                {pools.map((pool, idx) => (
                                    <div key={idx} className="border rounded p-2 bg-white flex flex-col" style={{ minHeight: 80 }}>
                                        <div className="text-sm font-semibold">Pool {idx + 1}</div>
                                        <div className="mt-2 overflow-auto" style={{ maxHeight: 140 }}>
                                            <ul className="mt-1 list-disc ml-5 text-sm">{pool.map((t) => <li key={t}>{t}</li>)}</ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {type === "knockout" && (
                        <div className="border rounded p-3 bg-slate-50">
                            <div className="text-sm font-medium mb-2">Knockout preview</div>
                            <div className="text-xs text-slate-500 mb-3">Bracket size: {koBracket} • seeding: {koSeedMethod} • byes: {byes}</div>

                            <div className="mt-3 border rounded p-2 bg-white" style={{ maxHeight: "36vh", overflow: "auto" }}>
                                <div className="text-sm font-semibold">Round of {koBracket}</div>
                                <ul className="mt-2 space-y-1">
                                    {pairs.map((p, i) => (
                                        <li key={i} className="text-sm">
                                            {p[0]} <span className="text-xs text-slate-400">vs</span> {p[1]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {type === "custom" && (
                        <div className="border rounded p-3 bg-slate-50">
                            <div className="text-sm font-medium mb-2">Custom format</div>
                            <div className="text-sm">{format.description ?? "No custom description provided."}</div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="ghost" onClick={() => onOpenChange?.(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
