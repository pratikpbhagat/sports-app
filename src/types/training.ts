export type Training = {
    id: string;
    title: string;
    date: string; // ISO date
    time?: string;
    location: string;
    city?: string;
    capacity?: number;
    registered?: number;
    coach?: string;
    status?: "scheduled" | "completed" | "cancelled";
    notes?: string;
    progress?: number; // 0-100
};
