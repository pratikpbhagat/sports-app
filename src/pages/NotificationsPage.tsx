"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trash2, CheckCircle, Mail, Bell } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import type { ReactNode } from "react";

type NotificationType = "info" | "success" | "warning" | "message";

type NotificationItem = {
    id: string;
    title: string;
    body?: string;
    date: string; // ISO
    read?: boolean;
    type?: NotificationType;
    actorName?: string;
    actorAvatar?: string;
};

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "n1",
        title: "Registration confirmed — City Open",
        body: "You're registered for City Open on Oct 5 — good luck!",
        date: "2025-09-18T10:15:00Z",
        read: false,
        type: "success",
        actorName: "Spring Paddle Club",
    },
    {
        id: "n2",
        title: "Autumn Classic — Matches started",
        body: "The Autumn Classic matches are underway at North Arena. Follow the live bracket.",
        date: "2025-09-20T08:00:00Z",
        read: false,
        type: "info",
        actorName: "North Racquet Association",
    },
    {
        id: "n3",
        title: "Training Feedback from Coach Alex",
        body: "Great improvement on serve accuracy — keep practicing the footwork drills.",
        date: "2025-09-16T14:30:00Z",
        read: true,
        type: "message",
        actorName: "Alex R.",
    },
    {
        id: "n4",
        title: "Your tournament was completed — City Open",
        body: "Thanks for organizing — view final stats and attendance report.",
        date: "2025-09-07T12:00:00Z",
        read: true,
        type: "info",
        actorName: "System",
    },
];

function TypeIcon({ type }: { type?: NotificationType }): ReactNode {
    switch (type) {
        case "success":
            return <CheckCircle className="w-5 h-5 text-[#22c55e]" />;
        case "warning":
            return <Bell className="w-5 h-5 text-yellow-500" />;
        case "message":
            return <Mail className="w-5 h-5 text-[#7c3aed]" />;
        default:
            return <Bell className="w-5 h-5 text-slate-400" />;
    }
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [visibleCount, setVisibleCount] = useState(6);

    const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

    const filtered = useMemo(() => {
        const list = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
        // sort newest first
        return list.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }, [notifications, filter]);

    function markAsRead(id: string, read = true) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)));
    }

    function markAllAsRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    function deleteNotification(id: string) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }

    function loadMore() {
        setVisibleCount((c) => c + 6);
    }

    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Notifications</h1>
                    <p className="text-sm text-slate-500">All notifications related to your account, tournaments and trainings.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-full bg-white/5 p-1">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${filter === "all" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${filter === "unread" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
                        >
                            Unread {unreadCount > 0 && <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-[#22c55e] text-white">{unreadCount}</span>}
                        </button>
                    </div>

                    <Button variant="ghost" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        Mark all read
                    </Button>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: list */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4 flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Recent notifications</CardTitle>
                            <div className="text-sm text-slate-500">{filtered.length} items</div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="divide-y">
                                {filtered.length === 0 && (
                                    <div className="p-6 text-center text-slate-500">No notifications</div>
                                )}

                                {filtered.slice(0, visibleCount).map((n) => (
                                    <div key={n.id} className={`flex items-start gap-4 p-4 ${n.read ? "" : "bg-white/5"}`}>
                                        <div className="shrink-0">
                                            <Avatar className="h-10 w-10">
                                                {n.actorAvatar ? (
                                                    <AvatarImage src={n.actorAvatar} />
                                                ) : (
                                                    <AvatarFallback className="bg-[#7c3aed] text-white">
                                                        {n.actorName ? n.actorName.split(" ").map((s) => s[0]).slice(0, 2).join("") : "NT"}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-semibold text-[#0f172a]">{n.title}</div>
                                                        <span className="text-xs text-slate-500">{formatDate(n.date)}</span>
                                                    </div>
                                                    {n.body && <div className="text-sm text-slate-600 mt-1 line-clamp-3">{n.body}</div>}
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${n.type === "success" ? "bg-[#22c55e]/10 text-[#22c55e]" : n.type === "message" ? "bg-[#7c3aed]/10 text-[#7c3aed]" : "bg-slate-100 text-slate-700"}`}>
                                                            {TypeIcon({ type: n.type })}&nbsp;
                                                            <span className="ml-1">{n.type ?? "info"}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" variant={n.read ? "ghost" : "default"} onClick={() => markAsRead(n.id, !n.read)}>
                                                            {n.read ? "Mark unread" : "Mark read"}
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => deleteNotification(n.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filtered.length > visibleCount && (
                                    <div className="p-4 text-center">
                                        <Button variant="outline" onClick={loadMore}>Load more</Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: quick actions / filters / summary */}
                <aside className="space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Overview</CardTitle>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xs text-slate-500">Unread</div>
                                <div className="text-lg font-bold text-[#0f172a]">{unreadCount}</div>
                            </div>

                            <Separator className="my-2" />

                            <div className="space-y-2">
                                <Button variant="ghost" onClick={() => setFilter("all")} className="w-full justify-start">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        <span>Show all</span>
                                    </div>
                                </Button>

                                <Button variant="ghost" onClick={() => setFilter("unread")} className="w-full justify-start">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Show unread</span>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Tips</CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 text-sm text-slate-600">
                            <p>Notifications are ephemeral here (client-side demo). Wire this page to your backend notifications API to persist, filter server-side, and mark read/unread across devices.</p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}
