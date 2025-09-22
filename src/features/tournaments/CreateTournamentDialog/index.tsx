"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { Tournament } from "@/types/tournament";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate?: (payload: Tournament) => void;
    onUpdate?: (payload: Tournament) => void;
    initialData?: Tournament | null;
};

type CategoryOption = {
    id: string;
    label: string;
    kind: "singles" | "doubles" | "mixed" | "split" | "open" | "team" | "custom";
    ageSplit?: string | null;
    maxParticipantsPerTeam?: number | null;
    fee?: number | null;
    maxSlotsPerCategory?: number | null;
    teamSubcategories?: string[];
};

type Contact = { id: string; name: string; phone: string };
type SessionRow = { id: string; date: string; time: string };

const PRESET_CATEGORIES_BASE: CategoryOption[] = [
    { id: "team-event", label: "Team Event (select sub-categories)", kind: "team" },
    { id: "singles-men", label: "Singles — Men", kind: "singles" },
    { id: "singles-women", label: "Singles — Women", kind: "singles" },
    { id: "doubles-men", label: "Doubles — Men", kind: "doubles" },
    { id: "doubles-women", label: "Doubles — Women", kind: "doubles" },
    { id: "mixed-doubles", label: "Mixed Doubles", kind: "mixed" },
    { id: "split-age", label: "Split category (Age split)", kind: "split" },
    { id: "open-doubles", label: "Open Doubles", kind: "open" },
];

function uid(prefix = "") {
    return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * CreateTournamentDialog supports:
 *  - create (onCreate)
 *  - edit (onUpdate + initialData)
 *
 * It pre-fills state when initialData is provided.
 */
export default function CreateTournamentDialog({ open, setOpen, onCreate, onUpdate, initialData = null }: Props) {
    const [step, setStep] = useState<number>(0);

    // Basic
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    // Cover image upload
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // Contacts (max 5)
    const [contacts, setContacts] = useState<Contact[]>([{ id: uid("c_"), name: "", phone: "" }]);

    // Dates/sessions
    const [useMultipleDates, setUseMultipleDates] = useState(false);
    const [dateTimes, setDateTimes] = useState<SessionRow[]>([{ id: uid("dt_"), date: "", time: "" }]);

    // Registration window
    const [registrationStart, setRegistrationStart] = useState("");
    const [registrationEnd, setRegistrationEnd] = useState("");

    // Auto-approve & DUPr ID requirement
    const [autoApproveRegistrations, setAutoApproveRegistrations] = useState(true);
    const [requireDuprId, setRequireDuprId] = useState(false);

    // Categories map (id -> CategoryOption)
    const [selectedCategories, setSelectedCategories] = useState<Record<string, CategoryOption>>({});
    const [customCategoryInput, setCustomCategoryInput] = useState("");

    // Multi-category registration + discount
    const [allowMultiCategoryRegistration, setAllowMultiCategoryRegistration] = useState(false);
    const [multiCategoryDiscountEnabled, setMultiCategoryDiscountEnabled] = useState(false);
    const [multiCategoryDiscountType, setMultiCategoryDiscountType] = useState<"percent" | "fixed">("percent");
    const [multiCategoryDiscountValue, setMultiCategoryDiscountValue] = useState<number | "">("");

    // UI
    const [errors, setErrors] = useState<string | null>(null);

    const PRESET_CATEGORIES = PRESET_CATEGORIES_BASE;

    // Populate form when `initialData` changes (edit mode)
    useEffect(() => {
        if (!initialData) return;

        // Basic
        setTitle(initialData.title ?? "");
        setLocation(initialData.location ?? "");
        setCoverPreview((initialData as any).cover ?? null);

        // contacts
        const incomingContacts = (initialData as any).contacts ?? [];
        setContacts(
            incomingContacts.length > 0
                ? incomingContacts.map((c: any) => ({ id: uid("c_"), name: c.name ?? "", phone: c.phone ?? "" }))
                : [{ id: uid("c_"), name: "", phone: "" }]
        );

        // sessions
        if ((initialData as any).sessions && Array.isArray((initialData as any).sessions) && (initialData as any).sessions.length) {
            const s = (initialData as any).sessions.map((ss: any) => ({
                id: uid("dt_"),
                date: ss.date ?? ss.iso?.slice?.(0, 10) ?? "",
                time: ss.time ?? ss.iso?.slice?.(11, 16) ?? "",
            }));
            setDateTimes(s);
            setUseMultipleDates(s.length > 1);
        } else if (initialData.startDate) {
            const [d, t] = (initialData.startDate as string).split("T");
            setDateTimes([{ id: uid("dt_"), date: d ?? "", time: t?.slice(0, 5) ?? "" }]);
            setUseMultipleDates(false);
        }

        setRegistrationStart((initialData as any).registrationStart ?? "");
        setRegistrationEnd((initialData as any).registrationEnd ?? "");
        setAutoApproveRegistrations((initialData as any).autoApproveRegistrations ?? true);
        setRequireDuprId((initialData as any).requireDuprId ?? false);

        // categories
        const catsArr = (initialData as any).categories ?? [];
        const catMap: Record<string, CategoryOption> = {};
        for (const c of catsArr) {
            catMap[c.id] = {
                id: c.id,
                label: c.label,
                kind: c.kind,
                ageSplit: c.ageSplit ?? null,
                fee: c.fee ?? null,
                maxSlotsPerCategory: c.maxSlotsPerCategory ?? null,
                maxParticipantsPerTeam: c.maxParticipantsPerTeam ?? null,
                teamSubcategories: c.teamSubcategories ?? [],
            };
        }
        setSelectedCategories(catMap);

        // multi-category
        if ((initialData as any).allowMultiCategoryRegistration) {
            setAllowMultiCategoryRegistration(true);
            const disc = (initialData as any).multiCategoryDiscount;
            if (disc) {
                setMultiCategoryDiscountEnabled(true);
                setMultiCategoryDiscountType(disc.type === "fixed" ? "fixed" : "percent");
                setMultiCategoryDiscountValue(disc.value ?? "");
            }
        } else {
            setAllowMultiCategoryRegistration(false);
            setMultiCategoryDiscountEnabled(false);
            setMultiCategoryDiscountValue("");
        }

        setErrors(null);
        setStep(0);
    }, [initialData]);

    const resetAll = () => {
        setStep(0);
        setTitle("");
        setLocation("");
        setCoverFile(null);
        setCoverPreview(null);
        setContacts([{ id: uid("c_"), name: "", phone: "" }]);
        setUseMultipleDates(false);
        setDateTimes([{ id: uid("dt_"), date: "", time: "" }]);
        setRegistrationStart("");
        setRegistrationEnd("");
        setAutoApproveRegistrations(true);
        setRequireDuprId(false);
        setSelectedCategories({});
        setCustomCategoryInput("");
        setAllowMultiCategoryRegistration(false);
        setMultiCategoryDiscountEnabled(false);
        setMultiCategoryDiscountType("percent");
        setMultiCategoryDiscountValue("");
        setErrors(null);
    };

    const close = () => {
        resetAll();
        setOpen(false);
    };

    // cover handlers
    function handleCoverFileChange(file?: File | null) {
        console.log("handleCoverFileChange", coverFile);
        if (!file) {
            setCoverFile(null);
            setCoverPreview(null);
            return;
        }
        setCoverFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCoverPreview(typeof ev.target?.result === "string" ? ev.target?.result : null);
        };
        reader.readAsDataURL(file);
    }

    // date/time helpers
    function addDateTimeRow() {
        setDateTimes((prev) => [...prev, { id: uid("dt_"), date: "", time: "" }]);
    }

    function removeDateTimeRow(id: string) {
        setDateTimes((prev) => prev.filter((d) => d.id !== id));
    }

    function updateDateTime(id: string, patch: Partial<{ date: string; time: string }>) {
        setDateTimes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    }

    // contacts
    function addContact() {
        setContacts((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, { id: uid("c_"), name: "", phone: "" }];
        });
    }

    function removeContact(id: string) {
        setContacts((prev) => (prev.length === 1 ? prev : prev.filter((c) => c.id !== id)));
    }

    function updateContact(id: string, patch: Partial<{ name: string; phone: string }>) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    }

    // categories helpers with team-first logic
    function isTeamSelected(): boolean {
        return Object.values(selectedCategories).some((c) => c.kind === "team");
    }

    function getTeamId(): string | undefined {
        const t = Object.values(selectedCategories).find((c) => c.kind === "team");
        return t?.id;
    }

    function toggleCategory(opt: CategoryOption) {
        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const teamSelected = Object.values(copy).some((c) => c.kind === "team");
            if (teamSelected && opt.kind !== "team") {
                // disallow toggling other categories when team selected
                return prev;
            }

            if (copy[opt.id]) {
                delete copy[opt.id];
            } else {
                copy[opt.id] = {
                    ...opt,
                    fee: null,
                    ageSplit: opt.kind === "split" ? "" : opt.ageSplit ?? null,
                    maxSlotsPerCategory: null,
                };
            }
            return copy;
        });
    }

    function toggleTeamEvent() {
        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const teamOpt = PRESET_CATEGORIES.find((c) => c.kind === "team")!;
            const teamId = teamOpt.id;
            if (copy[teamId]) {
                // turning team off -> remove team and keep other categories removed (organizer can re-add)
                delete copy[teamId];
                return copy;
            }

            // turning team on -> create team meta that includes nothing selected initially
            copy[teamId] = {
                id: teamId,
                label: teamOpt.label,
                kind: "team",
                fee: null,
                teamSubcategories: [],
                maxParticipantsPerTeam: null,
            };

            // remove all other selections
            for (const k of Object.keys(copy)) {
                if (k !== teamId) delete copy[k];
            }

            // disable multi-category registration when team is selected
            setAllowMultiCategoryRegistration(false);
            setMultiCategoryDiscountEnabled(false);
            return copy;
        });
    }

    function addCustomCategory() {
        const label = customCategoryInput.trim();
        if (!label) return;
        const id = uid("custom_");

        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const cat: CategoryOption = { id, label, kind: "custom", fee: null, maxSlotsPerCategory: null };
            copy[id] = cat;
            setCustomCategoryInput("");
            return copy;
        });
    }

    function updateCategoryMeta(id: string, patch: Partial<CategoryOption>) {
        setSelectedCategories((prev) => {
            if (!prev[id]) {
                // create entry if it doesn't exist yet
                const preset = PRESET_CATEGORIES.find((p) => p.id === id);
                if (!preset) return prev;
                return { ...prev, [id]: { ...preset, fee: null, maxSlotsPerCategory: null, ...patch } };
            }
            return { ...prev, [id]: { ...prev[id], ...patch } };
        });
    }

    function toggleTeamSubcategory(teamId: string, subcatId: string) {
        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const team = copy[teamId];
            if (!team) return prev;

            const subs = new Set(team.teamSubcategories ?? []);
            if (subs.has(subcatId)) subs.delete(subcatId);
            else subs.add(subcatId);
            team.teamSubcategories = Array.from(subs);
            copy[teamId] = team;

            // Ensure the subcategory exists in the map with editable fields so fee/slots persist.
            if (!copy[subcatId]) {
                const preset = PRESET_CATEGORIES.find((p) => p.id === subcatId);
                if (preset) copy[subcatId] = { ...preset, fee: null, maxSlotsPerCategory: null };
                else copy[subcatId] = { id: subcatId, label: subcatId, kind: "custom", fee: null, maxSlotsPerCategory: null };
            }

            return copy;
        });
    }

    // validation per step
    function validateStep(currentStep: number): string | null {
        if (currentStep === 0) {
            if (!title.trim()) return "Tournament name is required.";
            if (!location.trim()) return "Location is required.";
        }

        if (currentStep === 1) {
            const invalid = dateTimes.some((d) => !d.date || !d.time);
            if (invalid) return "Please provide date and time for each session.";
        }

        if (currentStep === 2) {
            if (!registrationStart || !registrationEnd) return "Please provide registration start and end dates.";
            if (new Date(registrationEnd) < new Date(registrationStart)) return "Registration end must be after start.";
        }

        if (currentStep === 3) {
            if (Object.keys(selectedCategories).length === 0) return "Please select at least one category (or Team Event).";

            const teamSelected = isTeamSelected();

            if (!teamSelected) {
                for (const c of Object.values(selectedCategories)) {
                    if (c.kind === "team") continue;
                    if (c.fee === null || c.fee === undefined || Number.isNaN(c.fee)) {
                        return `Please provide a registration fee for "${c.label}".`;
                    }
                    if (
                        c.maxSlotsPerCategory === null ||
                        c.maxSlotsPerCategory === undefined ||
                        Number.isNaN(c.maxSlotsPerCategory) ||
                        Number(c.maxSlotsPerCategory) <= 0
                    ) {
                        return `Please provide maximum slots for "${c.label}".`;
                    }
                    if (c.kind === "split" && (!c.ageSplit || !c.ageSplit.trim())) {
                        return `Please provide age split details for "${c.label}".`;
                    }
                }

                if (allowMultiCategoryRegistration && multiCategoryDiscountEnabled) {
                    if (multiCategoryDiscountValue === "" || multiCategoryDiscountValue === null) {
                        return "Please provide a discount value for multi-category registrations.";
                    }
                    const val = Number(multiCategoryDiscountValue);
                    if (multiCategoryDiscountType === "percent" && (val <= 0 || val > 100)) {
                        return "Discount percent must be between 1 and 100.";
                    }
                    if (multiCategoryDiscountType === "fixed" && val < 0) {
                        return "Fixed discount must be 0 or greater.";
                    }
                }
            } else {
                const teamId = getTeamId()!;
                const teamMeta = selectedCategories[teamId];
                if (!teamMeta) return "Team event configuration missing.";
                if (!teamMeta.teamSubcategories || teamMeta.teamSubcategories.length === 0) {
                    return "Please select at least one sub-category for the Team Event.";
                }
                if (!teamMeta.maxParticipantsPerTeam || teamMeta.maxParticipantsPerTeam <= 0) {
                    return "Please provide max participants per team for the Team Event.";
                }

                // fees for selected subs
                for (const sid of teamMeta.teamSubcategories) {
                    const sub = selectedCategories[sid];
                    if (!sub) return `Please set a fee for sub-category "${sid}".`;
                    if (sub.fee == null) return `Please set a fee for "${sub.label}".`;
                    if (sub.kind === "split" && (!sub.ageSplit || !sub.ageSplit.trim())) {
                        return `Please provide age split details for "${sub.label}".`;
                    }
                    if (sub.kind === "custom" && (sub.maxSlotsPerCategory == null || sub.maxSlotsPerCategory <= 0)) {
                        return `Please provide max slots for custom sub-category "${sub.label}".`;
                    }
                }
            }
        }

        return null;
    }

    function handleNext() {
        setErrors(null);
        const v = validateStep(step);
        if (v) {
            setErrors(v);
            return;
        }
        setStep((s) => Math.min(4, s + 1));
        setErrors(null);
    }

    function handleBack() {
        setErrors(null);
        setStep((s) => Math.max(0, s - 1));
    }

    // final submit
    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        setErrors(null);

        for (let s = 0; s <= 3; s++) {
            const v = validateStep(s);
            if (v) {
                setErrors(v);
                setStep(s);
                return;
            }
        }

        const categories = Object.values(selectedCategories).map((c) => ({
            id: c.id,
            label: c.label,
            kind: c.kind,
            ageSplit: c.ageSplit ?? null,
            fee: c.fee ?? 0,
            maxSlotsPerCategory: c.maxSlotsPerCategory ?? null,
            maxParticipantsPerTeam: c.maxParticipantsPerTeam ?? null,
            teamSubcategories: c.teamSubcategories ?? [],
        }));

        const payload: any = {
            id: initialData?.id ?? `t_${Date.now()}`,
            title: title.trim(),
            startDate: dateTimes[0] ? `${dateTimes[0].date}T${dateTimes[0].time}` : "",
            endDate:
                dateTimes.length > 1 ? `${dateTimes[dateTimes.length - 1].date}T${dateTimes[dateTimes.length - 1].time}` : undefined,
            sessions: dateTimes.map((d) => ({ date: d.date, time: d.time, iso: `${d.date}T${d.time}` })),
            location,
            registrationStart,
            registrationEnd,
            capacity: initialData?.capacity ?? undefined,
            registered: initialData?.registered ?? 0,
            status: "upcoming",
            organizer: initialData?.organizer ?? "You (Organizer)",
            categories,
            allowMultiCategoryRegistration,
            multiCategoryDiscount:
                allowMultiCategoryRegistration && multiCategoryDiscountEnabled
                    ? { type: multiCategoryDiscountType, value: Number(multiCategoryDiscountValue) }
                    : null,
            autoApproveRegistrations,
            requireDuprId,
            contacts: contacts.map((c) => ({ name: c.name, phone: c.phone })).filter(Boolean),
            cover: coverPreview ?? null,
            description: initialData?.description ?? "",
        };

        if (onUpdate) onUpdate(payload as Tournament);
        else onCreate?.(payload as Tournament);

        close();
    };

    const STEP_LABELS = ["Basic", "Sessions", "Registration", "Categories", "Review"];

    // candidate subcategories for team: presets + custom categories in map
    const candidateTeamSubcategories = [
        ...PRESET_CATEGORIES.filter((c) => c.kind !== "team").map((c) => ({ id: c.id, label: c.label })),
        ...Object.values(selectedCategories).filter((c) => c.kind === "custom").map((c) => ({ id: c.id, label: c.label })),
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit tournament" : "Create tournament"}</DialogTitle>
                    <DialogDescription>{STEP_LABELS[step]} — fill details and continue</DialogDescription>
                </DialogHeader>

                <div className="mt-3 mb-4 flex items-center gap-2 text-xs">
                    {STEP_LABELS.map((label, i) => (
                        <div
                            key={label}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md ${i === step ? "bg-[#7c3aed]/10 text-[#7c3aed]" : "text-slate-500"}`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i <= step ? "bg-[#7c3aed] text-white" : "bg-slate-200 text-slate-500"}`}>
                                {i + 1}
                            </div>
                            <div>{label}</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 0 */}
                    {step === 0 && (
                        <section className="space-y-3">
                            <label className="block">
                                <span className="text-xs text-slate-600">Tournament Name</span>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. City Open 2025" />
                            </label>

                            <label className="block">
                                <span className="text-xs text-slate-600">Location</span>
                                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue or address" />
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                                <div>
                                    <div className="text-xs text-slate-600 mb-1">Tournament cover (optional)</div>
                                    <input type="file" accept="image/*" onChange={(e) => handleCoverFileChange(e.target.files?.[0] ?? null)} className="mb-2" />
                                    {coverPreview && <img src={coverPreview} alt="cover preview" className="w-48 h-28 object-cover rounded-md border" />}
                                </div>

                                <div>
                                    <div className="text-xs text-slate-600 mb-1">Contact persons (up to 5)</div>
                                    <div className="space-y-2">
                                        {contacts.map((c) => (
                                            <div key={c.id} className="grid grid-cols-3 gap-2 items-end">
                                                <label className="col-span-1">
                                                    <span className="text-xs text-slate-500">Name</span>
                                                    <Input value={c.name} onChange={(e) => updateContact(c.id, { name: e.target.value })} />
                                                </label>
                                                <label className="col-span-1">
                                                    <span className="text-xs text-slate-500">Phone</span>
                                                    <Input value={c.phone} onChange={(e) => updateContact(c.id, { phone: e.target.value })} />
                                                </label>
                                                <div className="col-span-1 flex items-center gap-2">
                                                    {contacts.length > 1 && (
                                                        <button type="button" onClick={() => removeContact(c.id)} className="text-xs text-red-500">
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div>
                                            <Button variant="ghost" size="sm" type="button" onClick={addContact} disabled={contacts.length >= 5}>
                                                <Plus className="w-4 h-4" /> Add contact
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={autoApproveRegistrations} onChange={(e) => setAutoApproveRegistrations(e.target.checked)} className="w-4 h-4" />
                                    <span className="text-sm">Auto-approve registrations</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={requireDuprId} onChange={(e) => setRequireDuprId(e.target.checked)} className="w-4 h-4" />
                                    <span className="text-sm">Require player's DUPr ID on registration</span>
                                </label>
                            </div>
                        </section>
                    )}

                    {/* Step 1 */}
                    {step === 1 && (
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-slate-700">Date & time</div>
                                    <div className="text-xs text-slate-500">Provide one or multiple session dates</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-600">Multiple dates</label>
                                    <input type="checkbox" checked={useMultipleDates} onChange={(e) => setUseMultipleDates(e.target.checked)} className="w-4 h-4" />
                                </div>
                            </div>

                            {dateTimes.map((d) => (
                                <div key={d.id} className="grid grid-cols-2 gap-2 items-end">
                                    <label className="block">
                                        <span className="text-xs text-slate-600">Date</span>
                                        <Input type="date" value={d.date} onChange={(e) => updateDateTime(d.id, { date: e.target.value })} />
                                    </label>

                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="block">
                                                <span className="text-xs text-slate-600">Time</span>
                                                <Input type="time" value={d.time} onChange={(e) => updateDateTime(d.id, { time: e.target.value })} />
                                            </label>
                                        </div>

                                        <div>
                                            {dateTimes.length > 1 && (
                                                <button type="button" onClick={() => removeDateTimeRow(d.id)} aria-label="Remove date" className="p-2 rounded-md hover:bg-slate-100">
                                                    <Trash className="w-4 h-4 text-slate-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {useMultipleDates && (
                                <div>
                                    <Button variant="ghost" size="sm" type="button" onClick={addDateTimeRow} className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Add another date
                                    </Button>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <section className="grid grid-cols-2 gap-3">
                            <label>
                                <span className="text-xs text-slate-600">Registration start</span>
                                <Input type="date" value={registrationStart} onChange={(e) => setRegistrationStart(e.target.value)} />
                            </label>

                            <label>
                                <span className="text-xs text-slate-600">Registration end</span>
                                <Input type="date" value={registrationEnd} onChange={(e) => setRegistrationEnd(e.target.value)} />
                            </label>
                        </section>
                    )}

                    {/* Step 3: Categories */}
                    {step === 3 && (
                        <section className="space-y-3">
                            <div>
                                <div className="text-sm font-medium text-slate-700">Categories</div>
                                <div className="text-xs text-slate-500">Select categories and set registration fee & maximum slots inline.</div>
                            </div>

                            {isTeamSelected() ? (
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
                                            value={selectedCategories[getTeamId()!]?.maxParticipantsPerTeam ?? ""}
                                            onChange={(e) => updateCategoryMeta(getTeamId()!, { maxParticipantsPerTeam: e.target.value ? Number(e.target.value) : undefined })}
                                            className="rounded border px-2 py-1"
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <div className="text-xs text-slate-500 mb-1">Sub-categories included in team event</div>
                                        <div className="grid gap-2">
                                            {candidateTeamSubcategories.map((c) => {
                                                const teamId = getTeamId()!;
                                                const teamMeta = selectedCategories[teamId];
                                                const selectedSubs = new Set(teamMeta?.teamSubcategories ?? []);
                                                const checked = selectedSubs.has(c.id);

                                                const subMeta = selectedCategories[c.id];

                                                return (
                                                    <div key={c.id} className="flex items-center justify-between gap-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleTeamSubcategory(teamId, c.id)}
                                                                className="w-4 h-4"
                                                            />
                                                            <div className="text-sm">{c.label}</div>
                                                        </label>

                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                placeholder="Fee USD"
                                                                value={subMeta?.fee ?? ""}
                                                                onChange={(e) => {
                                                                    const feeVal = e.target.value === "" ? null : Number(e.target.value);
                                                                    updateCategoryMeta(c.id, { fee: feeVal });
                                                                }}
                                                                className="text-xs rounded border px-2 py-1 w-28"
                                                            />

                                                            {subMeta?.kind === "custom" ? (
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    placeholder="Max slots"
                                                                    value={subMeta?.maxSlotsPerCategory ?? ""}
                                                                    onChange={(e) => updateCategoryMeta(c.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })}
                                                                    className="text-xs rounded border px-2 py-1 w-32"
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Input placeholder="Add custom sub-category (appears as sub-category)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                                        <Button variant="outline" onClick={addCustomCategory} type="button">Add</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    {PRESET_CATEGORIES.filter((c) => c.kind !== "team").map((opt) => {
                                        const checked = Boolean(selectedCategories[opt.id]);
                                        return (
                                            <div key={opt.id} className="flex items-center gap-3 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={checked} onChange={() => toggleCategory(opt)} className="w-4 h-4" />
                                                    <div className="text-sm">{opt.label}</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {checked && opt.kind === "split" && (
                                                        <input
                                                            placeholder="Age split e.g. U18,U35"
                                                            value={selectedCategories[opt.id]?.ageSplit ?? ""}
                                                            onChange={(e) => updateCategoryMeta(opt.id, { ageSplit: e.target.value })}
                                                            className="text-xs rounded border px-2 py-1"
                                                        />
                                                    )}

                                                    <input
                                                        type="number"
                                                        min={0}
                                                        placeholder="Fee USD"
                                                        value={checked ? (selectedCategories[opt.id]?.fee ?? "") : ""}
                                                        onChange={(e) => updateCategoryMeta(opt.id, { fee: e.target.value === "" ? null : Number(e.target.value) })}
                                                        disabled={!checked}
                                                        className="text-xs rounded border px-2 py-1 w-28"
                                                    />

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        placeholder="Max slots"
                                                        value={checked ? (selectedCategories[opt.id]?.maxSlotsPerCategory ?? "") : ""}
                                                        onChange={(e) => updateCategoryMeta(opt.id, { maxSlotsPerCategory: e.target.value === "" ? null : Number(e.target.value) })}
                                                        disabled={!checked}
                                                        className="text-xs rounded border px-2 py-1 w-32"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Input placeholder="Add custom category (e.g. Veterans Singles)" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} />
                                        <Button variant="outline" onClick={addCustomCategory} type="button">Add</Button>
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
                                                            <Input type="number" min={0} value={multiCategoryDiscountValue} onChange={(e) => setMultiCategoryDiscountValue(e.target.value === "" ? "" : Number(e.target.value))} placeholder={multiCategoryDiscountType === "percent" ? "e.g. 10 (for 10%)" : "e.g. 5"} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={isTeamSelected()} onChange={toggleTeamEvent} className="w-4 h-4" />
                                    <span className="text-sm">Enable Team Event (when enabled, categories become team sub-categories)</span>
                                </label>
                                <div className="text-xs text-slate-400 mt-1">Note: When Team Event is active, multi-category registration is disabled. Custom categories become available as sub-categories and can be assigned fee/max slots.</div>
                            </div>
                        </section>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <section className="space-y-3">
                            <div className="text-sm font-medium">Review</div>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-xs text-slate-500">Name</div>
                                    <div className="text-sm">{title || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Location</div>
                                    <div className="text-sm">{location || "—"}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Cover</div>
                                    {coverPreview ? <img src={coverPreview} alt="cover preview" className="w-48 h-28 object-cover rounded-md border" /> : <div className="text-sm">No cover uploaded</div>}
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Contacts</div>
                                    <ul className="text-sm list-disc ml-5">
                                        {contacts.map((c) => (
                                            <li key={c.id}>{c.name || "—"} {c.phone ? `• ${c.phone}` : ""}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Sessions</div>
                                    <ul className="text-sm list-disc ml-5">
                                        {dateTimes.map((d) => (
                                            <li key={d.id}>
                                                {d.date} {d.time}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Registration window</div>
                                    <div className="text-sm">{registrationStart || "—"} — {registrationEnd || "—"}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Categories</div>
                                    <ul className="text-sm list-disc ml-5">
                                        {Object.values(selectedCategories).map((c) => (
                                            <li key={c.id}>
                                                {c.label} — Fee: {c.fee != null ? `$${c.fee}` : "—"}
                                                {c.kind !== "team" && c.maxSlotsPerCategory ? ` — max slots: ${c.maxSlotsPerCategory}` : ""}
                                                {c.kind === "split" && c.ageSplit ? ` — ${c.ageSplit}` : ""}
                                                {c.kind === "team" && c.maxParticipantsPerTeam ? ` — team size: ${c.maxParticipantsPerTeam}` : ""}
                                                {c.kind === "team" && c.teamSubcategories && c.teamSubcategories.length > 0 ? ` — includes: ${c.teamSubcategories.join(", ")}` : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Multi-category registration</div>
                                    <div className="text-sm">{allowMultiCategoryRegistration ? "Allowed" : "Not allowed"}</div>
                                    {allowMultiCategoryRegistration && multiCategoryDiscountEnabled && <div className="text-sm">Discount: {multiCategoryDiscountType === "percent" ? `${multiCategoryDiscountValue}%` : `$${multiCategoryDiscountValue}`}</div>}
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Auto-approve registrations</div>
                                    <div className="text-sm">{autoApproveRegistrations ? "Yes" : "No (manual approval required)"}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-slate-500">Require DUPr ID</div>
                                    <div className="text-sm">{requireDuprId ? "Yes" : "No"}</div>
                                </div>
                            </div>
                        </section>
                    )}

                    {errors && <div className="text-sm text-red-600 mt-3">{errors}</div>}

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <Button variant="ghost" onClick={close} type="button">Cancel</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {step > 0 && <Button variant="outline" onClick={handleBack} type="button">Back</Button>}

                            {step < 4 ? (
                                <Button onClick={handleNext} type="button">Next</Button>
                            ) : (
                                <Button type="submit"> {initialData ? "Save changes" : "Create tournament"} </Button>
                            )}
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
