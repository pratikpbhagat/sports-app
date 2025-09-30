// components/TournamentStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import type { TournamentStatus } from "./types"; // adjust path

type Props = {
    status?: TournamentStatus | string | null;
};

export default function TournamentStatusBadge({ status }: Props) {
    const map: Record<string, { label: string; className: string }> = {
        ongoing: { label: "Ongoing", className: "bg-[#7c3aed]/10 text-[#7c3aed]" },
        upcoming: { label: "Upcoming", className: "bg-[#22c55e]/10 text-[#22c55e]" },
        completed: { label: "Completed", className: "bg-slate-200 text-slate-700" },
    };

    // Normalize and pick mapping, fallback to unknown
    const key = (typeof status === "string" ? status : "")?.toLowerCase();
    const info = map[key] ?? { label: status ? String(status) : "Unknown", className: "bg-slate-100 text-slate-700" };

    return (
        <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${info.className}`} asChild={false}>
            <span>{info.label}</span>
        </Badge>
    );
}
