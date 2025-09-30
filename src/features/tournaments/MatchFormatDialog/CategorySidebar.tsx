"use client";

import type { Category, MatchFormat } from "../types";

type Props = {
    categories: Category[];
    selectionsMap: Map<string, MatchFormat>;
    activeCategoryId: string | null;
    setActiveCategoryId: (id: string) => void;
};

export default function CategorySidebar({ categories, selectionsMap, activeCategoryId, setActiveCategoryId }: Props) {
    return (
        <aside className="col-span-1 border rounded p-2 max-h-[60vh] overflow-auto bg-white">
            <div className="text-xs text-slate-500 mb-2">Categories</div>
            <ul className="space-y-2">
                {categories.map((c) => {
                    const isActive = c.id === activeCategoryId;
                    const sel = selectionsMap.get(c.id);
                    return (
                        <li key={c.id}>
                            <button
                                type="button"
                                onClick={() => setActiveCategoryId(c.id)}
                                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between ${isActive ? "bg-[#7c3aed]/10 text-[#7c3aed]" : "hover:bg-slate-50"}`}
                            >
                                <div>
                                    <div className="text-sm font-medium">{c.label}</div>
                                    <div className="text-xs text-slate-400">
                                        {c.registered ?? 0}
                                        {c.capacity ? ` / ${c.capacity}` : ""}
                                    </div>
                                </div>

                                <div className="text-xs text-slate-400">{sel ? sel.type : "—"}</div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
