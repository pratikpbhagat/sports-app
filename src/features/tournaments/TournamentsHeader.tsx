"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Filters from "@/features/tournaments/Filters";
import type { TournamentFilterProps } from "./types";

export default function TournamentHeader({
    isOrganizerView,
    setIsOrganizerView,
    query,
    setQuery,
    filterStatus,
    setFilterStatus,
    selectedCity,
    setSelectedCity,
    onOpenCreate,
    tournaments,
}: TournamentFilterProps) {
    return (
        <header className="mb-6 space-y-4">
            {/* Row 1: Header + Switch */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Tournaments</h1>
                    <p className="text-sm text-slate-500">
                        Browse and register for nearby tournaments — or create one if you're organizing.
                    </p>
                </div>

                {/* Switch aligned to the right */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-500">Player</span>
                    <Switch checked={isOrganizerView} onCheckedChange={setIsOrganizerView} />
                    <span className="text-xs text-slate-500">Organizer</span>
                </div>
            </div>

            {/* Row 2: Filters + Create button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Filters expand full width on small screens */}
                <div className="w-full sm:flex-1">
                    <Filters
                        query={query}
                        setQuery={setQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        tournaments={tournaments}
                    />
                </div>

                {/* Create button visible only to organizers */}
                {isOrganizerView && (
                    <div className="w-full sm:w-auto flex justify-start sm:justify-end">
                        <Button onClick={onOpenCreate} aria-label="Create tournament">
                            Create Tournament
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
