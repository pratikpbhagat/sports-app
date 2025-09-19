import { useMemo, useState } from "react";

export type Participation = {
  tournamentId: string;
  title: string;
  date: string; // ISO
  location?: string;
  result?: "Winner" | "Runner-up" | "Semi" | "Quarter" | "Lost" | "DNF" | "Registered";
  score?: string;
  role?: "player" | "organizer";
  organizer?: string;
};

const MOCK_PARTICIPATIONS: Participation[] = [
  {
    tournamentId: "t1",
    title: "City Open",
    date: "2024-08-12",
    location: "Central Court",
    result: "Runner-up",
    score: "6-3, 4-6, 7-5",
    role: "player",
    organizer: "Spring Paddle Club",
  },
  {
    tournamentId: "t2",
    title: "Autumn Classic",
    date: "2024-10-01",
    location: "North Arena",
    result: "Registered",
    role: "player",
    organizer: "North Racquet Association",
  },
  {
    tournamentId: "t3",
    title: "Community Doubles",
    date: "2023-11-03",
    location: "Community Center",
    result: "Winner",
    score: "7-5, 6-2",
    role: "player",
    organizer: "Community Sports",
  },
];

const MOCK_ORGANIZED: Participation[] = [
  {
    tournamentId: "o1",
    title: "Neighborhood Cup 2023",
    date: "2023-05-20",
    location: "East Courts",
    role: "organizer",
  },
  {
    tournamentId: "o2",
    title: "Spring Invitational",
    date: "2024-04-15",
    location: "Main Arena",
    role: "organizer",
  },
];

export function useTournamentHistory(userId?: string) {
  // In a real app you'd fetch by userId and role. This is mock-local state.
  const [participations] = useState<Participation[]>(MOCK_PARTICIPATIONS);
  const [organized] = useState<Participation[]>(MOCK_ORGANIZED);

  const playerHistory = useMemo(() => participations.filter((p) => p.role === "player"), [participations]);
  const organizerHistory = useMemo(() => organized, [organized]);

  console.log(userId);

  // quick aggregated stats for organizer
  const organizerStats = useMemo(() => {
    // mock totals — in real life compute from tournaments API
    return {
      totalOrganized: organizerHistory.length,
      upcomingCreated: 1, // placeholder
      averageParticipants: 28, // placeholder
    };
  }, [organizerHistory]);

  return {
    playerHistory,
    organizerHistory,
    organizerStats,
  };
}
