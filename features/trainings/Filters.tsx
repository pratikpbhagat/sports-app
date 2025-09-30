// features/trainings/Filters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
    query: string;
    setQuery: (v: string) => void;
    selectedCity: string | "all";
    setSelectedCity: (v: string | "all") => void;
    cities: string[];
    onOpenCreate?: () => void; // create opener (guarded by caller)
};

export default function Filters({ query, setQuery, selectedCity, setSelectedCity, cities, onOpenCreate }: Props) {
    console.log(selectedCity)
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-md shadow px-3 py-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search title, location, coach..."
                    className="border-0 bg-transparent px-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Separator orientation="vertical" className="h-6 mx-2" />

                <Select onValueChange={(v) => setSelectedCity(v as any)} defaultValue="all">
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

            <div>
                <Button onClick={onOpenCreate} className="ml-2">
                    Create session
                </Button>
            </div>
        </div>
    );
}
