// features/tournaments/MatchFormatDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import type { MatchFormat, MatchFormatType } from "../types";

type Props = {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    initial?: MatchFormat | null;
    onSave: (format: MatchFormat) => void;
    categoryLabel?: string; // UI only
};

export default function MatchFormatDialog({ open, onOpenChange, initial = null, onSave, categoryLabel }: Props) {
    const [type, setType] = useState<MatchFormatType>(initial?.type ?? "rr+ko");
    const [pointsPerGame, setPointsPerGame] = useState<number>(initial?.pointsPerGame ?? 11);
    const [gamesPerMatch, setGamesPerMatch] = useState<number>(initial?.gamesPerMatch ?? 3);
    const [tieBreakTo, setTieBreakTo] = useState<number | "">(
        initial?.tieBreakTo ?? ""
    );
    const [description, setDescription] = useState<string>(initial?.description ?? "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initial) {
            setType(initial.type);
            setPointsPerGame(initial.pointsPerGame ?? 11);
            setGamesPerMatch(initial.gamesPerMatch ?? 3);
            setTieBreakTo(initial.tieBreakTo ?? "");
            setDescription(initial.description ?? "");
        } else {
            setType("rr+ko");
            setPointsPerGame(11);
            setGamesPerMatch(3);
            setTieBreakTo("");
            setDescription("");
        }
        setError(null);
    }, [initial, open]);

    function validate(): string | null {
        if (!pointsPerGame || Number(pointsPerGame) <= 0) return "Points per game must be greater than 0.";
        if (!gamesPerMatch || Number(gamesPerMatch) <= 0) return "Games per match must be greater than 0.";
        if (type === "custom" && description.trim().length === 0) return "Provide a short description for the custom format.";
        return null;
    }

    function handleSave() {
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        onSave({
            type,
            pointsPerGame: Number(pointsPerGame),
            gamesPerMatch: Number(gamesPerMatch),
            tieBreakTo: tieBreakTo === "" ? null : Number(tieBreakTo),
            description: description.trim() || null,
        });
        onOpenChange?.(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>Match format {categoryLabel ? `— ${categoryLabel}` : ""}</DialogTitle>
                    <DialogDescription>Choose how matches are played for this category.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div>
                        <div className="text-sm font-medium mb-2">Format</div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="format" checked={type === "rr+ko"} onChange={() => setType("rr+ko")} />
                                <div>
                                    <div className="text-sm font-medium">Round robin + Knockouts</div>
                                    <div className="text-xs text-slate-500">Participants play league then top N progress to knockout.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="format" checked={type === "league"} onChange={() => setType("league")} />
                                <div>
                                    <div className="text-sm font-medium">League / Round-robin</div>
                                    <div className="text-xs text-slate-500">Only league matches — no knockout phase.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="format" checked={type === "knockout"} onChange={() => setType("knockout")} />
                                <div>
                                    <div className="text-sm font-medium">Knockout / Elimination</div>
                                    <div className="text-xs text-slate-500">Single-elimination bracket.</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="format" checked={type === "custom"} onChange={() => setType("custom")} />
                                <div>
                                    <div className="text-sm font-medium">Custom</div>
                                    <div className="text-xs text-slate-500">Configure custom scoring / structure.</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <label>
                            <div className="text-xs text-slate-600">Points per game</div>
                            <Input type="number" min={1} value={String(pointsPerGame)} onChange={(e) => setPointsPerGame(Number(e.target.value || 0))} />
                        </label>

                        <label>
                            <div className="text-xs text-slate-600">Games per match</div>
                            <Input type="number" min={1} value={String(gamesPerMatch)} onChange={(e) => setGamesPerMatch(Number(e.target.value || 0))} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <label>
                            <div className="text-xs text-slate-600">Tie-break to (optional)</div>
                            <Input type="number" min={1} value={tieBreakTo === "" ? "" : String(tieBreakTo)} onChange={(e) => setTieBreakTo(e.target.value === "" ? "" : Number(e.target.value))} />
                        </label>

                        {type === "custom" && (
                            <label>
                                <div className="text-xs text-slate-600">Custom description</div>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Pools of 4, top 2 to seeded KO + consolation bracket" />
                            </label>
                        )}
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => onOpenChange?.(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save format</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
