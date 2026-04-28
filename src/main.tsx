import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { queryClient } from "./lib/queryClient.ts";
import { PreferencesProvider } from "./contexts/PreferencesContext.tsx";

const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");
if (redirect) {
  window.history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </QueryClientProvider>
);
