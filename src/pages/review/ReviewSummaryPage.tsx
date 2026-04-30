import { useNavigate } from "react-router-dom";
import { FocusShell } from "@/components/review/FocusShell";
import { useReviewSession } from "@/features/reviewModes/sessionStore";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw, Sparkles, Clock3, Target, ListChecks } from "lucide-react";
import { useEffect } from "react";

function percent(n: number) {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n * 100)}%`;
}

function formatDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m${r}s`;
}

export function ReviewSummaryPage() {
  const { summary, reset, snapshot } = useReviewSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!summary && !snapshot.startedAt) {
      // 没数据直接跳回首页或 Hub
      navigate("/review", { replace: true });
    }
  }, [summary, snapshot, navigate]);

  if (!summary) {
    return (
      <FocusShell title="复习简报" onExit={() => navigate("/review")}>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          生成中...
        </div>
      </FocusShell>
    );
  }

  const accuracyText = summary.accuracy === undefined ? "-" : percent(summary.accuracy);
  const masteryText = percent(summary.mastery_rate);
  const durationText = formatDuration(summary.duration_ms);
  const ringValue = Math.max(0, Math.min(100, Math.round(summary.mastery_rate * 100)));

  const breakdownEntries = Object.entries(summary.breakdown || {})
    .filter(([, v]) => typeof v === "number" && v > 0)
    .sort((a, b) => b[1] - a[1]);

  const breakdownLabel: Record<string, string> = {
    mastered: "掌握",
    blurry: "模糊",
    forgot: "忘记",
    know: "会",
    dont_know: "不会",
    timeout: "超时",
    correct: "正确",
    wrong: "错误",
  };

  const breakdownColor: Record<string, string> = {
    mastered: "bg-[color:var(--chart-3)]",
    know: "bg-[color:var(--chart-3)]",
    correct: "bg-[color:var(--chart-3)]",
    blurry: "bg-[color:var(--chart-4)]",
    timeout: "bg-[color:var(--chart-4)]",
    forgot: "bg-destructive",
    dont_know: "bg-destructive",
    wrong: "bg-destructive",
  };

  const totalBreakdown = breakdownEntries.reduce((acc, [, v]) => acc + v, 0);

  return (
    <FocusShell title="复习简报" onExit={() => navigate("/")}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.35)] backdrop-blur px-6 py-6">
            <div className="absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(circle_at_center,var(--chart-1),transparent_60%)] opacity-20" />
            <div className="absolute -bottom-24 -left-24 size-56 rounded-full bg-[radial-gradient(circle_at_center,var(--chart-3),transparent_60%)] opacity-15" />

            <div className="relative flex items-start gap-4">
              <div
                className="shrink-0 grid place-items-center size-[92px] rounded-2xl bg-background/80 border border-border/60 shadow-sm"
                style={{
                  background: `conic-gradient(var(--primary) ${ringValue}%, color-mix(in oklab, var(--muted-foreground), transparent 78%) 0)`,
                }}
              >
                <div className="grid place-items-center size-[76px] rounded-2xl bg-background border border-border/60">
                  <div className="text-center leading-tight">
                    <div className="text-[11px] text-muted-foreground">掌握率</div>
                    <div className="mt-0.5 text-xl font-semibold text-foreground">{masteryText}</div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  本次复习完成
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  {summary.total_answered} 道题
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  保持节奏，比昨天更好一点点
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="size-4 text-primary" />
                  正确率
                </div>
                <div className="mt-1 text-lg font-semibold text-foreground">{accuracyText}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-4 text-primary" />
                  用时
                </div>
                <div className="mt-1 text-lg font-semibold text-foreground">{durationText}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ListChecks className="size-4 text-primary" />
                  进度
                </div>
                <div className="mt-1 text-lg font-semibold text-foreground">{snapshot.totalAnswered}</div>
              </div>
            </div>

            {breakdownEntries.length > 0 && (
              <div className="relative mt-6 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">结果分布</div>
                  <div className="text-xs text-muted-foreground">共 {totalBreakdown}</div>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full flex">
                    {breakdownEntries.map(([k, v]) => (
                      <div
                        key={k}
                        className={breakdownColor[k] || "bg-muted-foreground"}
                        style={{ width: `${Math.max(0, (v / Math.max(1, totalBreakdown)) * 100)}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {breakdownEntries.slice(0, 8).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-foreground"
                    >
                      <span className={`size-2 rounded-full ${breakdownColor[k] || "bg-muted-foreground"}`} />
                      <span>{breakdownLabel[k] || k}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary.weak_points && summary.weak_points.length > 0 && (
              <div className="relative mt-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
                <div className="text-sm font-medium text-foreground">建议优先复习</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {summary.weak_points.slice(0, 8).map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              className="h-11 rounded-2xl bg-card/80 text-foreground border-border hover:bg-muted"
              variant="outline"
              onClick={() => {
                reset();
                navigate("/review", { replace: true });
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              继续复习
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                reset();
                navigate("/", { replace: true });
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </div>
        </div>
      </div>
    </FocusShell>
  );
}
