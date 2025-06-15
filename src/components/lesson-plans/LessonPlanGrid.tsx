
import { LessonPlan, OrganizationLessonPlan } from "@/types/lessonPlan";
import { LessonPlanCard } from "./LessonPlanCard";

interface LessonPlanGridProps {
  lessonPlans: (LessonPlan | OrganizationLessonPlan)[];
  onPreview: (lessonPlan: LessonPlan | OrganizationLessonPlan) => void;
  onDelete: (lessonPlan: LessonPlan | OrganizationLessonPlan) => void;
}

export const LessonPlanGrid = ({ lessonPlans, onPreview, onDelete }: LessonPlanGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessonPlans.map((plan) => (
        <LessonPlanCard
          key={plan.id}
          lessonPlan={plan}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
