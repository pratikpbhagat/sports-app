"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Category } from "../../types";

type Props = {
    presetCategories: Category[];
    selectedCategories: Record<string, Category>;
    toggleCategory: (opt: Category) => void;
    addCustomCategory: (label: string) => void;
    customCategoryInput: string;
    setCustomCategoryInput: (s: string) => void;
    updateCategoryMeta: (id: string, patch: Partial<Category>) => void;
    isTeamSelected: () => boolean;
    candidateTeamSubcategories: { id: string; label: string }[];
    getTeamId: () => string | undefined;
    toggleTeamSubcategory: (teamId: string, subcatId: string) => void;
    selectedCategoriesArrForRender?: Category[];
    allowMultiCategoryRegistration: boolean;
    setAllowMultiCategoryRegistration: (v: boolean) => void;
    multiCategoryDiscountEnabled: boolean;
    setMultiCategoryDiscountEnabled: (v: boolean) => void;
    multiCategoryDiscountType: "percent" | "fixed";
    setMultiCategoryDiscountType: (t: "percent" | "fixed") => void;
    multiCategoryDiscountValue: number | "";
    setMultiCategoryDiscountValue: (v: number | "") => void;
    toggleTeamEvent: () => void;
};

export default function CategoriesStep(props: Props) {
    const {
        presetCategories,
        selectedCategories,
        toggleCategory,
        addCustomCategory,
        customCategoryInput,
        setCustomCategoryInput,
        updateCategoryMeta,
        isTeamSelected,
        candidateTeamSubcategories,
        getTeamId,
        toggleTeamSubcategory,
        allowMultiCategoryRegistration,
        setAllowMultiCategoryRegistration,
        multiCategoryDiscountEnabled,
        setMultiCategoryDiscountEnabled,
        multiCategoryDiscountType,
        setMultiCategoryDiscountType,
        multiCategoryDiscountValue,
        setMultiCategoryDiscountValue,
        toggleTeamEvent,
    } = props;

    const teamSelected = isTeamSelected();
    const teamId = getTeamId();

    return (
        <section className="space-y-3">
            <div>
                <div className="text-sm font-medium text-slate-700">Categories</div>
                <div className="text-xs text-slate-500">Select categories and set registration fee &amp; maximum slots inline.</div>
            </div>

            {teamSelected ? (
                <div className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="text-sm font-medium">Team Event configuration</div>
                            <div className="text-xs text-slate-500">Team event selected — configure sub-categories and team max size</div>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={toggleTeamEvent} type="button">
                                Disable Team Event
                            </Button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <Label className="text-xs">Max participants per team</Label>
                        <Input
                            type="number"
                            min={1}
                            value={selectedCategories[teamId!]?.maxParticipantsPerTeam ?? ""}
                            onChange={(e) =>
                                updateCategoryMeta(teamId!, {
                                    maxParticipantsPerTeam: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-2">Sub-categories included in team event</div>

                        <div className="grid gap-2">
                            {candidateTeamSubcategories.map((c) => {
                                const teamMeta = selectedCategories[teamId!];
                                const selectedSubs = new Set(teamMeta?.teamSubcategories ?? []);
                                const checked = selectedSubs.has(c.id);
                                const subMeta = selectedCategories[c.id];

                                return (
                                    <div key={c.id} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={checked} onCheckedChange={() => toggleTeamSubcategory(teamId!, c.id)} />
                                            <div className="text-sm">{c.label}</div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Fee USD"
                                                value={subMeta?.fee ?? ""}
                                                onChange={(e) => updateCategoryMeta(c.id, { fee: e.target.value === "" ? null : Number(e.target.value) })}
                                                className="w-28"
                                            />
                                            {subMeta?.kind === "custom" && (
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    placeholder="Max slots"
                                                    value={subMeta?.maxSlotsPerCategory ?? ""}
                                                    onChange={(e) =>
                                                        updateCategoryMeta(c.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })
                                                    }
                                                    className="w-32"
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Input placeholder="Add custom sub-category (appears as sub-category)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!customCategoryInput.trim()) return;
                                    addCustomCategory(customCategoryInput.trim());
                                    setCustomCategoryInput("");
                                }}
                                type="button"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-2">
                    {presetCategories.filter((c) => c.kind !== "team").map((opt) => {
                        const checked = Boolean(selectedCategories[opt.id]);
                        const sel = selectedCategories[opt.id];

                        return (
                            <div key={opt.id} className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={checked} onCheckedChange={() => toggleCategory(opt)} />
                                    <div className="text-sm">{opt.label}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {checked && opt.kind === "split" && (
                                        <Input
                                            placeholder="Age split e.g. U18,U35"
                                            value={sel?.ageSplit ?? ""}
                                            onChange={(e) => updateCategoryMeta(opt.id, { ageSplit: e.target.value })}
                                            className="text-xs"
                                        />
                                    )}

                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Fee USD"
                                        value={checked ? (sel?.fee ?? "") : ""}
                                        onChange={(e) => updateCategoryMeta(opt.id, { fee: e.target.value === "" ? null : Number(e.target.value) })}
                                        disabled={!checked}
                                        className="w-28"
                                    />

                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="Max slots"
                                        value={checked ? (sel?.maxSlotsPerCategory ?? "") : ""}
                                        onChange={(e) => updateCategoryMeta(opt.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })}
                                        disabled={!checked}
                                        className="w-32"
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <Input placeholder="Add custom category (e.g. Veterans Singles)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!customCategoryInput.trim()) return;
                                addCustomCategory(customCategoryInput.trim());
                                setCustomCategoryInput("");
                            }}
                            type="button"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>

                    <div className="mt-4 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Allow multi-category registration</div>
                                <div className="text-xs text-slate-500">Allow players to register for more than one category.</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={allowMultiCategoryRegistration} onCheckedChange={(v) => setAllowMultiCategoryRegistration(Boolean(v))} />
                                    <div className="text-xs text-slate-600">Enabled</div>
                                </div>
                            </div>
                        </div>

                        {allowMultiCategoryRegistration && (
                            <div className="mt-3 grid grid-cols-2 gap-2 items-end">
                                <div>
                                    <div className="text-xs text-slate-600">Enable discount for multi-category registration</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Checkbox checked={multiCategoryDiscountEnabled} onCheckedChange={(v) => setMultiCategoryDiscountEnabled(Boolean(v))} />
                                        <div className="text-xs text-slate-600">Apply discount</div>
                                    </div>
                                </div>

                                {multiCategoryDiscountEnabled && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs">Discount type</Label>
                                            <Select value={multiCategoryDiscountType} onValueChange={(v) => setMultiCategoryDiscountType(v as "percent" | "fixed")}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percent">Percent (%)</SelectItem>
                                                    <SelectItem value="fixed">Fixed (USD)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Value</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={multiCategoryDiscountValue}
                                                onChange={(e) => setMultiCategoryDiscountValue(e.target.value === "" ? "" : Number(e.target.value))}
                                                placeholder={multiCategoryDiscountType === "percent" ? "e.g. 10" : "e.g. 5"}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center gap-2">
                            <Checkbox checked={!!selectedCategories["team-event"]} onCheckedChange={toggleTeamEvent} />
                            <div className="text-sm">Enable Team Event (when enabled, categories become team sub-categories)</div>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Note: When Team Event is active, multi-category registration is disabled.</div>
                    </div>
                </div>
            )}
        </section>
    );
}
