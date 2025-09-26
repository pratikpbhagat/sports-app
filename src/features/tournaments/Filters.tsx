// src/features/tournaments/Filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import type { TournamentFilterProps } from "./types";

export default function Filters({
    tournaments,
    query,
    setQuery,
    filterStatus,
    setFilterStatus,
    selectedCity,
    setSelectedCity,
    onOpenCreate,
    onFiltered,
}: TournamentFilterProps) {

    const cities = useMemo(() => Array.from(new Set(tournaments.map((t) => t.city).filter(Boolean) as string[])), [tournaments]);

    // compute filtered list inside Filters
    const filtered = useMemo(() => {
        const q = query?.trim().toLowerCase() ?? "";
        return tournaments.filter((t) => {
            if (filterStatus !== "all" && t.status !== filterStatus) return false;
            if (selectedCity !== "all" && t.city !== selectedCity) return false;
            if (!q) return true;
            return [t.title, t.location, t.organizer, t.city, t.description].some((v) =>
                (v ?? "").toLowerCase().includes(q)
            );
        });
    }, [tournaments, query, filterStatus, selectedCity]);

    // notify parent when filtered changes
    useEffect(() => {
        onFiltered?.(filtered);
    }, [filtered, onFiltered]);

    return (
        <div className="flex items-center gap-3">
            <Input
                placeholder="Search tournaments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-[220px]"
            />

            <Select onValueChange={(v) => setFilterStatus(v as any)} value={filterStatus}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(v) => setSelectedCity(v as any)} value={selectedCity}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                            {c}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {onOpenCreate && (
                <Button onClick={onOpenCreate} variant="secondary">
                    Create Tournament
                </Button>
            )}
        </div>
    );
}
