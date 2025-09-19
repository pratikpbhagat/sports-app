// components/team/TeamMemberRow.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash } from "lucide-react";

export type Role = "admin" | "editor" | "viewer" | "coach";

type Member = {
  id: string;
  name?: string;
  email: string;
  role: Role;
  invited?: boolean; // invited but not accepted
};

type Props = {
  member: Member;
  canEdit?: boolean;
  onRoleChange?: (id: string, role: Role) => void;
  onRemove?: (id: string) => void;
};

export default function TeamMemberRow({ member, canEdit = true, onRoleChange, onRemove }: Props) {
  const [role, setRole] = useState<Role>(member.role);

  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-md hover:bg-slate-50 transition bg-white">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {member.name ? <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(member.name)}`} /> : <AvatarFallback>{member.email.charAt(0).toUpperCase()}</AvatarFallback>}
        </Avatar>

        <div>
          <div className="text-sm font-semibold text-[#0f172a]">{member.name ?? member.email}</div>
          <div className="text-xs text-slate-500">{member.email}{member.invited ? " • Invited" : ""}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-40">
          {canEdit ? (
            <Select onValueChange={(v) => { setRole(v as Role); onRoleChange?.(member.id, v as Role); }} defaultValue={member.role}>
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
          ) : (
            <div className="text-sm text-slate-600 capitalize">{role}</div>
          )}
        </div>

        {canEdit && (
          <Button variant="ghost" size="sm" onClick={() => onRemove?.(member.id)} aria-label={`Remove ${member.email}`}>
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
