import { Outlet } from "react-router-dom";
import { ReviewSessionProvider } from "@/features/reviewModes/sessionStore";

export function ReviewRoot() {
  return (
    <ReviewSessionProvider>
      <Outlet />
    </ReviewSessionProvider>
  );
}

