import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {
    query: string;
    setQuery: (v: string) => void;
    filterStatus: "all" | "upcoming" | "ongoing" | "completed";
    setFilterStatus: (v: "all" | "upcoming" | "ongoing" | "completed") => void;
    selectedCity: string | "all";
    setSelectedCity: (v: string | "all") => void;
    cities: string[];
    onOpenCreate: () => void;
};

/**
 * Filters: compact search + status + city selects + create button.
 * Uses the app color palette (subtle) and white background for the control bar.
 */
export default function Filters({
    query,
    setQuery,
    filterStatus,
    setFilterStatus,
    selectedCity,
    setSelectedCity,
    cities,
    onOpenCreate,
}: Props) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-md shadow px-3 py-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search title, location, organizer..."
                    className="border-0 bg-transparent px-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Separator orientation="vertical" className="h-6 mx-2" />

                <Select onValueChange={(v) => setFilterStatus(v as any)} value={filterStatus}>
                    <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(v) => setSelectedCity(v as any)} value={selectedCity}>
                    <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All cities</SelectItem>
                        {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Button onClick={onOpenCreate} className="ml-2">
                    Create tournament
                </Button>
            </div>
        </div>
    );
}
