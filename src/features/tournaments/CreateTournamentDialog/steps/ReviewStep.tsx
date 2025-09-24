"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Category, Contact, SessionRow } from "../../types";

type Props = {
    title: string;
    location: string;
    city: string;
    coverPreview: string | null;
    contacts: Contact[];
    dateTimes: SessionRow[];
    registrationStart: string;
    registrationEnd: string;
    selectedCategories: Record<string, Category>;
    allowMultiCategoryRegistration: boolean;
    multiCategoryDiscount: any;
    autoApproveRegistrations: boolean;
    requireDuprId: boolean;
};

export default function ReviewStep(props: Props) {
    const {
        title,
        location,
        city,
        coverPreview,
        contacts,
        dateTimes,
        registrationStart,
        registrationEnd,
        selectedCategories,
        allowMultiCategoryRegistration,
        multiCategoryDiscount,
        autoApproveRegistrations,
        requireDuprId,
    } = props;

    const categories = Object.values(selectedCategories);

    return (
        <section className="space-y-4">
            <div>
                <div className="text-lg font-semibold">Review</div>
                <div className="text-xs text-slate-500">Confirm tournament details before creating</div>
            </div>

            {/* Basic info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Basic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Label className="text-xs">Name</Label>
                        <div className="text-sm">{title || "—"}</div>
                    </div>

                    <div>
                        <Label className="text-xs">Location</Label>
                        <div className="text-sm">{location || "—"}</div>
                    </div>

                    <div>
                        <Label className="text-xs">City</Label>
                        <div className="text-sm">{city || "—"}</div>
                    </div>
                    <div>
                        <Label className="text-xs">Cover</Label>
                        {coverPreview ? (
                            // use next/image when available; fallback to img is fine
                            <div className="mt-2">
                                <img src={coverPreview} alt="cover preview" width={384} height={224} className="rounded-md border object-cover" />
                            </div>
                        ) : (
                            <div className="text-sm">No cover uploaded</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {contacts.length === 0 ? (
                        <div className="text-sm">No contacts added</div>
                    ) : (
                        <ul className="list-disc ml-5 space-y-1 text-sm">
                            {contacts.map((c) => (
                                <li key={c.id}>
                                    <span className="font-medium">{c.name || "—"}</span>
                                    {c.phone ? <span className="text-slate-500"> • {c.phone}</span> : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    {dateTimes.length === 0 ? (
                        <div className="text-sm">No sessions provided</div>
                    ) : (
                        <ul className="list-disc ml-5 space-y-1 text-sm">
                            {dateTimes.map((d) => (
                                <li key={d.id}>
                                    {d.date} {d.time}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Registration window */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <Label className="text-xs">Window</Label>
                        <div className="text-sm">
                            {registrationStart || "—"} — {registrationEnd || "—"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <div className="text-sm">No categories selected</div>
                    ) : (
                        <ul className="list-disc ml-5 space-y-2 text-sm">
                            {categories.map((c) => (
                                <li key={c.id}>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{c.label}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {c.kind}
                                        </Badge>
                                    </div>

                                    <div className="text-xs text-slate-600 mt-1">
                                        Fee: {c.fee != null ? `$${c.fee}` : "—"}
                                        {c.kind !== "team" && c.maxSlotsPerCategory ? ` • max slots: ${c.maxSlotsPerCategory}` : ""}
                                        {c.kind === "split" && c.ageSplit ? ` • ${c.ageSplit}` : ""}
                                        {c.kind === "team" && c.maxParticipantsPerTeam ? ` • team size: ${c.maxParticipantsPerTeam}` : ""}
                                        {c.kind === "team" && c.teamSubcategories && c.teamSubcategories.length > 0 ? ` • includes: ${c.teamSubcategories.join(", ")}` : ""}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Additional settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div>
                        <Label className="text-xs">Multi-category registration</Label>
                        <div>{allowMultiCategoryRegistration ? "Allowed" : "Not allowed"}</div>
                        {allowMultiCategoryRegistration && multiCategoryDiscount && (
                            <div className="text-xs text-slate-600 mt-1">
                                Discount: {multiCategoryDiscount.type === "percent" ? `${multiCategoryDiscount.value}%` : `$${multiCategoryDiscount.value}`}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label className="text-xs">Auto-approve registrations</Label>
                        <div>{autoApproveRegistrations ? "Yes" : "No (manual approval required)"}</div>
                    </div>

                    <div>
                        <Label className="text-xs">Require DUPr ID</Label>
                        <div>{requireDuprId ? "Yes" : "No"}</div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
