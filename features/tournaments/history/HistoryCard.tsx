import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";

type Props = {
  id: string;
  title: string;
  date: string;
  location?: string;
  result?: string | null;
  score?: string | null;
  role?: "player" | "organizer";
  onView?: (id: string) => void;
};

export default function HistoryCard({ id, title, date, location, result, score, role = "player", onView }: Props) {
  return (
    <article className="p-4 rounded-lg bg-white hover:shadow-md transition flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[#0f172a]">{title}</h3>
        <p className="text-xs text-slate-500">
          {formatDate(date)}{location ? ` • ${location}` : ""}
        </p>

        {result && (
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-[#7c3aed]/10 text-[#7c3aed]">{result}</Badge>
            {score && <span className="text-xs text-slate-500">Score: {score}</span>}
          </div>
        )}

        {!result && role === "player" && (
          <div className="mt-2 text-xs text-slate-500">Registered</div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => onView?.(id)}
          className="text-sm px-3 py-1 rounded-md bg-[#7c3aed] text-white hover:opacity-95 transition"
        >
          View
        </button>
      </div>
    </article>
  );
}
