import HistoryCard from "./HistoryCard";
import type { Participation } from "@/hooks/useTournamentHistory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  items: Participation[]; // organized tournaments
  stats: { totalOrganized: number; upcomingCreated: number; averageParticipants: number };
  onView?: (id: string) => void;
};

export default function OrganizerHistory({ items, stats, onView }: Props) {
  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">Organizer overview</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-500">Total organized</div>
              <div className="text-xl font-bold text-[#0f172a]">{stats.totalOrganized}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Upcoming created</div>
              <div className="text-xl font-bold text-[#22c55e]">{stats.upcomingCreated}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Avg participants</div>
              <div className="text-xl font-bold text-[#7c3aed]">{stats.averageParticipants}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">Past tournaments you organized</CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No past tournaments found.</p>
          ) : (
            <div className="grid gap-3">
              {items.map((it) => (
                <HistoryCard
                  key={it.tournamentId}
                  id={it.tournamentId}
                  title={it.title}
                  date={it.date}
                  location={it.location}
                  role="organizer"
                  onView={onView}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
