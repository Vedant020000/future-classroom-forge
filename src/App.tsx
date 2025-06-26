
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthRoute } from "@/components/auth/AuthRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LessonPlanPage } from "./pages/LessonPlanPage";
import { CreateLessonPlanPage } from "./pages/CreateLessonPlanPage";
import { LessonPlanWhiteboardPage } from "./pages/LessonPlanWhiteboardPage";
import { StudentsPage } from "./pages/StudentsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="lesson-plans" element={<LessonPlanPage />} />
              <Route path="create-lesson-plan" element={<CreateLessonPlanPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            {/* Whiteboard routes - full screen without sidebar */}
            <Route path="/lesson-plan/:id/edit" element={
              <ProtectedRoute>
                <LessonPlanWhiteboardPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
