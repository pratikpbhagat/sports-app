import { Badge } from "@/components/ui/badge";
import type { RegistrationStatus } from "@/features/tournaments/types";

type StatusInfo = {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string; // optional for fine-grained overrides
};

export default function StatusBadge({ status }: { status: RegistrationStatus }) {
    const map: Record<RegistrationStatus, StatusInfo> = {
        pending: { label: "Pending", variant: "outline", className: "bg-yellow-100 text-yellow-800 border-transparent" },
        approved: { label: "Approved", variant: "secondary", className: "bg-green-100 text-green-800" },
        rejected: { label: "Rejected", variant: "destructive", className: "bg-red-100 text-red-800" },
        on_hold: { label: "On hold", variant: "outline", className: "bg-slate-100 text-slate-800 border-transparent" },
    };

    const info = map[status];

    // Use Badge and allow className to tweak background/text if needed.
    // We set variant so your base styles apply, but className may override colors.
    return (
        <Badge variant={info.variant ?? "default"} className={info.className}>
            {info.label}
        </Badge>
    );
}
