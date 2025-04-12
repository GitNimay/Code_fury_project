// App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import CandidateProfile from "./pages/Candidate/CandidateProfile"; // <-- Import this
import HRDashboard from "./pages/HR/HRDashboard";
import FeedbackCandidate from "./pages/Interview/Feedback";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import InterviewStart from "./pages/Interview/InterviewStart";
import LiveInterview from "./pages/Interview/LiveInterview";
import InterviewReview from "./pages/HR/InterviewReview";
import PastInterview from "./pages/Candidate/PastInterview";
import SystemCheck from "./pages/Candidate/SystemCheck";
import Setting from "./pages/Candidate/setting";
import InterviewFeedback from "./pages/Interview/Feedback";
import ManageCandidates from "./pages/HR/ManageCandidates";
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<HRDashboard />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate Dashboard */}
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

              {/* Candidate Profile (add this route) */}
               <Route path="/candidate/profile" element={<CandidateProfile />} />
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="/candidate/feedback" element={<InterviewFeedback />} />
                <Route path="/candidate/past-interview" element={<PastInterview />} />
                <Route path="/candidate/setting" element={<Setting />} />
                <Route path="/candidate/system-check" element={<SystemCheck />} />

              {/* Interview Routes */}
              <Route path="/interview/start" element={<InterviewStart />} />
              <Route path="/interview/live" element={<LiveInterview />} />
              <Route path="/interview/complete" element={<FeedbackCandidate />} />

              {/* HR Routes */}
              <Route path="/hr/review" element={<InterviewReview />} />
              <Route path="/hr/review" element={<InterviewReview />} />
              <Route path="/HR/ManageCandidates" element={<ManageCandidates />} />

              {/* Fallback: redirect to feedback or 404 */}
              <Route path="*" element={<FeedbackCandidate />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
