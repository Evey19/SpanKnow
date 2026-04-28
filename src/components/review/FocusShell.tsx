import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function FocusShell({
  title,
  progress,
  subtitle,
  onExit,
  children,
  bottom,
  action,
}: {
  title: string;
  progress?: string;
  subtitle?: string;
  onExit: () => void;
  children: ReactNode;
  bottom?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="退出"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
            {subtitle && <p className="text-[11px] font-medium text-slate-500 truncate max-w-[150px] sm:max-w-[250px]">{subtitle}</p>}
          </div>
        </div>
        {progress && (
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-slate-500 tracking-wider">
              {progress}
            </div>
            <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, parseInt(progress) * 10))}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col min-h-0 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>

      {bottom && (
        <div className="p-4 md:px-8 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {bottom}
        </div>
      )}
      {action && (
        <div className="p-4 md:px-8 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto w-full">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}

