"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { Tournament } from "@/types/tournament";
import type { Category } from "../types";
import BasicStep from "./steps/BasicStep";
import CategoriesStep from "./steps/CategoriesStep";
import RegistrationStep from "./steps/RegistrationStep";
import ReviewStep from "./steps/ReviewStep";
import SessionsStep from "./steps/SessionsStep";

type Contact = { id: string; name: string; phone: string };
type SessionRow = { id: string; date: string; time: string };

const PRESET_CATEGORIES_BASE: Category[] = [
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

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    onCreate?: (payload: Tournament) => void;
    onUpdate?: (payload: Tournament) => void;
    initialData?: Tournament | null;
};

export default function CreateTournamentDialog({ open, setOpen, onCreate, onUpdate, initialData = null }: Props) {
    const [step, setStep] = useState<number>(0);

    // Basic
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");

    // Cover image upload
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // Contacts
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

    // Categories map (id -> Category)
    const [selectedCategories, setSelectedCategories] = useState<Record<string, Category>>({});
    const [customCategoryInput, setCustomCategoryInput] = useState("");

    // Multi-category registration + discount
    const [allowMultiCategoryRegistration, setAllowMultiCategoryRegistration] = useState(false);
    const [multiCategoryDiscountEnabled, setMultiCategoryDiscountEnabled] = useState(false);
    const [multiCategoryDiscountType, setMultiCategoryDiscountType] = useState<"percent" | "fixed">("percent");
    const [multiCategoryDiscountValue, setMultiCategoryDiscountValue] = useState<number | "">("");

    // UI
    const [errors, setErrors] = useState<string | null>(null);

    const PRESET_CATEGORIES = PRESET_CATEGORIES_BASE;

    // populate edit values
    useEffect(() => {
        if (!initialData) return;

        setTitle(initialData.title ?? "");
        setLocation(initialData.location ?? "");
        setCity((initialData as any).city ?? "");
        setDescription((initialData as any).description ?? "");
        setCoverPreview((initialData as any).cover ?? null);

        const incomingContacts = (initialData as any).contacts ?? [];
        setContacts(
            incomingContacts.length > 0
                ? incomingContacts.map((c: any) => ({ id: uid("c_"), name: c.name ?? "", phone: c.phone ?? "" }))
                : [{ id: uid("c_"), name: "", phone: "" }]
        );

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

        const catsArr = (initialData as any).categories ?? [];
        const catMap: Record<string, Category> = {};
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
        setCity("");
        setDescription("");
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

    // categories logic
    function isTeamSelected(): boolean {
        return Object.values(selectedCategories).some((c) => c.kind === "team");
    }

    function getTeamId(): string | undefined {
        const t = Object.values(selectedCategories).find((c) => c.kind === "team");
        return t?.id;
    }

    function toggleCategory(opt: Category) {
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
                delete copy[teamId];
                return copy;
            }

            copy[teamId] = {
                id: teamId,
                label: teamOpt.label,
                kind: "team",
                fee: null,
                teamSubcategories: [],
                maxParticipantsPerTeam: null,
            };

            for (const k of Object.keys(copy)) {
                if (k !== teamId) delete copy[k];
            }

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
            const cat: Category = { id, label, kind: "custom", fee: null, maxSlotsPerCategory: null };
            copy[id] = cat;
            setCustomCategoryInput("");
            return copy;
        });
    }

    function updateCategoryMeta(id: string, patch: Partial<Category>) {
        setSelectedCategories((prev) => {
            if (!prev[id]) {
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

            if (!copy[subcatId]) {
                const preset = PRESET_CATEGORIES.find((p) => p.id === subcatId);
                if (preset) copy[subcatId] = { ...preset, fee: null, maxSlotsPerCategory: null };
                else copy[subcatId] = { id: subcatId, label: subcatId, kind: "custom", fee: null, maxSlotsPerCategory: null };
            }

            return copy;
        });
    }

    // validation per step (kept same validation as before)
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
            endDate: dateTimes.length > 1 ? `${dateTimes[dateTimes.length - 1].date}T${dateTimes[dateTimes.length - 1].time}` : undefined,
            sessions: dateTimes.map((d) => ({ date: d.date, time: d.time, iso: `${d.date}T${d.time}` })),
            location,
            city,
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
            description,
        };

        if (onUpdate) onUpdate(payload as Tournament);
        else onCreate?.(payload as Tournament);

        close();
    };

    const STEP_LABELS = ["Basic", "Sessions", "Registration", "Categories", "Review"];

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
                    {step === 0 && (
                        <BasicStep
                            title={title}
                            setTitle={setTitle}
                            location={location}
                            setLocation={setLocation}
                            city={city}
                            setCity={setCity}
                            description={description}
                            setDescription={setDescription}
                            coverPreview={coverPreview}
                            setCoverFile={handleCoverFileChange}
                            setCoverPreview={setCoverPreview}
                            contacts={contacts}
                            addContact={addContact}
                            removeContact={removeContact}
                            updateContact={updateContact}
                            autoApproveRegistrations={autoApproveRegistrations}
                            setAutoApproveRegistrations={setAutoApproveRegistrations}
                            requireDuprId={requireDuprId}
                            setRequireDuprId={setRequireDuprId}
                        />
                    )}

                    {step === 1 && (
                        <SessionsStep
                            useMultipleDates={useMultipleDates}
                            setUseMultipleDates={setUseMultipleDates}
                            dateTimes={dateTimes}
                            addDateTimeRow={addDateTimeRow}
                            removeDateTimeRow={removeDateTimeRow}
                            updateDateTime={updateDateTime}
                        />
                    )}

                    {step === 2 && (
                        <RegistrationStep
                            registrationStart={registrationStart}
                            registrationEnd={registrationEnd}
                            setRegistrationStart={setRegistrationStart}
                            setRegistrationEnd={setRegistrationEnd}
                        />
                    )}

                    {step === 3 && (
                        <CategoriesStep
                            selectedCategories={selectedCategories}
                            presetCategories={PRESET_CATEGORIES}
                            toggleCategory={toggleCategory}
                            toggleTeamEvent={toggleTeamEvent}
                            isTeamSelected={isTeamSelected}
                            getTeamId={getTeamId}
                            updateCategoryMeta={updateCategoryMeta}
                            toggleTeamSubcategory={toggleTeamSubcategory}
                            addCustomCategory={addCustomCategory}
                            customCategoryInput={customCategoryInput}
                            setCustomCategoryInput={setCustomCategoryInput}
                            allowMultiCategoryRegistration={allowMultiCategoryRegistration}
                            setAllowMultiCategoryRegistration={setAllowMultiCategoryRegistration}
                            multiCategoryDiscountEnabled={multiCategoryDiscountEnabled}
                            setMultiCategoryDiscountEnabled={setMultiCategoryDiscountEnabled}
                            multiCategoryDiscountType={multiCategoryDiscountType}
                            setMultiCategoryDiscountType={setMultiCategoryDiscountType}
                            multiCategoryDiscountValue={multiCategoryDiscountValue}
                            setMultiCategoryDiscountValue={setMultiCategoryDiscountValue}
                            candidateTeamSubcategories={candidateTeamSubcategories}
                        />
                    )}

                    {step === 4 && (
                        <ReviewStep
                            title={title}
                            location={location}
                            city={city}
                            coverPreview={coverPreview}
                            contacts={contacts}
                            dateTimes={dateTimes}
                            registrationStart={registrationStart}
                            registrationEnd={registrationEnd}
                            selectedCategories={selectedCategories}
                            allowMultiCategoryRegistration={allowMultiCategoryRegistration}
                            multiCategoryDiscount={multiCategoryDiscountEnabled}
                            autoApproveRegistrations={autoApproveRegistrations}
                            requireDuprId={requireDuprId}
                        />
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
