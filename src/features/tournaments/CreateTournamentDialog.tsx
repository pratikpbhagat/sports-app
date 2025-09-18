import { useState } from "react";
import type { FormEvent } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Tournament } from "@/types/tournament";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate: (payload: Tournament) => void;
};

/**
 * CreateTournamentDialog
 * - DialogContent explicitly has white background, text color and shadow so it's visible on dark overlays.
 */
export default function CreateTournamentDialog({ open, setOpen, onCreate }: Props) {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [capacity, setCapacity] = useState<number | "">("");
    const [entryFee, setEntryFee] = useState<number | "">("");
    const [description, setDescription] = useState("");

    const reset = () => {
        setTitle("");
        setStartDate("");
        setEndDate("");
        setLocation("");
        setCity("");
        setCapacity("");
        setEntryFee("");
        setDescription("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const newTournament: Tournament = {
            id: `t_${Date.now()}`,
            title,
            startDate,
            endDate: endDate || undefined,
            location,
            city,
            capacity: capacity === "" ? undefined : Number(capacity),
            registered: 0,
            status: "upcoming",
            organizer: "You (Organizer)",
            entryFee: entryFee === "" ? undefined : Number(entryFee),
            description,
        };

        onCreate(newTournament);
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>Create tournament</DialogTitle>
                    <DialogDescription>Fill the details to publish a new tournament.</DialogDescription>
                </DialogHeader>

                <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                    <label className="col-span-2">
                        <span className="text-xs text-slate-600">Title</span>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">Start date</span>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">End date (optional)</span>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">Location</span>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">City</span>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">Capacity</span>
                        <Input
                            value={capacity === "" ? "" : String(capacity)}
                            onChange={(e) => setCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                            type="number"
                            min={2}
                        />
                    </label>

                    <label>
                        <span className="text-xs text-slate-600">Entry fee (USD)</span>
                        <Input
                            value={entryFee === "" ? "" : String(entryFee)}
                            onChange={(e) => setEntryFee(e.target.value === "" ? "" : Number(e.target.value))}
                            type="number"
                            min={0}
                        />
                    </label>

                    <label className="col-span-2">
                        <span className="text-xs text-slate-600">Description</span>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>

                    <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
