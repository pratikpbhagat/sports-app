"use client";

import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check as IconCheck, X as IconX, Pause } from "lucide-react"; // replace with available icons or lucide-react imports
import { useMemo, useState } from "react";
import type { RegistrationApplication, RegistrationStatus } from "../types";

type Props = {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    applications: RegistrationApplication[];
    // called for single update (immediately) or batch; parent should persist/update state
    onUpdateApplication: (update: { id: string; status: RegistrationStatus; adminComment?: string | null }) => void;
    onBulkUpdate?: (updates: { ids: string[]; status: RegistrationStatus; adminComment?: string | null }) => void;
};

export default function RegistrationApprovalDialog({
    open,
    onOpenChange,
    applications,
    onUpdateApplication,
    onBulkUpdate,
}: Props) {
    const [query, setQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | RegistrationStatus | "">("all");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [inlineComments, setInlineComments] = useState<Record<string, string>>({});
    const [bulkComment, setBulkComment] = useState("");

    // filtered and searchable list
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return applications.filter((a) => {
            if (filterStatus !== "all" && filterStatus !== "" && a.status !== filterStatus) return false;
            if (!q) return true;
            return (
                (a.participantName ?? "").toLowerCase().includes(q) ||
                (a.duprId ?? "").toLowerCase().includes(q) ||
                (a.categoryLabel ?? a.categoryId ?? "").toLowerCase().includes(q) ||
                (a.email ?? "").toLowerCase().includes(q)
            );
        });
    }, [applications, query, filterStatus]);

    function toggleSelect(id: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function selectAllOnPage() {
        setSelectedIds(new Set(filtered.map((f) => f.id)));
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    function handleStatusChange(id: string, status: RegistrationStatus) {
        const comment = inlineComments[id] ?? null;
        onUpdateApplication({ id, status, adminComment: comment });
    }

    function handleBulkAction(status: RegistrationStatus) {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        const comment = bulkComment || null;
        if (onBulkUpdate) {
            onBulkUpdate({ ids, status, adminComment: comment });
        } else {
            // fallback: call single update repeatedly
            ids.forEach((id) => onUpdateApplication({ id, status, adminComment: comment }));
        }
        // clear selection / comment after bulk action
        clearSelection();
        setBulkComment("");
    }

    function setInlineCommentFor(id: string, v: string) {
        setInlineComments((prev) => ({ ...prev, [id]: v }));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl bg-white text-[#0f172a] rounded-lg shadow-lg p-4">
                <DialogHeader>
                    <DialogTitle>Manage registrations</DialogTitle>
                    <div className="text-xs text-slate-500 mt-1">Approve, reject or place registrations on hold. Add optional comments for participants.</div>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name / DUPr / category / email" />
                            <Select onValueChange={(v) => setFilterStatus(v as any)} defaultValue="all">
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="on_hold">On hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-xs text-slate-500">Selected: <strong>{selectedIds.size}</strong></div>
                            <Button variant="outline" size="sm" onClick={selectAllOnPage}>Select all</Button>
                            <Button variant="destructive" size="sm" onClick={clearSelection}>Clear</Button>
                        </div>
                    </div>

                    {/* bulk comment + actions */}
                    <div className="border rounded p-3 bg-slate-50">
                        <div className="text-sm font-medium">Bulk actions</div>
                        <div className="text-xs text-slate-500 mb-2">Apply action to selected applications</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="md:col-span-2">
                                <Label className="text-xs">Comment (optional)</Label>
                                <Textarea value={bulkComment} onChange={(e) => setBulkComment(e.target.value)} placeholder="Add a comment/reason to include for all selected" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button onClick={() => handleBulkAction("approved")}><IconCheck className="inline w-4 h-4 mr-1" /> Approve</Button>
                                <Button variant="secondary" onClick={() => handleBulkAction("rejected")}><IconX className="inline w-4 h-4 mr-1" /> Reject</Button>
                                <Button variant="outline" onClick={() => handleBulkAction("on_hold")}><Pause className="inline w-4 h-4 mr-1" /> Hold</Button>
                            </div>
                        </div>
                    </div>

                    {/* applications list */}
                    <div className="overflow-auto max-h-[50vh] border rounded">
                        <table className="w-full table-auto text-sm">
                            <thead className="bg-white sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left"><Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={(v) => (v ? selectAllOnPage() : clearSelection())} /></th>
                                    <th className="px-3 py-2 text-left">Name</th>
                                    <th className="px-3 py-2 text-left">DUPr ID</th>
                                    <th className="px-3 py-2 text-left">Category</th>
                                    <th className="px-3 py-2 text-left">Submitted</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">Comment</th>
                                    <th className="px-3 py-2 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-4 text-sm text-slate-500">No registrations found.</td>
                                    </tr>
                                )}

                                {filtered.map((a) => {
                                    const selected = selectedIds.has(a.id);
                                    const inline = inlineComments[a.id] ?? a.adminComment ?? "";
                                    return (
                                        <tr key={a.id} className="border-t">
                                            <td className="px-3 py-2">
                                                <Checkbox checked={selected} onCheckedChange={() => toggleSelect(a.id)} />
                                            </td>

                                            <td className="px-3 py-2">
                                                <div className="font-medium">{a.participantName}</div>
                                                {a.email && <div className="text-xs text-slate-400">{a.email}</div>}
                                            </td>

                                            <td className="px-3 py-2">{a.duprId ?? "—"}</td>

                                            <td className="px-3 py-2">{a.categoryLabel ?? a.categoryId}</td>

                                            <td className="px-3 py-2 text-xs text-slate-500">{a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "—"}</td>

                                            <td className="px-3 py-2">
                                                <StatusBadge status={a.status ?? "pending"} />
                                            </td>

                                            <td className="px-3 py-2 w-80">
                                                <Textarea
                                                    value={inline}
                                                    onChange={(e) => setInlineCommentFor(a.id, e.target.value)}
                                                    placeholder="Optional comment to participant (visible to them)"
                                                    className="h-16"
                                                />
                                            </td>

                                            <td className="px-3 py-2">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleStatusChange(a.id, "approved")}>
                                                            <IconCheck className="inline w-4 h-4 mr-1" />
                                                        </Button>
                                                        <Button size="sm" variant="secondary" onClick={() => handleStatusChange(a.id, "rejected")}>
                                                            <IconX className="inline w-4 h-4 mr-1" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(a.id, "on_hold")}>
                                                            <Pause className="inline w-4 h-4 mr-1" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-xs text-slate-400">Current: <strong className="capitalize">{a.status ?? "pending"}</strong></div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="destructive" onClick={() => onOpenChange?.(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}