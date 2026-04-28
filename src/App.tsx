import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { AddPage } from "./pages/AddPage";
import { ReviewRoot } from "./pages/review/ReviewRoot";
import { ReviewHubPage } from "./pages/review/ReviewHubPage";
import { RecallReviewPage } from "./pages/review/RecallReviewPage";
import { DiscernReviewPage } from "./pages/review/DiscernReviewPage";
import { RapidReviewPage } from "./pages/review/RapidReviewPage";
import { FeynmanReviewPage } from "./pages/review/FeynmanReviewPage";
import { ReviewSummaryPage } from "./pages/review/ReviewSummaryPage";
import { SearchPage } from "./pages/SearchPage";
import { ItemPage } from "./pages/ItemPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/review" element={<ReviewRoot />}>
            <Route index element={<ReviewHubPage />} />
            <Route path="recall" element={<RecallReviewPage />} />
            <Route path="discern" element={<DiscernReviewPage />} />
            <Route path="rapid" element={<RapidReviewPage />} />
            <Route path="feynman" element={<FeynmanReviewPage />} />
            <Route path="summary" element={<ReviewSummaryPage />} />
          </Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
