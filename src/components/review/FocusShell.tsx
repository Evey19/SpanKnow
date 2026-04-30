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
    <div className="min-h-screen bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted active:scale-95 transition-all"
            aria-label="退出"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-[11px] font-medium text-muted-foreground truncate max-w-[150px] sm:max-w-[250px]">{subtitle}</p>}
          </div>
        </div>
        {progress && (
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-muted-foreground tracking-wider">
              {progress}
            </div>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-muted-foreground rounded-full transition-all duration-300"
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
        <div className="p-4 md:px-8 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-background/50 backdrop-blur-sm border-t border-border">
          <div className="max-w-4xl mx-auto w-full">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}
