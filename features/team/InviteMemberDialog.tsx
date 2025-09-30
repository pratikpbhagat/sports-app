"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export type Role = "admin" | "editor" | "viewer" | "coach";

type Props = {
  trigger?: React.ReactNode;
  open: boolean;
  setOpen: (v: boolean) => void;
  defaultRole?: Role;
  onInvite: (payload: { name?: string; email: string; role: Role }) => void;
};

export default function InviteMemberDialog({ trigger, open, setOpen, defaultRole = "viewer", onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>(defaultRole);

  const reset = () => {
    setEmail("");
    setName("");
    setRole(defaultRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onInvite({ name, email, role });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle>Invite / Add member</DialogTitle>
          <DialogDescription>Invite a new team member (they'll receive an email) or add someone to your academy.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs text-slate-600">Full name (optional)</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </label>

          <label className="block">
            <span className="text-xs text-slate-600">Email</span>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email" required />
          </label>

          <label className="block">
            <span className="text-xs text-slate-600">Role</span>
            <Select onValueChange={(v) => setRole(v as Role)} defaultValue={defaultRole}>
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => { reset(); setOpen(false); }} type="button">Cancel</Button>
            <Button type="submit">Send invite</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
