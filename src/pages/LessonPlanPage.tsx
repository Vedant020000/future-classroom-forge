
import { useState } from "react";
import { useLessonPlans } from "@/hooks/useLessonPlans";
import { useAuth } from "@/hooks/useAuth";
import { LessonPlan, OrganizationLessonPlan } from "@/types/lessonPlan";
import { PreviewLessonPlanDialog } from "@/components/lesson-plans/PreviewLessonPlanDialog";
import { LessonPlanHeader } from "@/components/lesson-plans/LessonPlanHeader";
import { LessonPlanSearch } from "@/components/lesson-plans/LessonPlanSearch";
import { LessonPlanGrid } from "@/components/lesson-plans/LessonPlanGrid";
import { LessonPlanEmptyState } from "@/components/lesson-plans/LessonPlanEmptyState";
import { AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LessonPlanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewLessonPlan, setPreviewLessonPlan] = useState<LessonPlan | OrganizationLessonPlan | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { user } = useAuth();
  const { lessonPlans, isLoading, error, deleteLessonPlan, isOrganizationUser } = useLessonPlans();

  console.log('LessonPlanPage - User:', user?.id);
  console.log('LessonPlanPage - Lesson plans:', lessonPlans);
  console.log('LessonPlanPage - Loading:', isLoading);
  console.log('LessonPlanPage - Error:', error);
  console.log('LessonPlanPage - Is organization user:', isOrganizationUser);

  const filteredPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (lessonPlan: LessonPlan | OrganizationLessonPlan) => {
    setPreviewLessonPlan(lessonPlan);
    setPreviewOpen(true);
  };

  const handleDelete = (lessonPlan: LessonPlan | OrganizationLessonPlan) => {
    deleteLessonPlan.mutate(lessonPlan);
  };

  // Show error state
  if (error) {
    return (
      <div className="p-8 space-y-8">
        <LessonPlanHeader />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Error loading lesson plans</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <LessonPlanHeader />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show main content
  return (
    <div className="p-8 space-y-8">
      <LessonPlanHeader />
      <LessonPlanSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      {filteredPlans.length > 0 ? (
        <LessonPlanGrid
          lessonPlans={filteredPlans}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      ) : (
        <LessonPlanEmptyState searchTerm={searchTerm} />
      )}

      <PreviewLessonPlanDialog
        lessonPlan={previewLessonPlan}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};
