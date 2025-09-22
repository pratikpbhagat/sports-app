import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";

type Props = {
  id: string;
  title: string;
  date: string;
  coach?: string;
  location?: string;
  status?: string | null;
  feedback?: string | null;
  rating?: number | null;
  attendeesCount?: number | null;
  role?: "player" | "coach";
  onView?: (id: string) => void;
};

export default function TrainingHistoryCard({
  id,
  title,
  date,
  coach,
  location,
  status,
  feedback,
  rating,
  attendeesCount,
  role = "player",
  onView,
}: Props) {
  return (
    <article className="p-4 rounded-lg bg-white hover:shadow-md transition flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[#0f172a]">{title}</h3>
        <p className="text-xs text-slate-500">
          {formatDate(date)}{location ? ` • ${location}` : ""}{coach && role === "player" ? ` • Coach: ${coach}` : ""}
        </p>

        {role === "player" && (
          <>
            {status && <div className="mt-2 text-xs text-slate-500">Status: <span className="font-medium text-[#0f172a]">{status}</span></div>}
            {feedback && (
              <div className="mt-2 text-xs">
                <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] mr-2">Coach feedback</Badge>
                <span className="text-xs text-slate-600">{feedback}</span>
              </div>
            )}
            {rating != null && <div className="mt-2 text-xs text-slate-500">Rating: <span className="font-medium">{rating}/5</span></div>}
          </>
        )}

        {role === "coach" && (
          <>
            <div className="mt-2 text-xs text-slate-500">Attendees: <span className="font-medium text-[#0f172a]">{attendeesCount ?? "—"}</span></div>
          </>
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
