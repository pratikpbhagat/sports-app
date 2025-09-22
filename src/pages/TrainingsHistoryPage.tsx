// src/app/(routes)/trainings/history/page.tsx
import { useState } from "react";
import PlayerTrainingHistory from "@/features/trainings/history/PlayerTrainingHistory";
import CoachTrainingHistory from "@/features/trainings/history/CoachTrainingHistory";
import { useTrainingHistory } from "@/hooks/useTrainingHistory";
import { Button } from "@/components/ui/button";

export default function TrainingsHistoryPage() {
  const { playerHistory, coachHistory, coachStats } = useTrainingHistory();
  const [view, setView] = useState<"player" | "coach">("player");

  function handleView(id: string) {
    // navigate to training detail or open modal
    console.log("view training", id);
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Training history</h1>
          <p className="text-sm text-slate-500">See the sessions you've attended or run, plus coach feedback and stats.</p>
        </div>

        <div className="inline-flex items-center rounded-md bg-white/5 p-1">
          <Button variant={view === "player" ? "default" : "ghost"} size="sm" onClick={() => setView("player")}>
            Player
          </Button>
          <Button variant={view === "coach" ? "default" : "ghost"} size="sm" onClick={() => setView("coach")}>
            Coach
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === "player" ? (
            <PlayerTrainingHistory items={playerHistory} onView={handleView} />
          ) : (
            <CoachTrainingHistory items={coachHistory} stats={coachStats} onView={handleView} />
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold text-[#0f172a]">Summary</h3>
            <p className="text-xs text-slate-500 mt-2">
              {view === "player"
                ? `You attended ${playerHistory.length} sessions.`
                : `You conducted ${coachHistory.length} sessions.`}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
