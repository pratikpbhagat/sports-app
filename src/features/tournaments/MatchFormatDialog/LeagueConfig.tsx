"use client";

import { Button } from "@/components/ui/button";
import type { Category, MatchFormat } from "../types";

type Props = {
    activeCategory: Category;
    activeSelection: MatchFormat;
    onChange: (patch: Partial<MatchFormat>) => void;
};

/**
 * LeagueConfig
 *
 * - Ask how many pools to create
 * - Show recommended pools (based on registered teams)
 * - Ask whether to do full round-robin (each vs each) or limit matches per team
 * - If limited, ask for max matches per team (must be < teams per pool - 1)
 */
export default function LeagueConfig({ activeCategory, activeSelection, onChange }: Props) {
    // heuristic for recommended pools: prefer pool size ~4
    function recommendedPoolsFor(registered: number) {
        if (registered <= 4) return 1;
        const approxPoolSize = 4;
        return Math.max(1, Math.round(registered / approxPoolSize));
    }

    const registered = activeCategory.registered ?? 0;
    const recommendedPools = recommendedPoolsFor(registered);

    // pools chosen in the format meta: reuse rrPools field name for pools in league mode
    const pools = activeSelection.rrPools ?? recommendedPools;

    // derived: teams per pool (approx)
    const teamsPerPool = pools > 0 ? Math.ceil(registered / pools) : registered;

    // round-robin options
    const rrFullRound = activeSelection.rrFullRound ?? true;
    const rrMaxMatchesPerTeam = activeSelection.rrMaxMatchesPerTeam ?? null;

    // derived validation: maximum allowable matches per team if full round robin is not used
    const maxAllowedMatchesPerTeam = Math.max(0, teamsPerPool - 1);

    // recommended max matches when limiting — we recommend teamsPerPool - 1 (full) or a lower sensible value:
    const recommendedMaxMatches = Math.max(1, Math.min(maxAllowedMatchesPerTeam, Math.floor(Math.max(1, teamsPerPool) / 1.5)));

    const invalidMaxMatches =
        rrFullRound === false &&
        (rrMaxMatchesPerTeam == null || rrMaxMatchesPerTeam <= 0 || rrMaxMatchesPerTeam > maxAllowedMatchesPerTeam);

    // UI handlers
    function setPools(n: number) {
        onChange({ rrPools: n });
        // clear inconsistent rrMaxMatchesPerTeam if it's now > allowed
        if ((activeSelection.rrMaxMatchesPerTeam ?? null) !== null && (activeSelection.rrMaxMatchesPerTeam ?? 0) > Math.max(0, Math.ceil(registered / n) - 1)) {
            onChange({ rrMaxMatchesPerTeam: null });
        }
    }

    function toggleFullRound(v: boolean) {
        onChange({ rrFullRound: v });
        if (v) {
            // when turning on full round, clear rrMaxMatchesPerTeam
            onChange({ rrMaxMatchesPerTeam: null });
        }
    }

    function setMaxMatchesPerTeam(n: number | null) {
        onChange({ rrMaxMatchesPerTeam: n });
    }

    return (
        <div className="border rounded p-4 bg-slate-50">
            <div className="text-sm font-medium mb-3">League configuration</div>

            <div className="grid grid-cols-3 gap-4 items-end">
                <label>
                    <div className="text-xs text-slate-600">Number of pools</div>
                    <input
                        type="number"
                        min={1}
                        value={pools}
                        onChange={(e) => setPools(Number(e.target.value || 1))}
                        className="w-full rounded border px-2 py-1"
                    />
                    <div className="text-xs text-slate-400 mt-1">Recommended: {recommendedPools}</div>
                    <div className="mt-1">
                        <Button variant="ghost" size="sm" onClick={() => setPools(recommendedPools)}>
                            Use recommended
                        </Button>
                    </div>
                </label>

                <div>
                    <div className="text-xs text-slate-600">Registered teams</div>
                    <div className="text-sm font-medium">{registered}</div>
                </div>

                <div>
                    <div className="text-xs text-slate-600">Approx. teams per pool</div>
                    <div className="text-sm font-medium">{teamsPerPool}</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-sm font-medium mb-2">Scheduling mode</div>

                <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-start gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                        <input
                            type="radio"
                            name={`rrmode-${activeCategory.id}`}
                            checked={rrFullRound === true}
                            onChange={() => toggleFullRound(true)}
                        />
                        <div>
                            <div className="text-sm">Full round-robin</div>
                            <div className="text-xs text-slate-500">
                                Each team plays every other team in its pool — total matches per team = teams-per-pool - 1.
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                        <input
                            type="radio"
                            name={`rrmode-${activeCategory.id}`}
                            checked={rrFullRound === false}
                            onChange={() => toggleFullRound(false)}
                        />
                        <div>
                            <div className="text-sm">Limited matches per team</div>
                            <div className="text-xs text-slate-500">
                                Each team will be scheduled to play up to a specified number of opponents (faster schedule).
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* when limited matches chosen, show input and validation */}
            {rrFullRound === false && (
                <div className="mt-4 grid grid-cols-3 gap-4 items-end">
                    <label>
                        <div className="text-xs text-slate-600">Max matches per team</div>
                        <input
                            type="number"
                            min={1}
                            max={maxAllowedMatchesPerTeam}
                            value={rrMaxMatchesPerTeam ?? ""}
                            onChange={(e) => {
                                const v = e.target.value === "" ? null : Number(e.target.value);
                                setMaxMatchesPerTeam(v);
                            }}
                            className="w-full rounded border px-2 py-1"
                        />
                        <div className="text-xs text-slate-400 mt-1">
                            Must be between 1 and {maxAllowedMatchesPerTeam} (teams-per-pool - 1). Recommended: {recommendedMaxMatches}
                        </div>
                    </label>

                    <div>
                        <div className="text-xs text-slate-600">Teams per pool (approx)</div>
                        <div className="text-sm font-medium">{teamsPerPool}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-600">Helper</div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setMaxMatchesPerTeam(recommendedMaxMatches)}>
                                Use recommended
                            </Button>
                        </div>
                    </div>

                    {invalidMaxMatches && (
                        <div className="col-span-3 text-sm text-red-600 mt-2">
                            Invalid value — max matches per team must be between 1 and {maxAllowedMatchesPerTeam}.
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 text-sm">
                <div>
                    With <strong>{pools}</strong> pool(s) and <strong>{registered}</strong> registered teams, expect about{" "}
                    <strong>{teamsPerPool}</strong> teams per pool.
                </div>

                <div className="text-xs text-slate-500 mt-2">
                    Recommendation: pool sizes between 3–6 teams are easy to schedule. Use limited matches per team when you want
                    to shorten the schedule; ensure the max matches is less than teams-per-pool - 1.
                </div>
            </div>
        </div>
    );
}
