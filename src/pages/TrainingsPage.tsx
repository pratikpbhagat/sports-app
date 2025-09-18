import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import CreateTrainingDialog from "@/features/trainings/CreateTrainingDialog";
import Filters from "@/features/trainings/Filters";
import TrainingList from "@/features/trainings/TrainingList";
import type { Training } from "@/types/training";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";

const SAMPLE_TRAININGS: Training[] = [
    {
        id: "tr1",
        title: "Beginner Clinic",
        date: "2025-09-26",
        time: "18:00",
        location: "Central Court",
        city: "Springfield",
        capacity: 12,
        registered: 5,
        coach: "Alex R.",
        status: "scheduled",
        notes: "Intro to paddle basics and footwork.",
        progress: 10,
    },
    {
        id: "tr2",
        title: "Advanced Drills",
        date: "2025-10-03",
        time: "19:00",
        location: "North Arena",
        city: "Springfield",
        capacity: 8,
        registered: 8,
        coach: "Sam T.",
        status: "scheduled",
        notes: "High-intensity drills for experienced players.",
        progress: 0,
    },
    {
        id: "tr3",
        title: "Strategy Workshop",
        date: "2025-10-09",
        time: "17:30",
        location: "Community Center",
        city: "Riverton",
        capacity: 16,
        registered: 6,
        coach: "Pat K.",
        status: "scheduled",
        notes: "Tactical play and match simulation.",
        progress: 25,
    },
];

export default function TrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>(SAMPLE_TRAININGS);
    const [query, setQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState<string | "all">("all");

    const [createOpen, setCreateOpen] = useState(false);
    const [isCoachView, setIsCoachView] = useState(false);

    // register modal state handled inside TrainingList via callback
    const cities = useMemo(
        () => Array.from(new Set(trainings.map((t) => t.city).filter(Boolean) as string[])),
        [trainings]
    );

    const filtered = useMemo(() => {
        return trainings.filter((t) => {
            if (selectedCity !== "all" && t.city !== selectedCity) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return [t.title, t.location, t.coach, t.city, t.notes].some((v) => (v ?? "").toLowerCase().includes(q));
        });
    }, [trainings, query, selectedCity]);

    // actions
    const handleRegister = (t: Training) => {
        setTrainings((prev) => prev.map((p) => (p.id === t.id ? { ...p, registered: (p.registered ?? 0) + 1 } : p)));
        // TODO: persist / toast
    };

    const handleCreateTraining = (newT: Training) => {
        setTrainings((prev) => [newT, ...prev]);
    };

    const handleUpdateProgress = (id: string, progress: number) => {
        setTrainings((prev) => prev.map((p) => (p.id === id ? { ...p, progress } : p)));
    };

    const handleManage = (t: Training) => {
        // placeholder for manage flow (edit/cancel)
        // open create dialog prefilled or open a dedicated manage modal
        console.log("manage training", t);
    };

    // create opener guarded by coach view
    const handleOpenCreateGuarded = () => {
        if (isCoachView) setCreateOpen(true);
    };

    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Trainings</h1>
                    <p className="text-sm text-slate-500">Create and manage sessions as a coach, or register as a player.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-400">View</div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Player</span>

                            <Toggle pressed={isCoachView} onPressedChange={(v) => setIsCoachView(Boolean(v))} aria-label="Toggle coach view" />

                            <span className="text-xs text-slate-500">Coach</span>
                        </div>
                    </div>

                    <Filters
                        query={query}
                        setQuery={setQuery}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        cities={cities}
                        onOpenCreate={handleOpenCreateGuarded}
                    />
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <TrainingList
                        title="Upcoming sessions"
                        trainings={filtered}
                        onRegister={handleRegister}
                        isOrganizerView={isCoachView}
                        onUpdateProgress={handleUpdateProgress}
                        onManage={handleManage}
                    />

                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">All sessions</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full table-auto text-sm">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-3">Title</th>
                                            <th className="text-left px-4 py-3">Date</th>
                                            <th className="text-left px-4 py-3">Location</th>
                                            <th className="text-left px-4 py-3">Registered</th>
                                            <th className="text-left px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-slate-50">
                                        {trainings.map((t) => (
                                            <tr key={t.id} className="border-t">
                                                <td className="px-4 py-3">{t.title}</td>
                                                <td className="px-4 py-3">{formatDate(t.date)} {t.time ? `• ${t.time}` : ""}</td>
                                                <td className="px-4 py-3">{t.location}{t.city ? `, ${t.city}` : ""}</td>
                                                <td className="px-4 py-3">{t.registered}/{t.capacity ?? "—"}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {!isCoachView ? (
                                                            <Button size="sm" onClick={() => handleRegister(t)}>Register</Button>
                                                        ) : (
                                                            <Button variant="ghost" size="sm" onClick={() => handleManage(t)}>Manage</Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className="space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Quick stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-500">Total sessions</div>
                                    <div className="text-xl font-bold text-[#0f172a]">{trainings.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Open spots</div>
                                    <div className="text-xl font-bold text-[#22c55e]">
                                        {trainings.reduce((acc, t) => acc + ((t.capacity ?? Infinity) - (t.registered ?? 0) > 0 ? 1 : 0), 0)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Featured</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="text-sm text-slate-600">
                                Spotlight recent training results, coach highlights, or upcoming workshops.
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </section>

            <CreateTrainingDialog open={createOpen} setOpen={setCreateOpen} onCreate={handleCreateTraining} />
        </main>
    );
}
