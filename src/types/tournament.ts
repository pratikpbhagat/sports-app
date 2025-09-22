import type { Category } from "@/features/tournaments/types";

export type Tournament = {
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
    location: string;
    city?: string;
    capacity?: number;
    registered?: number;
    status?: "upcoming" | "ongoing" | "completed";
    organizer?: string;
    entryFee?: number;
    description?: string;
    categories?: Category[];
};