import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import type { SessionRow } from "../types";

type Props = {
    useMultipleDates: boolean;
    setUseMultipleDates: (v: boolean) => void;
    dateTimes: SessionRow[];
    addDateTimeRow: () => void;
    removeDateTimeRow: (id: string) => void;
    updateDateTime: (id: string, patch: Partial<SessionRow>) => void;
};

export default function SessionsStep(props: Props) {
    const { useMultipleDates, setUseMultipleDates, dateTimes, addDateTimeRow, removeDateTimeRow, updateDateTime } = props;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-slate-700">Date & time</div>
                    <div className="text-xs text-slate-500">Provide one or multiple session dates</div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-600">Multiple dates</label>
                    <input type="checkbox" checked={useMultipleDates} onChange={(e) => setUseMultipleDates(e.target.checked)} className="w-4 h-4" />
                </div>
            </div>

            {dateTimes.map((d) => (
                <div key={d.id} className="grid grid-cols-2 gap-2 items-end">
                    <label className="block">
                        <span className="text-xs text-slate-600">Date</span>
                        <Input type="date" value={d.date} onChange={(e) => updateDateTime(d.id, { date: e.target.value })} />
                    </label>

                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <label className="block">
                                <span className="text-xs text-slate-600">Time</span>
                                <Input type="time" value={d.time} onChange={(e) => updateDateTime(d.id, { time: e.target.value })} />
                            </label>
                        </div>

                        <div>
                            {dateTimes.length > 1 && (
                                <button type="button" onClick={() => removeDateTimeRow(d.id)} aria-label="Remove date" className="p-2 rounded-md hover:bg-slate-100">
                                    <Trash className="w-4 h-4 text-slate-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

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
