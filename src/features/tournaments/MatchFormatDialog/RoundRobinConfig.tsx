// features/tournaments/RoundRobinConfig.tsx
"use client";

import { Button } from "@/components/ui/button";
import type { Category, MatchFormat } from "../types";

type Props = {
    activeCategory: Category;
    activeSelection: MatchFormat;
    onChange: (patch: Partial<MatchFormat>) => void;
};

export default function RoundRobinConfig({ activeCategory, activeSelection, onChange }: Props) {
    function recommendedPoolsFor(registered: number) {
        if (registered <= 4) return 1;
        const approxPoolSize = 4;
        return Math.max(1, Math.round(registered / approxPoolSize));
    }

    function nearestBracketSize(n: number) {
        let pow = 1;
        while (pow < n) pow *= 2;
        return pow;
    }

    function knockoutRoundsFor(nPlayers: number) {
        if (nPlayers <= 1) return 0;
        let rounds = 0;
        let p = 1;
        while (p < nPlayers) {
            p *= 2;
            rounds += 1;
        }
        return rounds;
    }

    const registered = activeCategory.registered ?? 0;
    const recommendedPools = recommendedPoolsFor(registered);
    const rrPools = activeSelection.rrPools ?? recommendedPools;
    const recommendedQualPerPool = registered / Math.max(1, recommendedPools) >= 4 ? 2 : 1;
    const rrQualPerPool = activeSelection.rrQualPerPool ?? recommendedQualPerPool;

    const totalQualifiers = rrPools * rrQualPerPool;
    const bracketSize = nearestBracketSize(totalQualifiers);
    const rounds = knockoutRoundsFor(totalQualifiers);

    return (
        <div className="border rounded p-4 bg-slate-50">
            <div className="text-sm font-medium mb-3">Round-robin configuration</div>

            <div className="grid grid-cols-3 gap-4">
                <label>
                    <div className="text-xs text-slate-600">Number of pools</div>
                    <input
                        type="number"
                        min={1}
                        value={rrPools}
                        onChange={(e) => onChange({ rrPools: Number(e.target.value) })}
                        className="w-full rounded border px-2 py-1"
                    />
                    <div className="text-xs text-slate-400 mt-1">Recommended: {recommendedPools}</div>
                    <div className="mt-1">
                        <Button variant="ghost" size="sm" onClick={() => onChange({ rrPools: recommendedPools })}>
                            Use recommended
                        </Button>
                    </div>
                </label>

                <label>
                    <div className="text-xs text-slate-600">Qualifiers per pool</div>
                    <input type="number" min={1} value={rrQualPerPool} onChange={(e) => onChange({ rrQualPerPool: Number(e.target.value) })} className="w-full rounded border px-2 py-1" />
                    <div className="text-xs text-slate-400 mt-1">Recommended: {recommendedQualPerPool}</div>
                </label>

                <div>
                    <div className="text-xs text-slate-600">Registered teams</div>
                    <div className="text-sm font-medium">{registered}</div>
                </div>
            </div>

            <div className="mt-4 text-sm">
                <div>
                    Total qualifiers: <strong>{totalQualifiers}</strong>
                </div>
                <div>
                    Bracket size: <strong>{bracketSize}</strong>
                </div>
                <div>
                    Knockout rounds: <strong>{rounds}</strong>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    If total qualifiers is not a power-of-two, you may add byes or preliminary knockout matches to round up to the bracket size.
                </div>
            </div>
        </div>
    );
}
