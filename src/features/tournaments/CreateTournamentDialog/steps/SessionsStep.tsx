"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import type { SessionRow } from "../../types";

type Props = {
    useMultipleDates: boolean;
    setUseMultipleDates: (v: boolean) => void;
    dateTimes: SessionRow[];
    addDateTimeRow: () => void;
    removeDateTimeRow: (id: string) => void;
    updateDateTime: (id: string, patch: Partial<SessionRow>) => void;
};

export default function SessionsStep({
    useMultipleDates,
    setUseMultipleDates,
    dateTimes,
    addDateTimeRow,
    removeDateTimeRow,
    updateDateTime,
}: Props) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-slate-700">Date & time</div>
                    <div className="text-xs text-slate-500">Provide one or multiple session dates</div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Checkbox checked={useMultipleDates} onCheckedChange={(v) => setUseMultipleDates(Boolean(v))} id="multiple-dates-checkbox" />
                        <Label htmlFor="multiple-dates-checkbox" className="text-xs text-slate-600">
                            Multiple dates
                        </Label>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {dateTimes.map((d) => (
                    <div key={d.id} className="grid grid-cols-2 gap-3 items-end">
                        <div>
                            <Label className="text-xs">Date</Label>
                            <Input type="date" value={d.date} onChange={(e) => updateDateTime(d.id, { date: e.target.value })} />
                        </div>

                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <Label className="text-xs">Time</Label>
                                <Input type="time" value={d.time} onChange={(e) => updateDateTime(d.id, { time: e.target.value })} />
                            </div>

                            <div>
                                {dateTimes.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeDateTimeRow(d.id)}
                                        aria-label="Remove date"
                                        className="p-2 rounded-md hover:bg-slate-100"
                                    >
                                        <Trash className="w-4 h-4 text-slate-500" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {useMultipleDates && (
                <div>
                    <Button variant="ghost" size="sm" type="button" onClick={addDateTimeRow} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add another date
                    </Button>
                </div>
            )}
        </section>
    );
}
