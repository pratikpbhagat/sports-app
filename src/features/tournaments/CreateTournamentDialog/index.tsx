"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import BasicStep from "./steps/BasicStep";
import CategoriesStep from "./steps/CategoriesStep";
import RegistrationStep from "./steps/RegistrationStep";
import ReviewStep from "./steps/ReviewStep";
import SessionsStep from "./steps/SessionsStep";

import type { CategoryOption, Contact, MultiCategoryDiscount, SessionRow } from "./types";
import { uid } from "./utils";

import type { Tournament } from "@/types/tournament";

// Presets copy from original large file (trimmed to essentials)
const PRESET_CATEGORIES: CategoryOption[] = [
    { id: "team-event", label: "Team Event (select sub-categories)", kind: "team" },
    { id: "singles-men", label: "Singles — Men", kind: "singles" },
    { id: "singles-women", label: "Singles — Women", kind: "singles" },
    { id: "doubles-men", label: "Doubles — Men", kind: "doubles" },
    { id: "doubles-women", label: "Doubles — Women", kind: "doubles" },
    { id: "mixed-doubles", label: "Mixed Doubles", kind: "mixed" },
    { id: "split-age", label: "Split category (Age split)", kind: "split" },
    { id: "open-doubles", label: "Open Doubles", kind: "open" },
];

type Props = { open: boolean; setOpen: (v: boolean) => void; onCreate: (payload: Tournament) => void };

export default function CreateTournamentDialog({ open, setOpen, onCreate }: Props) {
    const [step, setStep] = useState(0);

    // Basic
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // contacts
    const [contacts, setContacts] = useState<Contact[]>([{ id: uid("c_"), name: "", phone: "" }]);

    // sessions
    const [useMultipleDates, setUseMultipleDates] = useState(false);
    const [dateTimes, setDateTimes] = useState<SessionRow[]>([{ id: uid("dt_"), date: "", time: "" }]);

    // registration
    const [registrationStart, setRegistrationStart] = useState("");
    const [registrationEnd, setRegistrationEnd] = useState("");

    // approvals & dupr
    const [autoApproveRegistrations, setAutoApproveRegistrations] = useState(true);
    const [requireDuprId, setRequireDuprId] = useState(false);

    // categories
    const [selectedCategories, setSelectedCategories] = useState<Record<string, CategoryOption>>({});
    const [customCategoryInput, setCustomCategoryInput] = useState("");

    // multi-cat discounts
    const [allowMultiCategoryRegistration, setAllowMultiCategoryRegistration] = useState(false);
    const [multiCategoryDiscountEnabled, setMultiCategoryDiscountEnabled] = useState(false);
    const [multiCategoryDiscountType, setMultiCategoryDiscountType] = useState<"percent" | "fixed">("percent");
    const [multiCategoryDiscountValue, setMultiCategoryDiscountValue] = useState<number | "">("");

    const [errors, setErrors] = useState<string | null>(null);

    // helpers for contacts
    const addContact = () => setContacts((p) => (p.length >= 5 ? p : [...p, { id: uid("c_"), name: "", phone: "" }]));
    const removeContact = (id: string) => setContacts((p) => (p.length === 1 ? p : p.filter((c) => c.id !== id)));
    const updateContact = (id: string, patch: Partial<Contact>) => setContacts((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));

    // session helpers
    const addDateTimeRow = () => setDateTimes((p) => [...p, { id: uid("dt_"), date: "", time: "" }]);
    const removeDateTimeRow = (id: string) => setDateTimes((p) => p.filter((d) => d.id !== id));
    const updateDateTime = (id: string, patch: Partial<SessionRow>) => setDateTimes((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)));

    // category helpers (these mirror the logic you already had)
    function isTeamSelected() {
        return Object.values(selectedCategories).some((c) => c.kind === "team");
    }
    function getTeamId() {
        return Object.values(selectedCategories).find((c) => c.kind === "team")?.id;
    }

    function toggleCategory(opt: CategoryOption) {
        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const teamSelected = Object.values(copy).some((c) => c.kind === "team");
            if (teamSelected && opt.kind !== "team") {
                return prev;
            }
            if (copy[opt.id]) delete copy[opt.id];
            else copy[opt.id] = { ...opt, fee: null, ageSplit: opt.kind === "split" ? "" : opt.ageSplit ?? null, maxSlotsPerCategory: null };
            return copy;
        });
    }

    function toggleTeamEvent() {
        setSelectedCategories((prev) => {
            const copy = { ...prev };
            const teamOpt = PRESET_CATEGORIES.find((c) => c.kind === "team")!;
            const teamId = teamOpt.id;
            if (copy[teamId]) {
                // disable team
                delete copy[teamId];
                return copy;
            }
            // enable team
            copy[teamId] = { id: teamId, label: teamOpt.label, kind: "team", fee: null, teamSubcategories: [], maxParticipantsPerTeam: null };
            // remove others
            for (const k of Object.keys(copy)) if (k !== teamId) delete copy[k];
            // disable multi-cat
            setAllowMultiCategoryRegistration(false);
            setMultiCategoryDiscountEnabled(false);
            return copy;
        });
    }

    function addCustomCategory(label: string) {
        if (!label.trim()) return;
        const id = uid("custom_");
        setSelectedCategories((prev) => ({ ...prev, [id]: { id, label: label.trim(), kind: "custom", fee: null, maxSlotsPerCategory: null } }));
    }

    function updateCategoryMeta(id: string, patch: Partial<CategoryOption>) {
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

    const candidateTeamSubcategories = [
        ...PRESET_CATEGORIES.filter((c) => c.kind !== "team").map((c) => ({ id: c.id, label: c.label })),
        ...Object.values(selectedCategories).filter((c) => c.kind === "custom").map((c) => ({ id: c.id, label: c.label })),
    ];

    // small validation per step (keeps wrapper simpler)
    function validateStep(s: number): string | null {
        if (s === 0) {
            if (!title.trim()) return "Tournament name is required.";
            if (!location.trim()) return "Location is required.";
        }
        if (s === 1) {
            if (dateTimes.some((d) => !d.date || !d.time)) return "Please provide date and time for each session.";
        }
        if (s === 2) {
            if (!registrationStart || !registrationEnd) return "Please provide registration start and end dates.";
            if (new Date(registrationEnd) < new Date(registrationStart)) return "Registration end must be after start.";
        }
        if (s === 3) {
            if (Object.keys(selectedCategories).length === 0) return "Please select at least one category (or Team Event).";
            const teamSelected = isTeamSelected();
            if (!teamSelected) {
                for (const c of Object.values(selectedCategories)) {
                    if (c.kind === "team") continue;
                    if (c.fee == null) return `Please provide a registration fee for "${c.label}".`;
                    if (c.maxSlotsPerCategory == null || c.maxSlotsPerCategory <= 0) return `Please provide maximum slots for "${c.label}".`;
                    if (c.kind === "split" && (!c.ageSplit || !c.ageSplit.trim())) return `Please provide age split details for "${c.label}".`;
                }
                if (allowMultiCategoryRegistration && multiCategoryDiscountEnabled) {
                    if (multiCategoryDiscountValue === "" || multiCategoryDiscountValue === null) return "Please provide a discount value.";
                    const val = Number(multiCategoryDiscountValue);
                    if (multiCategoryDiscountType === "percent" && (val <= 0 || val > 100)) return "Discount percent must be 1-100.";
                }
            } else {
                const teamId = getTeamId()!;
                const teamMeta = selectedCategories[teamId];
                if (!teamMeta) return "Team event configuration missing.";
                if (!teamMeta.teamSubcategories || teamMeta.teamSubcategories.length === 0) return "Please select at least one sub-category for the Team Event.";
                if (!teamMeta.maxParticipantsPerTeam || teamMeta.maxParticipantsPerTeam <= 0) return "Please provide max participants per team.";
                for (const sid of teamMeta.teamSubcategories) {
                    const sub = selectedCategories[sid];
                    if (!sub || sub.fee == null) return `Please set a fee for "${sub?.label ?? sid}".`;
                }
            }
        }
        return null;
    }

    function next() {
        setErrors(null);
        const v = validateStep(step);
        if (v) return setErrors(v);
        setStep((p) => Math.min(4, p + 1));
    }

    function back() {
        setErrors(null);
        setStep((p) => Math.max(0, p - 1));
    }

    async function handleClose() {
        // reset minimal fields or do as needed
        setStep(0);
        setTitle("");
        setLocation("");
        setCoverFile(null);
        setCoverPreview(null);
        setContacts([{ id: uid("c_"), name: "", phone: "" }]);
        setDateTimes([{ id: uid("dt_"), date: "", time: "" }]);
        setRegistrationStart("");
        setRegistrationEnd("");
        setSelectedCategories({});
        setCustomCategoryInput("");
        setAllowMultiCategoryRegistration(false);
        setMultiCategoryDiscountEnabled(false);
        setMultiCategoryDiscountValue("");
        setErrors(null);
        setOpen(false);
    }

    function submit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        // final validation run
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

        const multiCategoryDiscount: MultiCategoryDiscount =
            allowMultiCategoryRegistration && multiCategoryDiscountEnabled
                ? { type: multiCategoryDiscountType, value: Number(multiCategoryDiscountValue) }
                : null;

        const payload: any = {
            id: `t_${Date.now()}`,
            title: title.trim(),
            startDate: dateTimes[0] ? `${dateTimes[0].date}T${dateTimes[0].time}` : "",
            endDate: dateTimes.length > 1 ? `${dateTimes[dateTimes.length - 1].date}T${dateTimes[dateTimes.length - 1].time}` : undefined,
            sessions: dateTimes.map((d) => ({ date: d.date, time: d.time, iso: `${d.date}T${d.time}` })),
            location,
            registrationStart,
            registrationEnd,
            capacity: undefined,
            registered: 0,
            status: "upcoming",
            organizer: "You (Organizer)",
            categories,
            allowMultiCategoryRegistration,
            multiCategoryDiscount,
            autoApproveRegistrations,
            requireDuprId,
            contacts: contacts.map((c) => ({ name: c.name, phone: c.phone })).filter(Boolean),
            cover: coverPreview ?? null,
            description: "",
        };

        onCreate(payload as Tournament);
        handleClose();
    }

    const STEP_LABELS = ["Basic", "Sessions", "Registration", "Categories", "Review"];

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle>Create tournament</DialogTitle>
                    <DialogDescription>{STEP_LABELS[step]} — fill details and continue</DialogDescription>
                </DialogHeader>

                <div className="mt-3 mb-4 flex items-center gap-2 text-xs">
                    {STEP_LABELS.map((label, i) => (
                        <div key={label} className={`flex items-center gap-2 px-2 py-1 rounded-md ${i === step ? "bg-[#7c3aed]/10 text-[#7c3aed]" : "text-slate-500"}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i <= step ? "bg-[#7c3aed] text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
                            <div>{label}</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={submit}>
                    {step === 0 && (
                        <BasicStep
                            title={title}
                            setTitle={setTitle}
                            location={location}
                            setLocation={setLocation}
                            coverPreview={coverPreview}
                            setCoverFile={setCoverFile}
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
                        <SessionsStep useMultipleDates={useMultipleDates} setUseMultipleDates={setUseMultipleDates} dateTimes={dateTimes} addDateTimeRow={addDateTimeRow} removeDateTimeRow={removeDateTimeRow} updateDateTime={updateDateTime} />
                    )}

                    {step === 2 && (
                        <RegistrationStep registrationStart={registrationStart} registrationEnd={registrationEnd} setRegistrationStart={setRegistrationStart} setRegistrationEnd={setRegistrationEnd} />
                    )}

                    {step === 3 && (
                        <CategoriesStep
                            presetCategories={PRESET_CATEGORIES}
                            selectedCategories={selectedCategories}
                            toggleCategory={toggleCategory}
                            addCustomCategory={addCustomCategory}
                            customCategoryInput={customCategoryInput}
                            setCustomCategoryInput={setCustomCategoryInput}
                            updateCategoryMeta={updateCategoryMeta}
                            isTeamSelected={isTeamSelected}
                            candidateTeamSubcategories={candidateTeamSubcategories}
                            getTeamId={getTeamId}
                            toggleTeamSubcategory={toggleTeamSubcategory}
                            allowMultiCategoryRegistration={allowMultiCategoryRegistration}
                            setAllowMultiCategoryRegistration={setAllowMultiCategoryRegistration}
                            multiCategoryDiscountEnabled={multiCategoryDiscountEnabled}
                            setMultiCategoryDiscountEnabled={setMultiCategoryDiscountEnabled}
                            multiCategoryDiscountType={multiCategoryDiscountType}
                            setMultiCategoryDiscountType={setMultiCategoryDiscountType}
                            multiCategoryDiscountValue={multiCategoryDiscountValue}
                            setMultiCategoryDiscountValue={setMultiCategoryDiscountValue}
                            toggleTeamEvent={toggleTeamEvent}
                        />
                    )}

                    {step === 4 && (
                        <ReviewStep
                            title={title}
                            location={location}
                            coverPreview={coverPreview}
                            contacts={contacts}
                            dateTimes={dateTimes}
                            registrationStart={registrationStart}
                            registrationEnd={registrationEnd}
                            selectedCategories={selectedCategories}
                            allowMultiCategoryRegistration={allowMultiCategoryRegistration}
                            multiCategoryDiscount={multiCategoryDiscountEnabled ? { type: multiCategoryDiscountType, value: Number(multiCategoryDiscountValue) } : null}
                            autoApproveRegistrations={autoApproveRegistrations}
                            requireDuprId={requireDuprId}
                        />
                    )}

                    {errors && <div className="text-sm text-red-600 mt-3">{errors}</div>}

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <Button variant="ghost" onClick={handleClose} type="button">Cancel</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {step > 0 && <Button variant="outline" onClick={() => setStep((p) => Math.max(0, p - 1))} type="button">Back</Button>}
                            {step < 4 ? <Button onClick={() => { const v = validateStep(step); if (v) setErrors(v); else setStep((p) => Math.min(4, p + 1)); }} type="button">Next</Button> : <Button type="submit">Create tournament</Button>}
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
