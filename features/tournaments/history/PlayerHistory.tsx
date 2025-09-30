import HistoryCard from "./HistoryCard";
import type { Participation } from "@/hooks/useTournamentHistory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  items: Participation[];
  onView?: (id: string) => void;
};

export default function PlayerHistory({ items, onView }: Props) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg font-semibold text-[#0f172a]">Your tournament history</CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't participated in any tournaments yet.</p>
        ) : (
          <div className="grid gap-3">
            {items.map((it) => (
              <HistoryCard
                key={it.tournamentId}
                id={it.tournamentId}
                title={it.title}
                date={it.date}
                location={it.location}
                result={it.result}
                score={it.score}
                role="player"
                onView={onView}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
