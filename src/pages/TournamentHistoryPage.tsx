import { useState } from "react";
import PlayerHistory from "@/features/tournaments/history/PlayerHistory";
import OrganizerHistory from "@/features/tournaments/history/OrganizerHistory";
import { useTournamentHistory } from "@/hooks/useTournamentHistory";
import { Button } from "@/components/ui/button";

export default function TournamentHistoryPage() {
  // in a real app, pass current userId
  const { playerHistory, organizerHistory, organizerStats } = useTournamentHistory();
  const [view, setView] = useState<"player" | "organizer">("player");

  function handleView(id: string) {
    // router push to tournament detail page, or open modal
    console.log("view tournament", id);
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Tournament history</h1>
          <p className="text-sm text-slate-500">See past tournaments you participated in or organized.</p>
        </div>

        <div className="inline-flex items-center rounded-md bg-white/5 p-1">
          <Button variant={view === "player" ? "default" : "ghost"} size="sm" onClick={() => setView("player")}>
            Player
          </Button>
          <Button variant={view === "organizer" ? "default" : "ghost"} size="sm" onClick={() => setView("organizer")}>
            Organizer
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === "player" ? (
            <PlayerHistory items={playerHistory} onView={handleView} />
          ) : (
            <OrganizerHistory items={organizerHistory} stats={organizerStats} onView={handleView} />
          )}
        </div>

        <aside className="space-y-4">
          {/* small summary / quick actions */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-sm font-semibold text-[#0f172a]">Summary</h3>
            <p className="text-xs text-slate-500 mt-2">
              {view === "player"
                ? `You participated in ${playerHistory.length} events.`
                : `You organized ${organizerHistory.length} events.`}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
