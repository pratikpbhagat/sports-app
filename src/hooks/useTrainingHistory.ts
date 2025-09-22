import { useMemo, useState } from "react";

export type TrainingParticipation = {
  id: string;
  title: string;
  date: string; // ISO
  coach?: string;
  location?: string;
  status?: "attended" | "registered" | "missed";
  feedback?: string | null; // player's feedback from coach or coach -> player notes
  rating?: number | null; // 1-5
  role?: "player" | "coach";
  attendeesCount?: number;
};

const MOCK_PLAYER_HISTORY: TrainingParticipation[] = [
  {
    id: "tr1",
    title: "Beginner Clinic",
    date: "2024-09-26",
    coach: "Alex R.",
    location: "Court 1",
    status: "attended",
    feedback: "Good footwork, work on backhand consistency",
    rating: 4,
    role: "player",
  },
  {
    id: "tr2",
    title: "Advanced Drills",
    date: "2024-10-03",
    coach: "Sam T.",
    location: "Court 2",
    status: "attended",
    feedback: "Great intensity, improve serves",
    rating: 5,
    role: "player",
  },
  {
    id: "tr3",
    title: "Strategy Workshop",
    date: "2024-10-09",
    coach: "Pat K.",
    location: "Main Hall",
    status: "registered",
    feedback: null,
    rating: null,
    role: "player",
  },
];

const MOCK_COACH_HISTORY: TrainingParticipation[] = [
  {
    id: "c1",
    title: "Beginner Clinic",
    date: "2024-09-26",
    coach: "You",
    location: "Court 1",
    attendeesCount: 12,
    role: "coach",
  },
  {
    id: "c2",
    title: "Advanced Drills",
    date: "2024-10-03",
    coach: "You",
    location: "Court 2",
    attendeesCount: 8,
    role: "coach",
  },
  {
    id: "c3",
    title: "Strategy Workshop",
    date: "2024-10-09",
    coach: "You",
    location: "Main Hall",
    attendeesCount: 20,
    role: "coach",
  },
];

export function useTrainingHistory(userId?: string) {
  // Replace these with real API calls scoped by userId/role.
  const [playerHistory] = useState<TrainingParticipation[]>(MOCK_PLAYER_HISTORY);
  const [coachHistory] = useState<TrainingParticipation[]>(MOCK_COACH_HISTORY);

  const recentPlayer = useMemo(() => playerHistory.slice(0, 20), [playerHistory]);
  const recentCoach = useMemo(() => coachHistory.slice(0, 20), [coachHistory]);

  console.log(userId);

  // quick stats for coach view
  const coachStats = useMemo(() => {
    const total = recentCoach.length;
    const avgAttendees =
      recentCoach.length === 0 ? 0 : Math.round(recentCoach.reduce((s, it) => s + (it.attendeesCount ?? 0), 0) / recentCoach.length);
    return { totalConducted: total, avgAttendees };
  }, [recentCoach]);

  return {
    playerHistory: recentPlayer,
    coachHistory: recentCoach,
    coachStats,
  };
}
