"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import type { Category, MatchFormat } from "../types";

type Props = {
    activeCategory: Category;
    activeSelection: MatchFormat;
    onChange: (patch: Partial<MatchFormat>) => void;
};

/**
 * EliminationConfig
 *
 * UI for Knockout-only format:
 * - Choose bracket size (auto-recommended next power of two, or custom)
 * - Show number of rounds for chosen bracket
 * - Show byes required (bracketSize - numParticipants)
 * - Choose seeding method and number of seeds
 * - Option to auto-fill byes or leave manual
 *
 * Uses these optional MatchFormat fields:
 * - koBracketSize?: number
 * - koAutoBrackets?: boolean
 * - koSeedMethod?: "random" | "ranking" | "manual"
 * - koSeedCount?: number
 */
export default function EliminationConfig({ activeCategory, activeSelection, onChange }: Props) {
    const participants = activeCategory.registered ?? 0;

    function nextPowerOfTwo(n: number) {
        let p = 1;
        while (p < n) p <<= 1;
        return p;
    }

    function roundsFor(bracketSize: number) {
        if (bracketSize <= 1) return 0;
        let rounds = 0;
        let p = 1;
        while (p < bracketSize) {
            p <<= 1;
            rounds += 1;
        }
        return rounds;
    }

    // default recommendation if participants known (if participants==0 fallback to 8)
    const recommendedBracket = participants > 0 ? nextPowerOfTwo(participants) : 8;

    // read current values from activeSelection, fallback to recommended
    const koAuto = activeSelection.koAutoBrackets ?? true;
    const koBracket = activeSelection.koBracketSize ?? recommendedBracket;
    const koSeedMethod = activeSelection.koSeedMethod ?? "ranking";
    const koSeedCount = activeSelection.koSeedCount ?? 0;

    const byes = Math.max(0, (koBracket ?? recommendedBracket) - participants);
    const rounds = roundsFor(koBracket ?? recommendedBracket);

    // helper setters
    function setBracketSize(n: number) {
        onChange({ koBracketSize: n, koAutoBrackets: false });
    }

    function setUseRecommended() {
        onChange({ koBracketSize: recommendedBracket, koAutoBrackets: true });
    }

    function setAutoBrackets(v: boolean) {
        onChange({ koAutoBrackets: v, koBracketSize: v ? recommendedBracket : activeSelection.koBracketSize ?? recommendedBracket });
    }

    function setSeedMethod(m: "random" | "ranking" | "manual") {
        onChange({ koSeedMethod: m });
    }

    function setSeedCount(n: number) {
        onChange({ koSeedCount: n });
    }

    // useful derived: show whether bracket is smaller than participants (invalid)
    const invalidBracket = (koBracket ?? recommendedBracket) < Math.max(1, participants);

    // quick bracket choices
    const quickOptions = useMemo(() => {
        const opts = [nextPowerOfTwo(Math.max(1, participants)), nextPowerOfTwo(Math.max(1, participants + 1)), 32, 16, 8];
        // dedupe and sort ascending
        return Array.from(new Set(opts)).sort((a, b) => a - b);
    }, [participants]);

    return (
        <div className="border rounded p-4 bg-slate-50">
            <div className="text-sm font-medium mb-3">Knockout configuration</div>

            <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                    <div className="text-xs text-slate-600">Participants registered</div>
                    <div className="text-sm font-medium">{participants}</div>
                </div>

                <div>
                    <div className="text-xs text-slate-600">Bracket mode</div>
                    <div className="flex items-center gap-3 mt-1">
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={koAuto === true} onChange={() => setAutoBrackets(true)} />
                            <span className="text-xs">Auto (recommended)</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="radio" checked={koAuto === false} onChange={() => setAutoBrackets(false)} />
                            <span className="text-xs">Custom</span>
                        </label>
                    </div>
                </div>

                <div>
                    <div className="text-xs text-slate-600">Recommended bracket</div>
                    <div className="text-sm font-medium">{recommendedBracket}</div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 items-end">
                <label>
                    <div className="text-xs text-slate-600">Bracket size</div>
                    <input
                        type="number"
                        min={2}
                        step={1}
                        value={koBracket}
                        onChange={(e) => setBracketSize(Math.max(2, Number(e.target.value || 2)))}
                        disabled={koAuto}
                        className="w-full rounded border px-2 py-1"
                    />
                    <div className="text-xs text-slate-400 mt-1">If custom, choose a power-of-two (e.g. 8, 16, 32) or add byes.</div>
                </label>

                <div>
                    <div className="text-xs text-slate-600">Byes required</div>
                    <div className="text-sm font-medium">{byes}</div>
                    <div className="text-xs text-slate-400 mt-1">Will create {byes} automatic byes in first round</div>
                </div>

                <div>
                    <div className="text-xs text-slate-600">Estimated rounds</div>
                    <div className="text-sm font-medium">{rounds}</div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <div className="text-xs text-slate-500 mr-2">Quick brackets</div>
                {quickOptions.map((q) => (
                    <Button key={q} variant="ghost" size="sm" onClick={() => setBracketSize(q)}>
                        {q}
                    </Button>
                ))}
                <Button variant="ghost" size="sm" onClick={setUseRecommended}>
                    Use recommended
                </Button>
            </div>

            <div className="mt-4">
                <div className="text-sm font-medium mb-2">Seeding</div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-slate-600">Seeding method</div>
                        <select
                            value={koSeedMethod}
                            onChange={(e) => setSeedMethod(e.target.value as "random" | "ranking" | "manual")}
                            className="w-full rounded border px-2 py-1"
                        >
                            <option value="ranking">Based on ranking</option>
                            <option value="random">Random</option>
                            <option value="manual">Manual seeding</option>
                        </select>
                        <div className="text-xs text-slate-400 mt-1">Manual allows admin to set seeds later when creating matchups.</div>
                    </div>

                    <label>
                        <div className="text-xs text-slate-600">Number of seeds (optional)</div>
                        <input
                            type="number"
                            min={0}
                            value={koSeedCount}
                            onChange={(e) => setSeedCount(Math.max(0, Number(e.target.value || 0)))}
                            className="w-full rounded border px-2 py-1"
                        />
                        <div className="text-xs text-slate-400 mt-1">Seeds will be placed to avoid early clashes.</div>
                    </label>

                    <div>
                        <div className="text-xs text-slate-600">Auto-add byes</div>
                        <div className="mt-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={activeSelection.koAutoFillByes ?? true}
                                    onChange={(e) => onChange({ koAutoFillByes: e.target.checked })}
                                />
                                <span className="text-xs">Fill byes automatically (default)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {invalidBracket && (
                <div className="mt-3 text-sm text-red-600">Invalid bracket: chosen bracket size is less than participants.</div>
            )}

            <div className="mt-4 text-sm">
                <div>
                    With <strong>{participants}</strong> participants and a bracket size of <strong>{koBracket}</strong>, there will
                    be <strong>{byes}</strong> byes and approximately <strong>{rounds}</strong> rounds.
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    Note: If bracket size is not a power-of-two, consider using the next power-of-two and letting byes handle the
                    imbalance, or run preliminary matches to trim the field.
                </div>
            </div>
        </div>
    );
}
