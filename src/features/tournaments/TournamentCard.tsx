import { Button } from "@/components/ui/button";
import type { Tournament } from "@/types/tournament";
import { formatDate } from "@/lib/formatDate";


export default function TournamentCard({
    t,
    onRegister,
    isOrganizerView,
}: {
    t: Tournament;
    onRegister: (t: Tournament) => void;
    isOrganizerView?: boolean;
}) {
    const seatsLeft = (t.capacity ?? 0) - (t.registered ?? 0);
    const full = t.capacity !== undefined && seatsLeft <= 0;
    const statusColor =
        t.status === "ongoing"
            ? "bg-[#7c3aed]/10 text-[#7c3aed]"
            : t.status === "upcoming"
                ? "bg-[#22c55e]/10 text-[#22c55e]"
                : "bg-slate-200 text-slate-700";


    return (
        <article className="p-4 rounded-lg bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#0f172a]">{t.title}</h3>
                    <p className="text-xs text-slate-500">
                        {formatDate(t.startDate)}{t.endDate ? ` — ${formatDate(t.endDate)}` : ""} • {t.location}
                        {t.city ? ` • ${t.city}` : ""}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.description}</p>


                    <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${statusColor}`}>
                            {t.status}
                        </span>
                        <span className="text-xs text-slate-500">{t.organizer}</span>
                    </div>
                </div>


                <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <div className="text-sm font-medium text-[#0f172a]">{t.entryFee ? `$${t.entryFee}` : "Free"}</div>
                        <div className="text-xs text-slate-500">{t.capacity ? `${t.registered ?? 0}/${t.capacity}` : `${t.registered ?? 0} registered`}</div>
                    </div>


                    {!isOrganizerView ? (
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => onRegister(t)} disabled={full || t.status === "completed"}>
                                {t.status === "ongoing" ? "Join" : full ? "Full" : "Register"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}