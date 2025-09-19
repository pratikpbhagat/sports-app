"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import InviteMemberDialog from "@/features/team/InviteMemberDialog";
import TeamMemberRow, { type Role as MemberRole } from "@/features/team/TeamMemberRow";
import { Plus } from "lucide-react";

type Member = {
  id: string;
  name?: string;
  email: string;
  role: MemberRole;
  invited?: boolean;
};

const INITIAL_MEMBERS: Member[] = [
  { id: "u1", name: "Alex Morgan", email: "alex@club.org", role: "admin" },
  { id: "u2", name: "Sam Taylor", email: "sam@club.org", role: "editor" },
  { id: "u3", name: "Pat Coach", email: "pat@academy.org", role: "coach" },
  { id: "u4", email: "guest1@example.com", role: "viewer", invited: true },
];

export default function TeamPage() {
  // team state
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [query, setQuery] = useState("");
  const [showOnlyInvited, setShowOnlyInvited] = useState(false);

  // role / view toggle: organizer vs coach
  const [view, setView] = useState<"organizer" | "coach">("organizer");

  // invite dialog state
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (showOnlyInvited && !m.invited) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (m.name ?? "").toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.includes(q as any);
    });
  }, [members, query, showOnlyInvited]);

  // handlers
  function handleInvite(payload: { name?: string; email: string; role: MemberRole }) {
    const newMember: Member = {
      id: `m_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      invited: true, // invited initially
    };
    setMembers((p) => [newMember, ...p]);
    // TODO: call backend invite API / send email
    console.log("invited", payload);
  }

  function handleRoleChange(id: string, role: MemberRole) {
    setMembers((p) => p.map((m) => (m.id === id ? { ...m, role } : m)));
    // TODO: persist role update
  }

  function handleRemove(id: string) {
    setMembers((p) => p.filter((m) => m.id !== id));
    // TODO: delete on backend
  }

  function handleAddDirect(payload: { name?: string; email: string; role: MemberRole }) {
    // If you want to add directly (no invite), set invited: false
    const newMember: Member = {
      id: `m_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      invited: false,
    };
    setMembers((p) => [newMember, ...p]);
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Team management</h1>
          <p className="text-sm text-slate-500">Add / manage team members, assign roles and invite coaches or admins.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md bg-white/5 p-1">
            <button
              onClick={() => setView("organizer")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${view === "organizer" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
            >
              Organizer view
            </button>
            <button
              onClick={() => setView("coach")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${view === "coach" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
            >
              Coach view
            </button>
          </div>

          <InviteMemberDialog
            open={inviteOpen}
            setOpen={setInviteOpen}
            onInvite={handleInvite}
            trigger={
              <Button variant="default" onClick={() => setInviteOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Invite
              </Button>
            }
          />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4 flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Members</CardTitle>

              <div className="flex items-center gap-2">
                <Input placeholder="Search members or emails..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
                <Separator orientation="vertical" className="h-6" />
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="form-checkbox" checked={showOnlyInvited} onChange={(e) => setShowOnlyInvited(e.target.checked)} />
                  <span>Invited only</span>
                </label>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-sm text-slate-500">No members found.</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((m) => (
                    <TeamMemberRow
                      key={m.id}
                      member={m}
                      canEdit={view === "organizer" || (view === "coach" && m.role === "coach")}
                      onRoleChange={handleRoleChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Activity / audit</CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <div className="text-sm text-slate-600">
                Recent activity & changes will be shown here. For example: <br />
                <ul className="list-disc ml-5 mt-2">
                  <li>Alex promoted Sam to editor — 2 days ago</li>
                  <li>Pat invited new coach — 5 days ago</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-semibold text-[#0f172a]">{view === "organizer" ? "Organizer tools" : "Coach tools"}</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {view === "organizer" ? (
                <>
                  <div className="text-sm text-slate-600">As an organizer you can invite admins, editors or viewers and manage access to tournament creation and management features.</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <Button onClick={() => setInviteOpen(true)}>Invite team member</Button>
                    <Button variant="ghost" onClick={() => alert("Export members (stub)")}>Export CSV</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-slate-600">As a coach you can add other coaches to your academy or invite assistant coaches.</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <Button onClick={() => setInviteOpen(true)}>Invite coach</Button>
                    <Button variant="ghost" onClick={() => alert("Manage academy (stub)")}>Manage academy</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg font-semibold text-[#0f172a]">Permissions quick reference</CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <ul className="text-sm space-y-2 text-slate-600">
                <li><strong>Admin</strong> — full access: manage team, edit tournaments/trainings, billing.</li>
                <li><strong>Editor</strong> — create/edit tournaments & trainings, cannot manage billing or team.</li>
                <li><strong>Viewer</strong> — read-only access to events & stats.</li>
                <li><strong>Coach</strong> — manage training sessions and view attendees/feedback.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
