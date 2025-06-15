
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadLessonPlanDialog } from "./UploadLessonPlanDialog";

interface LessonPlanEmptyStateProps {
  searchTerm: string;
}

export const LessonPlanEmptyState = ({ searchTerm }: LessonPlanEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">No lesson plans found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? "Try adjusting your search terms" : "Upload your first lesson plan to get started"}
      </p>
      {!searchTerm && (
        <UploadLessonPlanDialog>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Lesson Plan
          </Button>
        </UploadLessonPlanDialog>
      )}
    </div>
  );
};
