
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
import { VirtualClassroomPage } from "./pages/VirtualClassroomPage";
import { VirtualClassroomGridPage } from "./pages/VirtualClassroomGridPage";
import { VirtualClassroomTheaterPage } from "./pages/VirtualClassroomTheaterPage";
import { VirtualClassroomWhiteboardPage } from "./pages/VirtualClassroomWhiteboardPage";
import { VirtualClassroomBreakoutPage } from "./pages/VirtualClassroomBreakoutPage";
import { VirtualClassroomAIPage } from "./pages/VirtualClassroomAIPage";
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
            <Route path="/virtual-classroom" element={
              <ProtectedRoute>
                <VirtualClassroomPage />
              </ProtectedRoute>
            } />
            <Route path="/virtual-classroom-grid" element={
              <ProtectedRoute>
                <VirtualClassroomGridPage />
              </ProtectedRoute>
            } />
            <Route path="/virtual-classroom-theater" element={
              <ProtectedRoute>
                <VirtualClassroomTheaterPage />
              </ProtectedRoute>
            } />
            <Route path="/virtual-classroom-whiteboard" element={
              <ProtectedRoute>
                <VirtualClassroomWhiteboardPage />
              </ProtectedRoute>
            } />
            <Route path="/virtual-classroom-breakout" element={
              <ProtectedRoute>
                <VirtualClassroomBreakoutPage />
              </ProtectedRoute>
            } />
            <Route path="/virtual-classroom-ai" element={
              <ProtectedRoute>
                <VirtualClassroomAIPage />
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
