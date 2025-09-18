// features/trainings/CreateTrainingDialog.tsx
import { useState, type FormEvent } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Training } from "@/types/training";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate: (t: Training) => void;
};

export default function CreateTrainingDialog({ open, setOpen, onCreate }: Props) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [capacity, setCapacity] = useState<number | "">("");
    const [coach, setCoach] = useState("");
    const [notes, setNotes] = useState("");

    const reset = () => {
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setCity("");
        setCapacity("");
        setCoach("");
        setNotes("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const newTraining: Training = {
            id: `tr_${Date.now()}`,
            title,
            date,
            time,
            location,
            city: city || undefined,
            capacity: capacity === "" ? undefined : Number(capacity),
            registered: 0,
            coach: coach || "Coach",
            status: "scheduled",
            notes,
            progress: 0, // initial progress
        };

        onCreate(newTraining);
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>Create training session</DialogTitle>
                    <DialogDescription>Fill details to publish a training session.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="col-span-2">
                        <div className="text-xs text-slate-600">Title</div>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>

                    <label>
                        <div className="text-xs text-slate-600">Date</div>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </label>

                    <label>
                        <div className="text-xs text-slate-600">Time</div>
                        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </label>

                    <label>
                        <div className="text-xs text-slate-600">Location</div>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </label>

                    <label>
                        <div className="text-xs text-slate-600">City</div>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>

                    <label>
                        <div className="text-xs text-slate-600">Capacity</div>
                        <Input
                            type="number"
                            min={1}
                            value={capacity === "" ? "" : String(capacity)}
                            onChange={(e) => setCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                    </label>

                    <label className="col-span-2">
                        <div className="text-xs text-slate-600">Coach</div>
                        <Input value={coach} onChange={(e) => setCoach(e.target.value)} />
                    </label>

                    <label className="col-span-2">
                        <div className="text-xs text-slate-600">Notes</div>
                        <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
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
