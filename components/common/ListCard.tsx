import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ListCardProps<T> = {
    title: string;
    items: T[];
    renderItem?: (item: T) => React.ReactNode; // render each item
    viewAllHref?: string;
    emptyMessage?: string;
    // gradient colors (hex), used to paint the header background with a subtle tint
    accentFrom?: string; // e.g. "#7c3aed"
    accentTo?: string; // e.g. "#22c55e"
    maxContentHeight?: string; // e.g. "60vh"
    className?: string;
};

export default function ListCard<T>({
    title,
    items,
    renderItem,
    viewAllHref,
    emptyMessage = "No items to show.",
    accentFrom = "#7c3aed",
    accentTo = "#22c55e",
    maxContentHeight = "60vh",
    className = "",
}: ListCardProps<T>) {
    const headerStyle = {
        background: `linear-gradient(90deg, ${accentFrom}20, ${accentTo}20)`,
    };

    const defaultRenderItem = (item: any) => {
        // naive fallback — expects title/name + meta fields
        const label = item.title ?? item.name ?? "Item";
        const meta = [item.date, item.location, item.coach].filter(Boolean).join(" • ");
        const rightBadge = item.slots
            ? <span className="inline-block text-xs px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">{item.slots} slots</span>
            : item.status
                ? <span className="inline-block text-xs px-2 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e]">{item.status}</span>
                : null;

        return (
            <article className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 transition">
                <div>
                    <h3 className="text-sm font-semibold text-[#0f172a]">{label}</h3>
                    {meta && <p className="text-xs text-slate-500">{meta}</p>}
                </div>
                <div className="text-right">{rightBadge}</div>
            </article>
        );
    };

    return (
        <Card className={`flex-1 overflow-hidden bg-white border-0 shadow-lg ${className}`}>
            <CardHeader style={headerStyle} className="px-6 py-4 flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#0f172a]">{title}</CardTitle>

                {viewAllHref ? (
                    <a href={viewAllHref} className="text-sm font-medium text-[#7c3aed] hover:underline">
                        View all
                    </a>
                ) : null}
            </CardHeader>

            <CardContent className="p-4 space-y-3" style={{ maxHeight: maxContentHeight, overflow: "auto" }}>
                {items.length > 0 ? (
                    items.map((it, idx) => (
                        <React.Fragment key={(it as any).id ?? (it as any).title ?? idx}>
                            {renderItem ? renderItem(it) : defaultRenderItem(it as any)}
                        </React.Fragment>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    );
}
