import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TrainingHistoryCard from "./TrainingHistoryCard";
import type { TrainingParticipation } from "@/hooks/useTrainingHistory";

type Props = {
  items: TrainingParticipation[];
  onView?: (id: string) => void;
};

export default function PlayerTrainingHistory({ items, onView }: Props) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg font-semibold text-[#0f172a]">Training history</CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't attended any trainings yet.</p>
        ) : (
          <div className="grid gap-3">
            {items.map((it) => (
              <TrainingHistoryCard
                key={it.id}
                id={it.id}
                title={it.title}
                date={it.date}
                coach={it.coach}
                location={it.location}
                status={it.status}
                feedback={it.feedback}
                rating={it.rating}
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
