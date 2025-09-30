import type { Tournament } from "@/types/tournament";

export type CategoryOptionKind = "singles" | "doubles" | "mixed" | "split" | "open" | "team" | "custom";

export type Category = {
    id: string;
    label: string;
    kind?: CategoryOptionKind;
    ageSplit?: string | null;
    maxParticipantsPerTeam?: number | null;
    fee?: number | null;
    maxSlotsPerCategory?: number | null;
    teamSubcategories?: string[];
    matchFormat?: MatchFormat | null;
    participants?: Participant[];
    registered?: number; // currently registered
    capacity?: number | null; // total slots (undefined/null = unlimited)
};

export type SessionRow = { id: string; date: string; time: string };

export type Contact = { id: string; name: string; phone: string };

export type MultiCategoryDiscount =
    | { type: "percent"; value: number }
    | { type: "fixed"; value: number }
    | null;

export type MatchFormatType = "rr+ko" | "league" | "knockout" | "custom";

export type MatchFormat = {
    categoryId: string;
    type: MatchFormatType;
    pointsPerGame?: number;        // e.g. 11
    gamesPerMatch?: number;        // e.g. best of 3 -> 3
    tieBreakTo?: number | null;    // e.g. 15 for tie-break (optional)
    description?: string | null;   // for custom
    rrPools?: number | null; // for round-robin: number of pools (optional)
    rrQualPerPool?: number | null; // for round-robin: number qualifying per pool (optional)
    rrFullRound?: boolean | null;
    rrMaxMatchesPerTeam?: number | null;
    koBracketSize?: number
    koAutoBrackets?: boolean
    koSeedMethod?: "random" | "ranking" | "manual"
    koSeedCount?: number
    koAutoFillByes?: boolean
    // other options later (seeding, byes, consolation, etc.)
};

/** A participant can be an individual or a team. Keep it small for now. */
export interface Participant {
    id: string;
    name: string;
    seed?: number; // optional seeding
}

/** A single pairing/match in a schedule/bracket */
export interface Matchup {
    id: string;
    players: Participant[]; // 1 or 2 players (bye = single)
    round?: number;
    bracketPos?: number;
    notes?: string | null;
    status?: "scheduled" | "completed" | "pending";
}

// minimal types for registrations — adapt to your app types
export type RegistrationStatus = "pending" | "approved" | "rejected" | "on_hold";

export type TournamentStatus = "upcoming" | "ongoing" | "completed";

export type RegistrationApplication = {
    id: string;
    participantName: string;
    duprId?: string | null;
    email?: string | null;
    categoryId: string;
    categoryLabel?: string | null;
    submittedAt?: string; // ISO date
    status?: RegistrationStatus;
    adminComment?: string | null;
};

export type TournamentFilterProps = {
    tournaments: Tournament[];
    isOrganizerView?: boolean;
    setIsOrganizerView?: (val: boolean) => void;
    query: string;
    setQuery: (q: string) => void;
    filterStatus: "all" | "upcoming" | "ongoing" | "completed";
    setFilterStatus: (status: "all" | "upcoming" | "ongoing" | "completed") => void;
    selectedCity: string | "all";
    setSelectedCity: (city: string | "all") => void;
    onOpenCreate?: () => void;
    onFiltered?: (filtered: Tournament[]) => void; // new callback
};

