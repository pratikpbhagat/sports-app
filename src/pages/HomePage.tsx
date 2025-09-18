import ListCard from "@/components/common/ListCard";
import type { ReactNode } from "react";

export default function HomePage() {
    // sample placeholder data — replace with real data / fetch as needed
    const tournaments = [
        { id: 1, title: "City Open", date: "2025-09-28", location: "Central Court", slots: 3 },
        { id: 2, title: "Autumn Classic", date: "2025-10-05", location: "North Arena", slots: 8 },
        { id: 3, title: "Friendly Doubles", date: "2025-10-12", location: "Community Center", slots: 4 },
    ];

    const trainings = [
        { id: 1, title: "Beginner Clinic", date: "2025-09-26", coach: "Alex R.", status: "Open" },
        { id: 2, title: "Advanced Drills", date: "2025-10-03", coach: "Sam T.", status: "Open" },
        { id: 3, title: "Strategy Workshop", date: "2025-10-09", coach: "Pat K.", status: "Full" },
    ];

    // New: last played tournaments with results
    const lastPlayed = [
        {
            id: "lp1",
            title: "River Cup",
            date: "2025-09-12",
            opponent: "Team A",
            result: "Win",
            score: "11-9, 11-7",
            level: "Semi-final",
        },
        {
            id: "lp2",
            title: "Summer Slam",
            date: "2025-08-30",
            opponent: "Team B",
            result: "Loss",
            score: "8-11, 11-13",
            level: "Quarter-final",
        },
    ];

    // New: recent trainings with coach feedback
    const recentTrainings = [
        {
            id: "rt1",
            title: "Advanced Drills",
            date: "2025-09-05",
            coach: "Sam T.",
            feedback: "Great footwork, keep focusing on third-shot consistency.",
            rating: 4, // 1-5
        },
        {
            id: "rt2",
            title: "Strategy Workshop",
            date: "2025-08-22",
            coach: "Pat K.",
            feedback: "Strong placement. Work on faster transitions to net.",
            rating: 5,
        },
    ];

    // optional: custom renderer for trainings to show coach and status pill
    const renderTraining = (tr: any): ReactNode => (
        <article className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 transition">
            <div>
                <h3 className="text-sm font-semibold text-[#0f172a]">{tr.title}</h3>
                <p className="text-xs text-slate-500">{tr.date} • Coach: {tr.coach}</p>
            </div>
            <div className="text-right">
                <span
                    className={`inline-block text-xs px-2 py-1 rounded-full ${tr.status === "Open" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-slate-200 text-slate-700"
                        }`}
                >
                    {tr.status}
                </span>
            </div>
        </article>
    );

    // renderer for last played tournaments (results)
    const renderLastPlayed = (t: any): ReactNode => {
        const isWin = t.result?.toLowerCase() === "win";
        return (
            <article className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 transition">
                <div>
                    <h3 className="text-sm font-semibold text-[#0f172a]">{t.title}</h3>
                    <p className="text-xs text-slate-500">
                        {t.date} • {t.level} • vs {t.opponent}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Score: {t.score}</p>
                </div>

                <div className="text-right">
                    <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${isWin ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"
                            }`}
                    >
                        {t.result}
                    </span>
                </div>
            </article>
        );
    };

    // renderer for recent training feedback items
    const renderRecentTraining = (r: any): ReactNode => {
        // simple stars for rating
        const stars = Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                className={`w-3 h-3 inline-block mr-0.5 ${i < r.rating ? "text-[#fbbf24]" : "text-slate-300"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
            >
                <path d="M10 1.5l2.6 5.26L18.5 8l-4 3.9L15.2 17 10 14.2 4.8 17l.7-5.1L1.5 8l5.9-.24L10 1.5z" />
            </svg>
        ));

        return (
            <article className="flex flex-col gap-2 p-3 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-[#0f172a]">{r.title}</h3>
                        <p className="text-xs text-slate-500">{r.date} • Coach: {r.coach}</p>
                    </div>

                    <div className="text-right">
                        <div className="text-xs">{stars}</div>
                    </div>
                </div>

                <p className="text-xs text-slate-600">{r.feedback}</p>
            </article>
        );
    };

    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <h1 className="sr-only">Home</h1>

            {/* First row: upcoming lists (two-up on md+) */}
            <section className="flex flex-col md:flex-row gap-6 mb-6">
                <ListCard
                    title="Upcoming Tournaments"
                    items={tournaments}
                    viewAllHref="/tournaments"
                    accentFrom="#7c3aed"
                    accentTo="#22c55e"
                />

                <ListCard
                    title="Upcoming Trainings"
                    items={trainings}
                    viewAllHref="/trainings"
                    accentFrom="#22c55e"
                    accentTo="#7c3aed"
                    renderItem={renderTraining}
                />
            </section>

            {/* Second row: recent activity */}
            <section className="flex flex-col md:flex-row gap-6">
                <ListCard
                    title="Last Played Tournaments"
                    items={lastPlayed}
                    viewAllHref="tournaments/history"
                    accentFrom="#7c3aed"
                    accentTo="#ef4444"
                    renderItem={renderLastPlayed}
                    emptyMessage="No recent matches."
                />

                <ListCard
                    title="Recent Trainings & Feedback"
                    items={recentTrainings}
                    viewAllHref="/trainings/history"
                    accentFrom="#22c55e"
                    accentTo="#7c3aed"
                    renderItem={renderRecentTraining}
                    emptyMessage="No recent trainings."
                />
            </section>
        </main>
    );
}
