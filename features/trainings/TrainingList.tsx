// features/trainings/TrainingList.tsx
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { Training } from "@/types/training";
import { formatDate } from "@/lib/formatDate";

type Props = {
    title?: string;
    trainings: Training[];
    onRegister: (t: Training) => void;
    isOrganizerView?: boolean;
    onUpdateProgress?: (id: string, progress: number) => void;
    onManage?: (t: Training) => void;
};

export default function TrainingList({
    title = "Upcoming trainings",
    trainings,
    onRegister,
    isOrganizerView = false,
    onUpdateProgress,
    onManage,
}: Props) {
    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#22c55e]/5 to-[#7c3aed]/5">
                <CardTitle className="text-lg font-semibold text-[#0f172a]">{title}</CardTitle>
                <div className="flex items-center gap-2">
                    <Badge className="bg-[#22c55e]/10 text-[#22c55e]">Trainings</Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
                {trainings.length === 0 ? (
                    <p className="text-sm text-slate-500">No sessions found.</p>
                ) : (
                    <div className="grid gap-3">
                        {trainings.map((tr) => (
                            <TrainingCard
                                key={tr.id}
                                tr={tr}
                                onRegister={onRegister}
                                isOrganizerView={isOrganizerView}
                                onUpdateProgress={onUpdateProgress}
                                onManage={onManage}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* Small inline components used by list below */

function TrainingCard({
    tr,
    onRegister,
    isOrganizerView,
    onUpdateProgress,
    onManage,
}: {
    tr: Training;
    onRegister: (t: Training) => void;
    isOrganizerView?: boolean;
    onUpdateProgress?: (id: string, progress: number) => void;
    onManage?: (t: Training) => void;
}) {
    const seatsLeft = (tr.capacity ?? Infinity) - (tr.registered ?? 0);
    const full = tr.capacity !== undefined && seatsLeft <= 0;

    // local state for the small coach progress editor dialog
    const [progressOpen, setProgressOpen] = useState(false);
    const [localProgress, setLocalProgress] = useState<number>(tr.progress ?? 0);

    const handleSaveProgress = () => {
        setProgressOpen(false);
        onUpdateProgress?.(tr.id, Math.max(0, Math.min(100, Math.round(localProgress))));
    };

    return (
        <article className="p-4 rounded-lg bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#0f172a]">{tr.title}</h3>
                    <p className="text-xs text-slate-500">
                        {formatDate(tr.date)} {tr.time ? `• ${tr.time}` : ""} • {tr.location} {tr.city ? `• ${tr.city}` : ""}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{tr.notes}</p>

                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-slate-500">Coach</div>
                                <div className="text-xs font-medium text-[#0f172a]">{tr.coach}</div>
                            </div>

                            <div className="text-xs text-slate-500">Registered: {tr.registered}/{tr.capacity ?? "—"}</div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-xs text-slate-500">Progress</div>
                                <div className="text-xs font-medium text-[#0f172a]">{(tr.progress ?? 0)}%</div>
                            </div>

                            <Progress value={tr.progress ?? 0} className="h-2 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {!isOrganizerView ? (
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => onRegister(tr)} disabled={full}>
                                {full ? "Full" : "Register"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onManage?.(tr)}>
                                Manage
                            </Button>

                            <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
                                <DialogContent className="sm:max-w-md bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                                    <DialogHeader>
                                        <DialogTitle>Update progress — {tr.title}</DialogTitle>
                                        <DialogDescription>Set a session progress percentage (0–100%).</DialogDescription>
                                    </DialogHeader>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <div className="text-xs text-slate-600 mb-1">Progress</div>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={String(localProgress)}
                                                onChange={(e) => setLocalProgress(Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" onClick={() => setProgressOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSaveProgress}>Save</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button size="sm" onClick={() => setProgressOpen(true)}>
                                Update progress
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
