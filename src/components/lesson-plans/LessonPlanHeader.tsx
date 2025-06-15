
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { UploadLessonPlanDialog } from "./UploadLessonPlanDialog";

export const LessonPlanHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Lesson Plans
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and organize your lesson plans
        </p>
      </div>
      <div className="flex gap-2">
        <UploadLessonPlanDialog>
          <Button variant="outline" className="border-border">
            <Upload className="h-4 w-4 mr-2" />
            Upload Plan
          </Button>
        </UploadLessonPlanDialog>
        <Link to="/create-lesson-plan">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </Link>
      </div>
    </div>
  );
};
