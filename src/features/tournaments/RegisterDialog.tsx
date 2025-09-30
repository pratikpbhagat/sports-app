import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Tournament } from "@/types/tournament";
import type { FormEvent } from "react";
import { useState } from "react";


export default function RegisterDialog({
    tournament,
    open,
    setOpen,
    onConfirm,
}: {
    tournament?: Tournament | null;
    open: boolean;
    setOpen: (v: boolean) => void;
    onConfirm: (payload: { tournamentId: string; playerName: string; playerEmail?: string }) => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");


    const handleClose = () => {
        setName("");
        setEmail("");
        setOpen(false);
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!tournament) return;
        onConfirm({ tournamentId: tournament.id, playerName: name, playerEmail: email });
        handleClose();
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>Register for {tournament?.title}</DialogTitle>
                    <DialogDescription>
                        Confirm your details to register. Entry fee: {tournament?.entryFee ? `$${tournament.entryFee}` : "Free"}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <label className="block">
                        <span className="text-xs text-slate-600">Full name</span>
                        <Input value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>

                    <label className="block">
                        <span className="text-xs text-slate-600">Email (optional)</span>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                    </label>

                    <div className="flex justify-end gap-2 mt-3">
                        <Button variant="destructive" onClick={handleClose} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">Confirm registration</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}