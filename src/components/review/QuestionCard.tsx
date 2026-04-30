import type { ReactNode } from "react";

export function QuestionCard({
  prompt,
  children,
}: {
  prompt: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-xl bg-card rounded-2xl shadow-sm border border-border px-6 py-8">
        <div className="text-[22px] leading-snug font-semibold text-foreground text-center whitespace-pre-wrap">
          {prompt}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
