"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TournamentCard from "@/features/tournaments/TournamentCard";
import type { Tournament } from "@/types/tournament";
import { useMemo, useState } from "react";

type Props = {
    title?: string;
    tournaments: Tournament[];
    onRegister: (t: Tournament) => void;
    isOrganizerView?: boolean;
    subtitle?: string | null;
    onEdit?: (t: Tournament) => void;
};

function makePagesArray(totalPages: number, current: number) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    pages.add(current);
    if (current - 1 > 1) pages.add(current - 1);
    if (current - 2 > 1) pages.add(current - 2);
    if (current + 1 < totalPages) pages.add(current + 1);
    if (current + 2 < totalPages) pages.add(current + 2);

    return Array.from(pages).sort((a, b) => a - b);
}

/**
 * TournamentList
 * - Re-usable list that shows a card with a grid of TournamentCard.
 * - Adds client-side pagination controls using shadcn components.
 */
export default function TournamentList({
    title = "Tournaments",
    tournaments,
    onRegister,
    isOrganizerView = false,
    subtitle = null,
    onEdit,
}: Props) {
    // pagination state
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const total = tournaments.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // ensure page stays valid when pageSize or tournaments change
    useMemo(() => {
        if (page > totalPages) setPage(totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return tournaments.slice(start, start + pageSize);
    }, [tournaments, page, pageSize]);

    const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endIndex = Math.min(total, (page - 1) * pageSize + paged.length);

    const pagesArray = makePagesArray(totalPages, page);

    function goTo(p: number) {
        const pn = Math.max(1, Math.min(totalPages, p));
        setPage(pn);
        // optionally scroll into view:
        // document.getElementById("tournament-list-root")?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#7c3aed]/5 to-[#22c55e]/5">
                <div>
                    <CardTitle className="text-lg font-semibold text-[#0f172a]">{title}</CardTitle>
                    {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="bg-[#7c3aed]/10 text-[#7c3aed]">Nearby</Badge>
                    <Badge className="bg-[#22c55e]/10 text-[#22c55e]">Upcoming</Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3" id="tournament-list-root">
                {tournaments.length === 0 ? (
                    <p className="text-sm text-slate-500">No tournaments match your filters.</p>
                ) : (
                    <div className="grid gap-3">
                        {paged.map((t) => (
                            <TournamentCard key={t.id} t={t} onRegister={onRegister} isOrganizerView={isOrganizerView} onEdit={onEdit} />
                        ))}
                    </div>
                )}

                {total > 0 && (
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-sm text-slate-600">
                            Showing <span className="font-medium text-slate-900">{startIndex}</span>–<span className="font-medium text-slate-900">{endIndex}</span> of <span className="font-medium">{total}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* page size using shadcn Select */}
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-slate-500 hidden sm:block">Per page</div>

                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(val) => {
                                        const ps = Number(val);
                                        setPageSize(ps);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[86px] h-8">
                                        <SelectValue placeholder={`${pageSize}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* prev */}
                            <Button size="sm" variant="ghost" onClick={() => goTo(page - 1)} disabled={page <= 1}>
                                Prev
                            </Button>

                            {/* page numbers (compact with ellipsis) */}
                            <nav aria-label="Pagination" className="flex items-center gap-1">
                                {pagesArray.map((p, i) => {
                                    const prev = pagesArray[i - 1];
                                    if (prev !== undefined && p - prev > 1) {
                                        return (
                                            <span key={`gap-${i}`} className="px-2 text-sm text-slate-400 select-none">
                                                …
                                            </span>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={p}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => goTo(p)}
                                            aria-current={p === page ? "page" : undefined}
                                            className={p === page ? "bg-[#7c3aed]/10 text-[#7c3aed] font-medium" : ""}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                            </nav>

                            {/* next */}
                            <Button size="sm" variant="ghost" onClick={() => goTo(page + 1)} disabled={page >= totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
