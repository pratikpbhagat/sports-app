import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    selectedCategoriesArrForRender?: Category[]; // optional helper to render selected ones
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
                <div className="text-xs text-slate-500">Select categories and set registration fee & maximum slots inline.</div>
            </div>

            {teamSelected ? (
                <div className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="text-sm font-medium">Team Event configuration</div>
                            <div className="text-xs text-slate-500">Team event selected — configure sub-categories and team max size</div>
                        </div>
                        <div>
                            <Button variant="outline" size="sm" onClick={toggleTeamEvent} type="button">Disable Team Event</Button>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="text-xs text-slate-500 mb-1">Max participants per team</div>
                        <input
                            type="number"
                            min={1}
                            value={selectedCategories[teamId!]?.maxParticipantsPerTeam ?? ""}
                            onChange={(e) => updateCategoryMeta(teamId!, { maxParticipantsPerTeam: e.target.value ? Number(e.target.value) : undefined })}
                            className="rounded border px-2 py-1"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Sub-categories included in team event</div>
                        <div className="grid gap-2">
                            {candidateTeamSubcategories.map((c) => {
                                const teamMeta = selectedCategories[teamId!];
                                const selectedSubs = new Set(teamMeta?.teamSubcategories ?? []);
                                const checked = selectedSubs.has(c.id);
                                const subMeta = selectedCategories[c.id];

                                return (
                                    <div key={c.id} className="flex items-center justify-between gap-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={checked} onChange={() => toggleTeamSubcategory(teamId!, c.id)} className="w-4 h-4" />
                                            <div className="text-sm">{c.label}</div>
                                        </label>

                                        <div className="flex items-center gap-2">
                                            <input type="number" min={0} placeholder="Fee USD" value={subMeta?.fee ?? ""} onChange={(e) => updateCategoryMeta(c.id, { fee: e.target.value === "" ? null : Number(e.target.value) })} className="text-xs rounded border px-2 py-1 w-28" />
                                            {subMeta?.kind === "custom" && <input type="number" min={1} placeholder="Max slots" value={subMeta?.maxSlotsPerCategory ?? ""} onChange={(e) => updateCategoryMeta(c.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })} className="text-xs rounded border px-2 py-1 w-32" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <Input placeholder="Add custom sub-category (appears as sub-category)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                            <Button variant="outline" onClick={() => { addCustomCategory(customCategoryInput); setCustomCategoryInput(""); }} type="button"><Plus className="w-4 h-4" /> Add</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-2">
                    {presetCategories.filter((c) => c.kind !== "team").map((opt) => {
                        const checked = Boolean(selectedCategories[opt.id]);
                        return (
                            <div key={opt.id} className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={checked} onChange={() => toggleCategory(opt)} className="w-4 h-4" />
                                    <div className="text-sm">{opt.label}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {checked && opt.kind === "split" && <input placeholder="Age split e.g. U18,U35" value={selectedCategories[opt.id]?.ageSplit ?? ""} onChange={(e) => updateCategoryMeta(opt.id, { ageSplit: e.target.value })} className="text-xs rounded border px-2 py-1" />}

                                    <input type="number" min={0} placeholder="Fee USD" value={checked ? (selectedCategories[opt.id]?.fee ?? "") : ""} onChange={(e) => updateCategoryMeta(opt.id, { fee: e.target.value === "" ? null : Number(e.target.value) })} disabled={!checked} className="text-xs rounded border px-2 py-1 w-28" />

                                    <input type="number" min={1} placeholder="Max slots" value={checked ? (selectedCategories[opt.id]?.maxSlotsPerCategory ?? "") : ""} onChange={(e) => updateCategoryMeta(opt.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })} disabled={!checked} className="text-xs rounded border px-2 py-1 w-32" />
                                </div>
                            </div>
                        );
                    })}

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <Input placeholder="Add custom category (e.g. Veterans Singles)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                        <Button variant="outline" onClick={() => { addCustomCategory(customCategoryInput); setCustomCategoryInput(""); }} type="button">Add</Button>
                    </div>

                    <div className="mt-4 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Allow multi-category registration</div>
                                <div className="text-xs text-slate-500">Allow players to register for more than one category.</div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={allowMultiCategoryRegistration} onChange={(e) => setAllowMultiCategoryRegistration(e.target.checked)} className="w-4 h-4" />
                                    <span className="text-xs text-slate-600">Enabled</span>
                                </label>
                            </div>
                        </div>

                        {allowMultiCategoryRegistration && (
                            <div className="mt-3 grid grid-cols-2 gap-2 items-end">
                                <div>
                                    <label className="text-xs text-slate-600">Enable discount for multi-category registration</label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={multiCategoryDiscountEnabled} onChange={(e) => setMultiCategoryDiscountEnabled(e.target.checked)} className="w-4 h-4" />
                                            <span className="text-xs text-slate-600">Apply discount</span>
                                        </label>
                                    </div>
                                </div>

                                {multiCategoryDiscountEnabled && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs text-slate-600">Discount type</label>
                                            <select value={multiCategoryDiscountType} onChange={(e) => setMultiCategoryDiscountType(e.target.value as any)} className="w-full rounded border px-2 py-1 text-sm">
                                                <option value="percent">Percent (%)</option>
                                                <option value="fixed">Fixed (USD)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs text-slate-600">Value</label>
                                            <Input type="number" min={0} value={multiCategoryDiscountValue} onChange={(e) => setMultiCategoryDiscountValue(e.target.value === "" ? "" : Number(e.target.value))} placeholder={multiCategoryDiscountType === "percent" ? "e.g. 10" : "e.g. 5"} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={!!selectedCategories["team-event"]} onChange={toggleTeamEvent} className="w-4 h-4" />
                            <span className="text-sm">Enable Team Event (when enabled, categories become team sub-categories)</span>
                        </label>
                        <div className="text-xs text-slate-400 mt-1">Note: When Team Event is active, multi-category registration is disabled.</div>
                    </div>
                </div>
            )}
        </section>
    );
}
