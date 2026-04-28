import type { ReactNode } from "react";

export function BottomActionBar({ children }: { children: ReactNode }) {
  return <div className="w-full flex gap-3">{children}</div>;
}

