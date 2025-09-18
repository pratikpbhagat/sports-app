import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tournament } from "@/types/tournament";
import TournamentCard from "@/features/tournaments/TournamentCard";

type Props = {
    title?: string;
    tournaments: Tournament[];
    onRegister: (t: Tournament) => void;
    isOrganizerView?: boolean;
    subtitle?: string | null;
};

/**
 * TournamentList
 * - Re-usable list that shows a card with a grid of TournamentCard.
 * - All cards use shadow (no border).
 */
export default function TournamentList({ title = "Tournaments", tournaments, onRegister, isOrganizerView = false, subtitle = null }: Props) {
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

            <CardContent className="p-4 space-y-3">
                {tournaments.length === 0 ? (
                    <p className="text-sm text-slate-500">No tournaments match your filters.</p>
                ) : (
                    <div className="grid gap-3">
                        {tournaments.map((t) => (
                            <TournamentCard key={t.id} t={t} onRegister={onRegister} isOrganizerView={isOrganizerView} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
