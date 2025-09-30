"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PlanCard, { type Plan } from "@/features/subscriptions/PlanCard";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type BillingCycle = "monthly" | "annual";

const PLANS: Plan[] = [
  {
    id: "player",
    name: "Player",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For individuals who just play — register anywhere, no caps.",
    tournamentCap: "Unlimited",
    trainingCap: "Unlimited",
    features: ["Register for any tournament", "Register for any training", "Access to basic stats"],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    monthlyPrice: 9,
    description: "Small clubs or advanced players who need light limits.",
    tournamentCap: "Up to 20 players",
    trainingCap: "Up to 20 players",
    features: ["Organizer tools", "Basic registration management", "Email notifications"],
  },
  {
    id: "advanced",
    name: "Advanced",
    monthlyPrice: 29,
    description: "Bigger clubs and organizers with expanded capacity.",
    tournamentCap: "Up to 75 players",
    trainingCap: "Up to 75 players",
    features: ["Advanced scheduling", "Bulk registration", "Priority support"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 79,
    description: "Large organizers, no hard caps (75+).",
    tournamentCap: "75+ players (no practical cap)",
    trainingCap: "75+ players (no practical cap)",
    features: ["Dedicated account manager", "Custom integrations", "SLA & analytics"],
  },
];

export default function SubscriptionPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<Plan["id"]>("player");
  const [openConfirmPlan, setOpenConfirmPlan] = useState<Plan | null>(null);

  const plansWithPrices = useMemo(() => {
    return PLANS.map((p) => {
      const monthly = p.monthlyPrice ?? 0;
      const annual = p.annualPrice ?? Math.round(monthly * 12 * 0.85);
      return { ...p, monthlyPrice: monthly, annualPrice: annual };
    });
  }, []);

  function handleSelectPlan(id: Plan["id"]) {
    setSelectedPlanId(id);
  }

  function handleSubscribe(plan: Plan, cycle: BillingCycle) {
    // open confirm dialog (parent-level) with plan info
    console.log(cycle);
    setOpenConfirmPlan(plan);
    // In a full app you'd set dialog open state; here we store plan and render dialog
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Subscription Plans</h1>
          <p className="text-sm text-slate-500">Choose a plan that fits your needs — from individual players to large organizers.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/5 p-1 inline-flex">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${cycle === "monthly" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
              aria-pressed={cycle === "monthly"}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${cycle === "annual" ? "bg-white text-[#0f172a]" : "text-white/80 hover:bg-white/5"}`}
              aria-pressed={cycle === "annual"}
            >
              Annual (15% off)
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plansWithPrices.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            selected={plan.id === selectedPlanId}
            onSelect={handleSelectPlan}
            onSubscribe={(p) => handleSubscribe(p, cycle)}
          />
        ))}
      </section>

      <section className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg text-[#0f172a]">Plan comparison</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2">Feature</th>
                    {PLANS.map((p) => (
                      <th key={p.id} className="px-4 py-2">{p.name}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">Tournament registrations per event</td>
                    {PLANS.map((p) => (
                      <td key={p.id} className="px-4 py-3">{p.tournamentCap}</td>
                    ))}
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Training registrations per session</td>
                    {PLANS.map((p) => (
                      <td key={p.id} className="px-4 py-3">{p.trainingCap}</td>
                    ))}
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Organizer tools</td>
                    {PLANS.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-center">{p.id === "player" ? "—" : <Check className="inline-block w-4 h-4 text-[#7c3aed]" />}</td>
                    ))}
                  </tr>

                  <tr className="border-t">
                    <td className="px-4 py-3">Priority support</td>
                    {PLANS.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-center">{(p.id === "advanced" || p.id === "pro") ? <Check className="inline-block w-4 h-4 text-[#7c3aed]" /> : "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Confirm subscription dialog (simple, parent-level) */}
      <Dialog open={!!openConfirmPlan} onOpenChange={() => setOpenConfirmPlan(null)}>
        <DialogContent className="sm:max-w-lg bg-white text-[#0f172a] rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle>Confirm subscription</DialogTitle>
            <DialogDescription>
              You are subscribing to the <strong>{openConfirmPlan?.name}</strong> plan.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-600">This demo dialog is a placeholder — wire this to your payment provider (Stripe, Paddle, etc.).</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setOpenConfirmPlan(null)}>Cancel</Button>
              <Button onClick={() => {
                setOpenConfirmPlan(null);
                alert(`Subscribed to ${openConfirmPlan?.name}. Implement payment flow here.`);
              }}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
