export type CategoryOptionKind = "singles" | "doubles" | "mixed" | "split" | "open" | "team" | "custom";

export type CategoryOption = {
    id: string;
    label: string;
    kind: CategoryOptionKind;
    ageSplit?: string | null;
    maxParticipantsPerTeam?: number | null;
    fee?: number | null;
    maxSlotsPerCategory?: number | null;
    teamSubcategories?: string[];
};

export type SessionRow = { id: string; date: string; time: string };

export type Contact = { id: string; name: string; phone: string };

export type MultiCategoryDiscount =
    | { type: "percent"; value: number }
    | { type: "fixed"; value: number }
    | null;
