"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import CreateTournamentDialog from "@/features/tournaments/CreateTournamentDialog";
import Filters from "@/features/tournaments/Filters";
import RegisterDialog from "@/features/tournaments/RegisterDialog";
import TournamentList from "@/features/tournaments/TournamentList";
import { useMemo, useState } from "react";

import { formatDate } from "@/lib/formatDate";
import type { Tournament } from "@/types/tournament";

const SAMPLE_TOURNAMENTS: Tournament[] = [
    {
        id: "t1",
        title: "City Open",
        startDate: "2025-10-05",
        endDate: "2025-10-06",
        location: "Central Court",
        city: "Springfield",
        capacity: 64,
        registered: 22,
        status: "upcoming",
        organizer: "Spring Paddle Club",
        entryFee: 15,
        description: "Open singles and doubles, all levels welcome.",
        // optional fields may be added by create dialog
    } as any,
    {
        id: "t2",
        title: "Autumn Classic",
        startDate: "2025-09-20",
        endDate: "2025-09-21",
        location: "North Arena",
        city: "Springfield",
        capacity: 32,
        registered: 32,
        status: "ongoing",
        organizer: "North Racquet Association",
        entryFee: 20,
        description: "Competitive draw, intermediate+.",
    } as any,
    {
        id: "t3",
        title: "Weekend Fun Doubles",
        startDate: "2025-11-02",
        location: "Community Center",
        city: "Riverton",
        capacity: 16,
        registered: 6,
        status: "upcoming",
        organizer: "Community Sports",
        entryFee: 10,
        description: "Casual doubles — beginner friendly.",
    } as any,
];

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>(SAMPLE_TOURNAMENTS);
    const [query, setQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
    const [selectedCity, setSelectedCity] = useState<string | "all">("all");

    // register modal state
    const [registerOpen, setRegisterOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

    // create modal state
    const [createOpen, setCreateOpen] = useState(false);

    // edit modal state
    const [editOpen, setEditOpen] = useState(false);
    const [editTournament, setEditTournament] = useState<Tournament | null>(null);

    // toggle between Player and Organizer view (false = Player, true = Organizer)
    const [isOrganizerView, setIsOrganizerView] = useState(false);

    const cities = useMemo(() => Array.from(new Set(tournaments.map((t) => t.city).filter(Boolean) as string[])), [tournaments]);

    const filtered = useMemo(() => {
        return tournaments.filter((t) => {
            if (filterStatus !== "all" && t.status !== filterStatus) return false;
            if (selectedCity !== "all" && t.city !== selectedCity) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return [t.title, t.location, t.organizer, t.city, t.description].some((v) => (v ?? "").toLowerCase().includes(q));
        });
    }, [tournaments, query, filterStatus, selectedCity]);

    // handlers
    function handleOpenRegister(t: Tournament) {
        setSelectedTournament(t);
        setRegisterOpen(true);
    }

    function handleConfirmRegistration(payload: { tournamentId: string; playerName: string; playerEmail?: string }) {
        setTournaments((prev) => prev.map((p) => (p.id === payload.tournamentId ? { ...p, registered: (p.registered ?? 0) + 1 } : p)));
        console.log("registered", payload);
    }

    function handleCreateTournament(newT: Tournament) {
        setTournaments((prev) => [newT, ...prev]);
    }

    // Edit flow
    function handleOpenEdit(t: Tournament) {
        setEditTournament(t);
        setEditOpen(true);
    }

    function handleUpdateTournament(updated: Tournament) {
        setTournaments((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        setEditTournament(null);
        setEditOpen(false);
    }

    // guarded create opener: only actually opens create dialog when organizer view is active
    const handleOpenCreateGuarded = () => {
        if (isOrganizerView) setCreateOpen(true);
    };

    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Tournaments</h1>
                    <p className="text-sm text-slate-500">Browse and register for nearby tournaments — or create one if you're organizing.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-400">View</div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Player</span>

                            <Toggle
                                pressed={isOrganizerView}
                                onPressedChange={(val) => setIsOrganizerView(Boolean(val))}
                                aria-label="Toggle organizer view"
                            />

                            <span className="text-xs text-slate-500">Organizer</span>
                        </div>
                    </div>

                    <Filters
                        query={query}
                        setQuery={setQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        cities={cities}
                        onOpenCreate={handleOpenCreateGuarded}
                    />
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* pass isOrganizerView so TournamentCard shows the correct actions */}
                    <TournamentList
                        title="Nearby & upcoming"
                        tournaments={filtered}
                        onRegister={handleOpenRegister}
                        isOrganizerView={isOrganizerView}
                        onEdit={handleOpenEdit}
                    />

                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">All tournaments</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full table-auto text-sm">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="text-left px-4 py-3">Title</th>
                                            <th className="text-left px-4 py-3">Dates</th>
                                            <th className="text-left px-4 py-3">Location</th>
                                            <th className="text-left px-4 py-3">Registered</th>
                                            <th className="text-left px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-slate-50">
                                        {tournaments.map((t) => (
                                            <tr key={t.id} className="border-t">
                                                <td className="px-4 py-3">{t.title}</td>
                                                <td className="px-4 py-3">
                                                    {formatDate(t.startDate)}
                                                    {t.endDate ? ` — ${formatDate(t.endDate)}` : ""}
                                                </td>
                                                <td className="px-4 py-3">{t.location}{t.city ? `, ${t.city}` : ""}</td>
                                                <td className="px-4 py-3">{t.registered}/{t.capacity ?? "—"}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {!isOrganizerView ? (
                                                            <Button size="sm" onClick={() => handleOpenRegister(t)}>Register</Button>
                                                        ) : (
                                                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(t)}>Manage</Button>
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
                                    <div className="text-xs text-slate-500">Total tournaments</div>
                                    <div className="text-xl font-bold text-[#0f172a]">{tournaments.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Upcoming</div>
                                    <div className="text-xl font-bold text-[#22c55e]">{tournaments.filter((t) => t.status === "upcoming").length}</div>
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
                                Highlight your featured tournaments here — maybe those with sponsor logos or current leaderboards.
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </section>

            <RegisterDialog
                tournament={selectedTournament}
                open={registerOpen}
                setOpen={setRegisterOpen}
                onConfirm={handleConfirmRegistration}
            />

            {/* Create dialog (for organizers) */}
            <CreateTournamentDialog open={createOpen} setOpen={setCreateOpen} onCreate={handleCreateTournament} />

            {/* Edit dialog reuses the same component and passes initialData + onUpdate */}
            <CreateTournamentDialog
                open={editOpen}
                setOpen={(v) => {
                    setEditOpen(v);
                    if (!v) setEditTournament(null);
                }}
                initialData={editTournament}
                onUpdate={handleUpdateTournament}
            />
        </main>
    );
}
