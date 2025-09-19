"use client";

import { useMemo, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format as formatDateFn } from "date-fns";
import { CreditCard, Download, Plus, Trash } from "lucide-react";

type PaymentMethod = {
    id: string;
    brand: string;
    last4: string;
    exp: string;
    isDefault?: boolean;
};

type Invoice = {
    id: string;
    date: string; // ISO
    dueDate?: string;
    amount: number; // cents
    currency?: string;
    status: "paid" | "due" | "past_due" | "failed";
    pdfUrl?: string; // stub
};

const SAMPLE_METHODS: PaymentMethod[] = [
    { id: "pm_1", brand: "Visa", last4: "4242", exp: "12/26", isDefault: true },
    { id: "pm_2", brand: "Mastercard", last4: "4444", exp: "09/25" },
];

const SAMPLE_INVOICES: Invoice[] = [
    { id: "inv_2025_06", date: "2025-06-01", dueDate: "2025-06-07", amount: 1500, currency: "USD", status: "paid", pdfUrl: "#" },
    { id: "inv_2025_07", date: "2025-07-01", dueDate: "2025-07-07", amount: 900, currency: "USD", status: "paid", pdfUrl: "#" },
    { id: "inv_2025_08", date: "2025-08-01", dueDate: "2025-08-07", amount: 2900, currency: "USD", status: "due", pdfUrl: "#" },
];

function centsToDollars(cents: number, currency = "USD") {
    const dollars = (cents / 100).toFixed(2);
    return currency === "USD" ? `$${dollars}` : `${dollars} ${currency}`;
}

export default function BillingPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>(SAMPLE_METHODS);
    const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);

    const [addOpen, setAddOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);

    const [newCardBrand, setNewCardBrand] = useState("Visa");
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newExp, setNewExp] = useState("");
    const [newCvc, setNewCvc] = useState("");

    // derived
    const balanceDue = useMemo(() => invoices.filter(i => i.status !== "paid").reduce((acc, i) => acc + i.amount, 0), [invoices]);
    const latestInvoice = useMemo(() => invoices.find(i => i.status !== "paid") ?? invoices[0], [invoices]);

    function handleAddMethod() {
        if (!newCardNumber || newCardNumber.length < 4) return;
        const pm: PaymentMethod = {
            id: `pm_${Date.now()}`,
            brand: newCardBrand,
            last4: newCardNumber.slice(-4),
            exp: newExp || "01/30",
        };
        setMethods(prev => [pm, ...prev.map(m => ({ ...m, isDefault: false }))]);
        setAddOpen(false);
        // reset form (light)
        setNewCardNumber("");
        setNewExp("");
        setNewCvc("");
    }

    function handleRemoveMethod(id: string) {
        setMethods(prev => prev.filter(m => m.id !== id));
    }

    function handleSetDefault(id: string) {
        setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    }

    function handleOpenPay(inv: Invoice) {
        setPayInvoice(inv);
        setPayOpen(true);
    }

    function handleConfirmPay() {
        if (!payInvoice) return;
        setInvoices(prev => prev.map(inv => inv.id === payInvoice.id ? { ...inv, status: "paid" } : inv));
        setPayOpen(false);
        setPayInvoice(null);
    }

    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0f172a]">Billing</h1>
                    <p className="text-sm text-slate-500">Manage payment methods, view invoices and pay outstanding balances.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Balance due</div>
                        <div className="text-xl font-bold text-[#0f172a]">{centsToDollars(balanceDue)}</div>
                    </div>
                    <Button onClick={() => {
                        if (balanceDue > 0) {
                            // open pay for first due invoice
                            const inv = invoices.find(i => i.status !== "paid");
                            if (inv) handleOpenPay(inv);
                        } else {
                            alert("No outstanding balance.");
                        }
                    }}>
                        Pay balance
                    </Button>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Payment methods & subscription summary */}
                <aside className="space-y-4 lg:col-span-1">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Payment methods</CardTitle>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {methods.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between gap-3 p-3 bg-white rounded-md shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-slate-500" />
                                            <div>
                                                <div className="text-sm font-medium text-[#0f172a]">{m.brand} •••• {m.last4}</div>
                                                <div className="text-xs text-slate-500">Exp: {m.exp}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {m.isDefault && <Badge className="bg-[#22c55e] text-white">Default</Badge>}
                                            {!m.isDefault && <Button size="sm" variant="ghost" onClick={() => handleSetDefault(m.id)}>Set default</Button>}
                                            <Button size="sm" variant="destructive" onClick={() => handleRemoveMethod(m.id)} title="Remove">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {methods.length === 0 && <div className="text-sm text-slate-500">No payment methods. Add one below.</div>}
                            </div>

                            <div className="mt-4">
                                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Plus className="w-4 h-4 mr-2" /> Add payment method
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                                        <DialogHeader>
                                            <DialogTitle>Add payment method</DialogTitle>
                                            <DialogDescription>Add a card to pay invoices and subscriptions (demo only).</DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-4 grid grid-cols-1 gap-3">
                                            <label className="text-xs text-slate-600">Card brand</label>
                                            <Select onValueChange={(v) => setNewCardBrand(v)} defaultValue={newCardBrand}>
                                                <SelectTrigger className="w-full h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Visa">Visa</SelectItem>
                                                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                                                    <SelectItem value="Amex">American Express</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <label className="text-xs text-slate-600">Card number</label>
                                            <Input value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-600">Expiry (MM/YY)</label>
                                                    <Input value={newExp} onChange={(e) => setNewExp(e.target.value)} placeholder="12/26" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-600">CVC</label>
                                                    <Input value={newCvc} onChange={(e) => setNewCvc(e.target.value)} placeholder="123" />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
                                                <Button onClick={handleAddMethod}>Add card</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Subscription</CardTitle>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="text-sm text-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500">Plan</div>
                                        <div className="text-sm font-medium text-[#0f172a]">Advanced</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-[#0f172a]">$29/mo</div>
                                        <div className="text-xs text-slate-500">Next billing: {formatDateFn(new Date(), "MMM dd, yyyy")}</div>
                                    </div>
                                </div>

                                <div className="mt-3 text-xs text-slate-500">
                                    Manage your subscription or change plans in the <strong>Subscription</strong> area.
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button className="flex-1">Change plan</Button>
                                    <Button variant="ghost">Cancel</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Middle: Current invoices / pay area */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="px-6 py-4 flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-[#0f172a]">Invoices</CardTitle>
                            <div className="text-sm text-slate-500">Manage your billing history</div>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500">Latest invoice</div>
                                        <div className="text-sm font-medium text-[#0f172a]">{latestInvoice?.id ?? "—"}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-lg font-bold text-[#0f172a]">{latestInvoice ? centsToDollars(latestInvoice.amount, latestInvoice.currency) : "—"}</div>
                                        <div className="text-xs text-slate-500">Due: {latestInvoice?.dueDate ? formatDateFn(new Date(latestInvoice.dueDate), "MMM dd, yyyy") : "—"}</div>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <Button onClick={() => {
                                        if (latestInvoice && latestInvoice.status !== "paid") {
                                            handleOpenPay(latestInvoice);
                                        } else {
                                            alert("No outstanding latest invoice to pay.");
                                        }
                                    }}>
                                        Pay invoice
                                    </Button>

                                    <Button variant="outline" onClick={() => alert("Download invoice PDF (stub)")}>
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-slate-600 mb-2">All invoices</div>

                                <div className="overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left">
                                                <th className="px-4 py-2">Invoice</th>
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Amount</th>
                                                <th className="px-4 py-2">Status</th>
                                                <th className="px-4 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((inv) => (
                                                <tr key={inv.id} className="border-t">
                                                    <td className="px-4 py-3">{inv.id}</td>
                                                    <td className="px-4 py-3">{formatDateFn(new Date(inv.date), "MMM dd, yyyy")}</td>
                                                    <td className="px-4 py-3">{centsToDollars(inv.amount, inv.currency)}</td>
                                                    <td className="px-4 py-3">
                                                        {inv.status === "paid" && <Badge className="bg-[#22c55e] text-white">Paid</Badge>}
                                                        {inv.status === "due" && <Badge className="bg-[#f59e0b] text-white">Due</Badge>}
                                                        {inv.status === "past_due" && <Badge className="bg-[#ef4444] text-white">Past due</Badge>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => alert("Download (stub)")}>
                                                                <Download className="w-4 h-4" />
                                                            </Button>

                                                            {inv.status !== "paid" ? (
                                                                <Button size="sm" onClick={() => handleOpenPay(inv)}>Pay</Button>
                                                            ) : (
                                                                <Button size="sm" variant="ghost">Receipt</Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Pay invoice dialog */}
            <Dialog open={payOpen} onOpenChange={setPayOpen}>
                <DialogContent className="sm:max-w-lg bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
                    <DialogHeader>
                        <DialogTitle>Pay invoice</DialogTitle>
                        <DialogDescription>Complete payment for the selected invoice (demo flow).</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="text-sm text-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-500">Invoice</div>
                                    <div className="text-sm font-medium">{payInvoice?.id}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold">{payInvoice ? centsToDollars(payInvoice.amount, payInvoice.currency) : "—"}</div>
                                    <div className="text-xs text-slate-500">Due {payInvoice?.dueDate ? formatDateFn(new Date(payInvoice.dueDate), "MMM dd, yyyy") : "—"}</div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-slate-600">
                                Pay with:
                                <div className="mt-2 space-y-2">
                                    {methods.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                            <div>
                                                <div className="text-sm font-medium">{m.brand} •••• {m.last4}</div>
                                                <div className="text-xs text-slate-500">Exp: {m.exp}</div>
                                            </div>
                                            <div>
                                                {m.isDefault ? <Badge className="bg-[#22c55e] text-white">Default</Badge> : null}
                                            </div>
                                        </div>
                                    ))}

                                    {methods.length === 0 && <div className="text-xs text-slate-500">No payment methods. Add one first.</div>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="ghost" onClick={() => setPayOpen(false)}>Cancel</Button>
                                <Button onClick={handleConfirmPay}>Confirm payment</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}
