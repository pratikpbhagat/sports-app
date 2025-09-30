"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import type { Tournament } from "@/types/tournament";
import { useEffect, useRef, useState } from "react";
import CategoryFormatWorkflow from "./MatchFormatDialog/CategoryFormatWorkflow";
import RegistrationApprovalDialog from "./RegistrationApprovalDialog/RegistrationApprovalDialog";
import TournamentStatusBadge from "./TournamentStatusBadge";
import type { Category, RegistrationApplication } from "./types";

/**
 * TournamentCard with single "Manage" dropdown for organizer actions.
 */
export default function TournamentCard({
    t,
    onRegister,
    isOrganizerView,
    onEdit,
}: {
    t: Tournament;
    onRegister: (t: Tournament) => void;
    isOrganizerView?: boolean;
    onEdit?: (t: Tournament) => void;
}) {
    const seatsLeft = (t.capacity ?? 0) - (t.registered ?? 0);
    const full = t.capacity !== undefined && seatsLeft <= 0;
    const percentUsed = t.capacity ? Math.min(100, Math.round(((t.registered ?? 0) / t.capacity) * 100)) : 0;

    // sample categories — replace with real category data if available
    const categories: Category[] = [
        { id: "singles-men", label: "Singles — Men", registered: 12, capacity: 32 },
        { id: "singles-women", label: "Singles — Women", registered: 16, capacity: 16 },
        { id: "doubles", label: "Doubles", registered: 6, capacity: 16 },
    ];

    // dialogs state
    const [formatOpen, setFormatOpen] = useState(false);
    const [approvalOpen, setApprovalOpen] = useState(false);

    // sample applications state (move up if needed)
    const [applications, setApplications] = useState<RegistrationApplication[]>([
        {
            id: "r1",
            participantName: "Alice Johnson",
            duprId: "DUPR12345",
            categoryId: "singles-men",
            categoryLabel: "Singles – Men",
            submittedAt: new Date().toISOString(),
            status: "pending",
        },
        {
            id: "r2",
            participantName: "Bob Lee",
            duprId: "DUPR67890",
            categoryId: "doubles-mixed",
            categoryLabel: "Mixed Doubles",
            submittedAt: new Date().toISOString(),
            status: "pending",
        },
    ]);

    function handleUpdateApplication(update: { id: string; status: string; adminComment?: string | null }) {
        setApplications((prev) => prev.map((app) => (app.id === update.id ? { ...app, status: update.status as any, adminComment: update.adminComment ?? null } : app)));
    }

    function handleBulkUpdate(update: { ids: string[]; status: string; adminComment?: string | null }) {
        setApplications((prev) => prev.map((app) => (update.ids.includes(app.id) ? { ...app, status: update.status as any, adminComment: update.adminComment ?? null } : app)));
    }

    // Manage menu state
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // close menu on outside click
    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!menuRef.current) return;
            if (!(e.target instanceof Node)) return;
            if (!menuRef.current.contains(e.target)) setMenuOpen(false);
        }
        if (menuOpen) document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [menuOpen]);

    // description toggle
    const [showMore, setShowMore] = useState(false);
    const shortDesc = (t.description ?? "").slice(0, 140);

    return (
        <article className="w-full bg-white rounded-lg shadow-sm border p-4 transition hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-7">
                    <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-md bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                            {t.title.split(" ").slice(0, 2).map(w => w[0]).join("")}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#0f172a] truncate">{t.title}</h3>
                                <TournamentStatusBadge status={t.status} />
                            </div>

                            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2 items-center">
                                <div>{formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : ""}</div>
                                <span>•</span>
                                <div>{t.location}{t.city ? `, ${t.city}` : ""}</div>
                                {t.entryFee != null && <><span>•</span><div>{t.entryFee ? `$${t.entryFee}` : "Free"}</div></>}
                            </div>

                            <div className="mt-2 text-sm text-slate-600">
                                {!showMore ? (
                                    <div>
                                        {shortDesc}
                                        {(t.description ?? "").length > 140 && (
                                            <button className="ml-2 text-xs text-[#7c3aed] hover:underline" onClick={() => setShowMore(true)}>Show more</button>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {t.description}
                                        <button className="ml-2 text-xs text-slate-500 hover:underline" onClick={() => setShowMore(false)}>Show less</button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {categories.slice(0, 4).map((c) => (
                                    <span key={c.id} className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-700">{c.label}</span>
                                ))}
                                {categories.length > 4 && <span className="text-xs px-2 py-1 bg-slate-50 rounded-full text-slate-500">+{categories.length - 4} more</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <div className="text-xs text-slate-500">Capacity</div>
                    <div className="mt-1">
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${percentUsed}%`, background: percentUsed >= 90 ? "#ef4444" : "#22c55e" }} />
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{t.registered ?? 0} / {t.capacity ?? "—"} registered • {percentUsed}%</div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                        Seats left: <span className="font-medium text-slate-700">{t.capacity ? seatsLeft : "—"}</span>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                        Organizer:
                        <div className="text-sm text-slate-700">{t.organizer}</div>
                    </div>
                </div>

                {/* Actions column (single Manage button for organizers) */}
                <div className="md:col-span-2 flex flex-col items-end gap-2 relative">
                    {!isOrganizerView ? (
                        <Button size="sm" onClick={() => onRegister(t)} disabled={full || t.status === "completed"}>
                            {t.status === "ongoing" ? "Join" : full ? "Full" : "Register"}
                        </Button>
                    ) : (
                        <>
                            <div ref={menuRef} className="relative">
                                <Button size="sm" onClick={() => setMenuOpen((s) => !s)}>Manage</Button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                                        <ul className="p-1">
                                            <li>
                                                <Button
                                                    className="w-full justify-start text-left px-3 py-2 text-sm hover:bg-slate-50"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        onEdit?.(t);
                                                    }}
                                                    variant="ghost"
                                                >
                                                    Edit
                                                </Button>

                                            </li>

                                            <li>
                                                <Button
                                                    className="w-full justify-start px-3 py-2 text-sm hover:bg-slate-50"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setFormatOpen(true);
                                                    }}
                                                    variant="ghost"
                                                >
                                                    Choose Format
                                                </Button>
                                            </li>

                                            <li>
                                                <Button
                                                    className="w-full justify-start px-3 py-2 text-sm hover:bg-slate-50"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setApprovalOpen(true);
                                                    }}
                                                    variant="ghost"
                                                >
                                                    Registrations
                                                </Button>
                                            </li>

                                            <li>
                                                <Button
                                                    className="w-full justify-start px-3 py-2 text-sm text-red-600 hover:bg-slate-50"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        // perform cancel action - replace with actual logic
                                                        console.log("Cancel tournament", t.id);
                                                    }}
                                                    variant="ghost"
                                                >
                                                    Cancel tournament
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <CategoryFormatWorkflow
                open={formatOpen}
                onOpenChange={(v) => {
                    setFormatOpen(v);
                }}
                categories={categories}
                onSave={(selections) => {
                    console.log("formats saved:", selections);
                }}
            />

            <RegistrationApprovalDialog
                open={approvalOpen}
                onOpenChange={setApprovalOpen}
                applications={applications}
                onUpdateApplication={handleUpdateApplication}
                onBulkUpdate={handleBulkUpdate}
            />
        </article>
    );
}
