"use client";

import CreateTournamentDialog from "@/features/tournaments/CreateTournamentDialog";
import RegisterDialog from "@/features/tournaments/RegisterDialog";
import TournamentList from "@/features/tournaments/TournamentList";
import { useState } from "react";

import TournamentHeader from "@/features/tournaments/TournamentsHeader";
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
    } as Tournament,
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
    } as Tournament,
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
    } as Tournament,
    {
        id: "t4",
        title: "Summer Smash",
        startDate: "2025-08-15",
        endDate: "2025-08-16",
        location: "South Park",
        city: "Springfield",
        capacity: 32,
        registered: 10,
        status: "upcoming",
        organizer: "Springfield Tennis Club",
        entryFee: 25,
        description: "Fun summer tournament with prizes.",
    } as Tournament,
    {
        id: "t5",
        title: "Downtown Doubles",
        startDate: "2025-09-15",
        endDate: "2025-09-16",
        location: "Downtown Court",
        city: "Springfield",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Downtown Sports Club",
        entryFee: 20,
        description: "Exciting doubles tournament in the heart of the city.",
    } as Tournament,
    {
        id: "t6",
        title: "Riverton Open",
        startDate: "2025-10-10",
        endDate: "2025-10-11",
        location: "Riverton Sports Complex",
        city: "Riverton",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Riverton Sports Club",
        entryFee: 20,
        description: "Exciting singles and doubles tournament.",
    } as Tournament,
    {
        id: "t7",
        title: "Lakeside Tournament",
        startDate: "2025-11-15",
        endDate: "2025-11-16",
        location: "Lakeside Park",
        city: "Lakeside",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Lakeside Sports Club",
        entryFee: 20,
        description: "Exciting singles and doubles tournament.",
    } as Tournament,
    {
        id: "t8",
        title: "Hilltop Championship",
        startDate: "2025-12-01",
        endDate: "2025-12-02",
        location: "Hilltop Stadium",
        city: "Hilltop",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Hilltop Sports Club",
        entryFee: 20,
        description: "Exciting singles and doubles tournament.",
    } as Tournament,
    {
        id: "t9",
        title: "Valley Invitational",
        startDate: "2025-12-10",
        endDate: "2025-12-11",
        location: "Valley Arena",
        city: "Valley",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Valley Sports Club",
        entryFee: 20,
        description: "Exciting singles and doubles tournament.",
    } as Tournament,
    {
        id: "t10",
        title: "Mountain Open",
        startDate: "2026-01-05",
        endDate: "2026-01-06",
        location: "Mountain Court",
        city: "Mountain",
        capacity: 32,
        registered: 12,
        status: "upcoming",
        organizer: "Mountain Sports Club",
        entryFee: 20,
        description: "Exciting singles and doubles tournament.",
    } as Tournament
];

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>(SAMPLE_TOURNAMENTS);
    const [query, setQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
    const [selectedCity, setSelectedCity] = useState<string | "all">("all");

    const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(tournaments);

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
            <TournamentHeader
                isOrganizerView={isOrganizerView}
                setIsOrganizerView={setIsOrganizerView}
                query={query}
                setQuery={setQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                tournaments={tournaments}
                onOpenCreate={handleOpenCreateGuarded}
                onFiltered={(f) => setFilteredTournaments(f)}
            />

            <section className="space-y-4">
                <TournamentList
                    title={isOrganizerView ? "My Tournaments" : "Nearby & upcoming"}
                    tournaments={filteredTournaments}
                    onRegister={handleOpenRegister}
                    isOrganizerView={isOrganizerView}
                    onEdit={handleOpenEdit}
                />
            </section>

            <RegisterDialog
                tournament={selectedTournament}
                open={registerOpen}
                setOpen={setRegisterOpen}
                onConfirm={handleConfirmRegistration}
            />

            <CreateTournamentDialog
                open={createOpen || editOpen}
                setOpen={(v) => {
                    if (!v) {
                        setCreateOpen(false);
                        setEditOpen(false);
                        setEditTournament(null);
                    } else {
                        if (editTournament) {
                            setEditOpen(true);
                        } else {
                            setCreateOpen(true);
                        }
                    }
                }}
                initialData={editTournament}
                onCreate={handleCreateTournament}
                onUpdate={handleUpdateTournament}
            />
        </main>
    );
}
