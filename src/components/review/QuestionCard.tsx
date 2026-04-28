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
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 px-6 py-8">
        <div className="text-[22px] leading-snug font-semibold text-[#1D2129] dark:text-slate-100 text-center whitespace-pre-wrap">
          {prompt}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

