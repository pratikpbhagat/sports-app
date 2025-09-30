import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TrainingHistoryCard from "./TrainingHistoryCard";
import type { TrainingParticipation } from "@/hooks/useTrainingHistory";

type Props = {
  items: TrainingParticipation[];
  stats: { totalConducted: number; avgAttendees: number };
  onView?: (id: string) => void;
};

export default function CoachTrainingHistory({ items, stats, onView }: Props) {
  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">Coach overview</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Total sessions</div>
              <div className="text-xl font-bold text-[#0f172a]">{stats.totalConducted}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Avg attendees</div>
              <div className="text-xl font-bold text-[#22c55e]">{stats.avgAttendees}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">Past sessions</CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">You haven't conducted any training sessions yet.</p>
          ) : (
            <div className="grid gap-3">
              {items.map((it) => (
                <TrainingHistoryCard
                  key={it.id}
                  id={it.id}
                  title={it.title}
                  date={it.date}
                  location={it.location}
                  attendeesCount={it.attendeesCount}
                  role="coach"
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
