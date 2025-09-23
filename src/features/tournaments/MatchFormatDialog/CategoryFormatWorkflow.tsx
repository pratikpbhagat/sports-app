"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import type { Category, MatchFormat } from "../types";
import CategoryEditor from "./CategoryEditor";
import CategorySidebar from "./CategorySidebar";

type Props = {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    categories: Category[];
    initial?: MatchFormat[];
    onSave: (selections: MatchFormat[]) => void;
    onCancel?: () => void;
};

export default function CategoryFormatWorkflow({
    open,
    onOpenChange,
    categories,
    initial = [],
    onSave,
    onCancel,
}: Props) {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);

    const initialMap = useMemo(() => {
        const m = new Map<string, MatchFormat>();
        for (const sel of initial) m.set(sel.categoryId, sel);
        return m;
    }, [initial]);

    const [selectionsMap, setSelectionsMap] = useState<Map<string, MatchFormat>>(() => {
        const m = new Map(initialMap);
        for (const c of categories) {
            if (!m.has(c.id)) {
                m.set(c.id, {
                    categoryId: c.id,
                    type: "rr+ko",
                    pointsPerGame: 11,
                    gamesPerMatch: 3,
                    tieBreakTo: null,
                    description: null,
                    rrPools: undefined,
                    rrQualPerPool: undefined,
                } as MatchFormat);
            }
        }
        return m;
    });

    useEffect(() => {
        // ensure selectionsMap has same keys as categories
        setSelectionsMap((prev) => {
            const next = new Map(prev);
            for (const c of categories) {
                if (!next.has(c.id)) {
                    next.set(c.id, {
                        categoryId: c.id,
                        type: "rr+ko",
                        pointsPerGame: 11,
                        gamesPerMatch: 3,
                        tieBreakTo: null,
                        description: null,
                        rrPools: undefined,
                        rrQualPerPool: undefined,
                    } as MatchFormat);
                }
            }
            for (const key of Array.from(next.keys())) {
                if (!categories.find((c) => c.id === key)) next.delete(key);
            }
            return next;
        });

        if (!categories.find((c) => c.id === activeCategoryId)) {
            setActiveCategoryId(categories[0]?.id ?? null);
        }
    }, [categories, activeCategoryId]);

    function updateFormatMeta(categoryId: string, patch: Partial<MatchFormat>) {
        setSelectionsMap((prev) => {
            const next = new Map(prev);
            const existing = next.get(categoryId) ?? ({ categoryId, type: "rr+ko" } as MatchFormat);
            next.set(categoryId, { ...existing, ...patch });
            return next;
        });
    }

    function setFormatForCategory(categoryId: string, type: MatchFormat["type"]) {
        updateFormatMeta(categoryId, { type });
    }

    function handleSaveAll(close: boolean) {
        const selections = Array.from(selectionsMap.values());
        onSave(selections);
        if (close) onOpenChange?.(false);
    }

    function handleClose() {
        onOpenChange?.(false);
        onCancel?.();
    }

    const activeSelection = activeCategoryId ? selectionsMap.get(activeCategoryId) ?? null : null;
    const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl bg-white text-[#0f172a] rounded-lg shadow-lg p-4">
                <DialogHeader className="px-4">
                    <DialogTitle>Match formats — categories</DialogTitle>
                    <div className="text-xs text-slate-500 mt-1">
                        Select a category on the left, then choose / refine the match format on the right.
                    </div>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-4 gap-4">
                    <CategorySidebar
                        categories={categories}
                        selectionsMap={selectionsMap}
                        activeCategoryId={activeCategoryId}
                        setActiveCategoryId={setActiveCategoryId}
                    />

                    <div className="col-span-3 border rounded p-4 max-h-[60vh] overflow-auto">
                        <CategoryEditor
                            activeCategory={activeCategory}
                            activeSelection={activeSelection}
                            updateFormatMeta={updateFormatMeta}
                            setFormatForCategory={setFormatForCategory}
                        />

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <Button variant="ghost" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="secondary" onClick={() => handleSaveAll(false)}>
                                Save
                            </Button>
                            <Button onClick={() => handleSaveAll(true)}>Save & Close</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
