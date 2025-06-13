
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LessonPlanPage } from "./pages/LessonPlanPage";
import { CreateLessonPlanPage } from "./pages/CreateLessonPlanPage";
import { VirtualClassroomPage } from "./pages/VirtualClassroomPage";
import { StudentsPage } from "./pages/StudentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="lesson-plans" element={<LessonPlanPage />} />
            <Route path="create-lesson-plan" element={<CreateLessonPlanPage />} />
            <Route path="virtual-classroom" element={<VirtualClassroomPage />} />
            <Route path="students" element={<StudentsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
