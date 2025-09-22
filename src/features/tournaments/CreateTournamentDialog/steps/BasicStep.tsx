import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import type { Contact } from "../types";
import { readFileAsDataURL } from "../utils";

type Props = {
    title: string;
    setTitle: (s: string) => void;
    location: string;
    setLocation: (s: string) => void;
    coverPreview: string | null;
    setCoverFile: (file: File | null) => void;
    setCoverPreview: (url: string | null) => void;
    contacts: Contact[];
    addContact: () => void;
    removeContact: (id: string) => void;
    updateContact: (id: string, patch: Partial<Contact>) => void;
    autoApproveRegistrations: boolean;
    setAutoApproveRegistrations: (v: boolean) => void;
    requireDuprId: boolean;
    setRequireDuprId: (v: boolean) => void;
};

export default function BasicStep(props: Props) {
    const {
        title,
        setTitle,
        location,
        setLocation,
        coverPreview,
        setCoverFile,
        setCoverPreview,
        contacts,
        addContact,
        removeContact,
        updateContact,
        autoApproveRegistrations,
        setAutoApproveRegistrations,
        requireDuprId,
        setRequireDuprId,
    } = props;

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        if (!f) {
            setCoverFile(null);
            setCoverPreview(null);
            return;
        }
        setCoverFile(f);
        const data = await readFileAsDataURL(f);
        setCoverPreview(data);
    }

    return (
        <section className="space-y-4">
            <label className="block">
                <span className="text-xs text-slate-600">Tournament Name</span>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. City Open 2025" />
            </label>

            <label className="block">
                <span className="text-xs text-slate-600">Location</span>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue or address" />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <div className="text-xs text-slate-600 mb-1">Tournament cover (optional)</div>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {coverPreview && <img src={coverPreview} alt="cover preview" className="w-48 h-28 object-cover rounded-md border mt-2" />}
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
                        <Button variant="ghost" size="sm" type="button" onClick={addContact} disabled={contacts.length >= 5}>
                            Add contact
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
    );
}
