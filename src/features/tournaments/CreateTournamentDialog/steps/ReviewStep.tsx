import type { Category, Contact, SessionRow } from "../../types";

type Props = {
    title: string;
    location: string;
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
    const { title, location, coverPreview, contacts, dateTimes, registrationStart, registrationEnd, selectedCategories, allowMultiCategoryRegistration, multiCategoryDiscount, autoApproveRegistrations, requireDuprId } = props;

    return (
        <section className="space-y-3">
            <div className="text-sm font-medium">Review</div>

            <div className="space-y-2 text-sm">
                <div><div className="text-xs text-slate-500">Name</div>{title || "—"}</div>
                <div><div className="text-xs text-slate-500">Location</div>{location || "—"}</div>
                <div><div className="text-xs text-slate-500">Cover</div>{coverPreview ? <img src={coverPreview} alt="cover preview" className="w-48 h-28 object-cover rounded-md border" /> : <div>No cover uploaded</div>}</div>
                <div><div className="text-xs text-slate-500">Contacts</div><ul className="list-disc ml-5">{contacts.map(c => <li key={c.id}>{c.name || "—"} {c.phone ? `• ${c.phone}` : ""}</li>)}</ul></div>
                <div><div className="text-xs text-slate-500">Sessions</div><ul className="list-disc ml-5">{dateTimes.map(s => <li key={s.id}>{s.date} {s.time}</li>)}</ul></div>
                <div><div className="text-xs text-slate-500">Registration window</div>{registrationStart || "—"} — {registrationEnd || "—"}</div>

                <div>
                    <div className="text-xs text-slate-500">Categories</div>
                    <ul className="list-disc ml-5">
                        {Object.values(selectedCategories).map(c => (
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

                <div><div className="text-xs text-slate-500">Multi-category registration</div>{allowMultiCategoryRegistration ? "Allowed" : "Not allowed"}{allowMultiCategoryRegistration && multiCategoryDiscount && <div>Discount: {multiCategoryDiscount.type === "percent" ? `${multiCategoryDiscount.value}%` : `$${multiCategoryDiscount.value}`}</div>}</div>

                <div><div className="text-xs text-slate-500">Auto-approve registrations</div>{autoApproveRegistrations ? "Yes" : "No"}</div>
                <div><div className="text-xs text-slate-500">Require DUPr ID</div>{requireDuprId ? "Yes" : "No"}</div>
            </div>
        </section>
    );
}
