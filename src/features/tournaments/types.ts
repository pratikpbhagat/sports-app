export type CategoryOptionKind = "singles" | "doubles" | "mixed" | "split" | "open" | "team" | "custom";

export type Category = {
    id: string;
    label: string;
    kind: CategoryOptionKind;
    ageSplit?: string | null;
    maxParticipantsPerTeam?: number | null;
    fee?: number | null;
    maxSlotsPerCategory?: number | null;
    teamSubcategories?: string[];
    matchFormat?: MatchFormat | null;
};

export type SessionRow = { id: string; date: string; time: string };

export type Contact = { id: string; name: string; phone: string };

export type MultiCategoryDiscount =
    | { type: "percent"; value: number }
    | { type: "fixed"; value: number }
    | null;

export type MatchFormatType = "rr+ko" | "league" | "knockout" | "custom";

export type MatchFormat = {
    type: MatchFormatType;
    pointsPerGame?: number;        // e.g. 11
    gamesPerMatch?: number;        // e.g. best of 3 -> 3
    tieBreakTo?: number | null;    // e.g. 15 for tie-break (optional)
    description?: string | null;   // for custom
    // other options later (seeding, byes, consolation, etc.)
};