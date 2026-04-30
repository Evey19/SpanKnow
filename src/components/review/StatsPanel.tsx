import type { ReviewSummary } from "@/features/reviewModes/contracts";

function percent(n: number) {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n * 100)}%`;
}

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m${r}s`;
}

export function StatsPanel({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs text-muted-foreground">刷题数量</div>
          <div className="mt-1 text-xl font-semibold text-foreground">
            {summary.total_answered}
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs text-muted-foreground">掌握率</div>
          <div className="mt-1 text-xl font-semibold text-foreground">
            {percent(summary.mastery_rate)}
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs text-muted-foreground">正确率</div>
          <div className="mt-1 text-xl font-semibold text-foreground">
            {summary.accuracy === undefined ? "-" : percent(summary.accuracy)}
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <div className="text-xs text-muted-foreground">用时</div>
          <div className="mt-1 text-xl font-semibold text-foreground">
            {formatDuration(summary.duration_ms)}
          </div>
        </div>
      </div>

      {summary.weak_points && summary.weak_points.length > 0 && (
        <div className="mt-5">
          <div className="text-sm font-medium text-foreground">薄弱点</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.weak_points.slice(0, 6).map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
