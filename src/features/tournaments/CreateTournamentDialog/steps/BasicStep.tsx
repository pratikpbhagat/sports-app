"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import type { Contact } from "../../types";
import { readFileAsDataURL } from "../utils";

type Props = {
    title: string;
    setTitle: (s: string) => void;
    location: string;
    setLocation: (s: string) => void;
    city: string;
    setCity: (s: string) => void;
    description: string;
    setDescription: (s: string) => void;
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
        city,
        setCity,
        description,
        setDescription,
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
            <div>
                <Label htmlFor="tournament-name">Tournament Name</Label>
                <Input id="tournament-name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. City Open 2025" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue or address" className="mt-1" />
                </div>

                <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="mt-1" />
                </div>
            </div>

            <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description about the tournament" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <Label> Tournament cover (optional) </Label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
                    {coverPreview && <img src={coverPreview} alt="cover preview" className="w-48 h-28 object-cover rounded-md border mt-2" />}
                </div>

                <div>
                    <Label> Contact persons (up to 5) </Label>
                    <div className="space-y-2 mt-2">
                        {contacts.map((c) => (
                            <div key={c.id} className="grid grid-cols-3 gap-2 items-end">
                                <div>
                                    <Label className="text-xs">Name</Label>
                                    <Input value={c.name} onChange={(e) => updateContact(c.id, { name: e.target.value })} />
                                </div>

                                <div>
                                    <Label className="text-xs">Phone</Label>
                                    <Input value={c.phone} onChange={(e) => updateContact(c.id, { phone: e.target.value })} />
                                </div>

                                <div className="flex items-center gap-2">
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
                                Add contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                    <Checkbox id="auto-approve" checked={autoApproveRegistrations} onCheckedChange={(v) => setAutoApproveRegistrations(Boolean(v))} />
                    <Label htmlFor="auto-approve" className="m-0">Auto-approve registrations</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="dupr-id" checked={requireDuprId} onCheckedChange={(v) => setRequireDuprId(Boolean(v))} />
                    <Label htmlFor="dupr-id" className="m-0">Require player's DUPr ID on registration</Label>
                </div>
            </div>
        </section>
    );
}
