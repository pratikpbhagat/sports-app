// features/tournaments/CategoryFormatWorkflow.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import type { Category, MatchFormat } from "../types";
import CategoryEditor from "./CategoryEditor";
import CategorySidebar from "./CategorySidebar";
import MatchFormatPreview from "./MatchFormatPreview";

type Props = {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    categories: Category[];
    initial?: MatchFormat[];
    onSave: (selections: MatchFormat[]) => void;
    onCancel?: () => void;
};

/**
 * CategoryFormatWorkflow
 *
 * Top-level dialog that shows a left-hand category sidebar and a right-hand
 * editor for selecting/refining match formats per category.
 *
 * Wires together:
 * - CategorySidebar (left)
 * - CategoryEditor (right)
 * - MatchFormatPreview (preview popup)
 */
export default function CategoryFormatWorkflow({
    open,
    onOpenChange,
    categories,
    initial = [],
    onSave,
    onCancel,
}: Props) {
    // active category id selected in the sidebar
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);

    // preview dialog state
    const [previewOpen, setPreviewOpen] = useState(false);

    // build initial map from `initial` prop (if caller provided saved formats)
    const initialMap = useMemo(() => {
        const m = new Map<string, MatchFormat>();
        for (const sel of initial) m.set(sel.categoryId, sel);
        return m;
    }, [initial]);

    // selections map state (categoryId -> MatchFormat)
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

    // Keep selectionsMap in sync when categories change
    useEffect(() => {
        setSelectionsMap((prev) => {
            const next = new Map(prev);

            // add missing categories with defaults
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

            // remove stale keys that no longer match categories
            for (const key of Array.from(next.keys())) {
                if (!categories.find((cat) => cat.id === key)) next.delete(key);
            }

            return next;
        });

        // ensure activeCategoryId remains valid if categories changed
        if (!categories.find((c) => c.id === activeCategoryId)) {
            setActiveCategoryId(categories[0]?.id ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    // --- internal updater renamed to avoid collisions ---
    function updateFormatForCategory(categoryId: string, patch: Partial<MatchFormat>) {
        setSelectionsMap((prev) => {
            const next = new Map(prev);
            const existing = next.get(categoryId) ?? ({ categoryId, type: "rr+ko" } as MatchFormat);
            next.set(categoryId, { ...existing, ...patch });
            return next;
        });
    }

    // helper to update currently active category (what CategoryEditor expects)
    function updateActiveCategoryFormat(patch: Partial<MatchFormat>) {
        if (!activeCategoryId) return;
        updateFormatForCategory(activeCategoryId, patch);
    }

    function setFormatForCategory(categoryId: string, type: MatchFormat["type"]) {
        updateFormatForCategory(categoryId, { type });
    }

    // Save handlers
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
        <>
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
                                // pass the single-arg updater CategoryEditor expects
                                updateFormatMeta={(patch) => updateActiveCategoryFormat(patch)}
                                setFormatForCategory={(categoryId, type) => setFormatForCategory(categoryId, type)}
                            />

                            <div className="mt-6 flex items-center justify-end gap-2">
                                <Button variant="ghost" onClick={handleClose}>
                                    Cancel
                                </Button>

                                {/* Preview button (opens preview dialog for active category/format) */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Only open preview when we have an active category & selection
                                        if (activeCategory && activeSelection) setPreviewOpen(true);
                                    }}
                                    disabled={!activeCategory || !activeSelection}
                                >
                                    Preview
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

            {/* Preview dialog (separate so it overlays the main dialog) */}
            {activeCategory && activeSelection && (
                <MatchFormatPreview open={previewOpen} onOpenChange={(v) => setPreviewOpen(v)} category={activeCategory} format={activeSelection} />
            )}
        </>
    );
}
