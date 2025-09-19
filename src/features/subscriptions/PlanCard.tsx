"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";

export type Plan = {
  id: "player" | "intermediate" | "advanced" | "pro";
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  description: string;
  tournamentCap: string;
  trainingCap: string;
  features: string[];
  popular?: boolean;
};

type Props = {
  plan: Plan;
  cycle: "monthly" | "annual";
  selected: boolean;
  onSelect: (id: Plan["id"]) => void;
  onSubscribe?: (plan: Plan, cycle: "monthly" | "annual") => void;
};

export default function PlanCard({ plan, cycle, selected, onSelect, onSubscribe }: Props) {
  const price =
    cycle === "monthly"
      ? plan.monthlyPrice
      : plan.annualPrice ?? Math.round((plan.monthlyPrice ?? 0) * 12 * 0.85);

  const priceLabel =
    cycle === "monthly"
      ? price === 0
        ? "Free"
        : `$${price}/mo`
      : price === 0
        ? "Free"
        : `$${price}/yr`;

  return (
    <Card
      key={plan.id}
      className={`p-0 border-0 shadow-lg ${selected ? "ring-2 ring-[#7c3aed]/40" : ""
        }`}
    >
      <CardHeader className="px-6 py-4 bg-gradient-to-r from-[#ffffff05] to-[#ffffff02]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
              {plan.name}
              {plan.popular && (
                <Badge className="bg-[#7c3aed] text-white">Popular</Badge>
              )}
            </CardTitle>
            <p className="text-xs text-slate-500">{plan.description}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-[#0f172a]">{priceLabel}</div>
            <div className="text-xs text-slate-500">
              {cycle === "monthly" ? "Billed monthly" : "Billed annually"}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ul className="space-y-2 mb-4">
          <li className="text-sm text-slate-700">
            <strong>Tournament registrations:</strong> {plan.tournamentCap}
          </li>
          <li className="text-sm text-slate-700">
            <strong>Training registrations:</strong> {plan.trainingCap}
          </li>
        </ul>

        <div className="mb-3">
          <div className="text-sm font-medium text-slate-600 mb-2">Includes</div>
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <Check className="w-4 h-4 text-[#7c3aed]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant={selected ? "default" : "outline"}
            onClick={() => onSelect(plan.id)}
            className="flex-1"
          >
            {selected ? "Selected" : "Select"}
          </Button>

          <Dialog open={false} onOpenChange={() => { }}>
            <DialogTrigger asChild>
              <Button
                className="ml-2"
                onClick={() => {
                  if (
                    plan.monthlyPrice === 0 &&
                    (cycle === "monthly"
                      ? plan.monthlyPrice === 0
                      : plan.annualPrice === 0)
                  ) {
                    onSubscribe?.(plan, cycle);
                  } else {
                    onSubscribe?.(plan, cycle);
                  }
                }}
              >
                Subscribe
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
