
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, Clock, Users, Calendar, Eye, Edit, Trash2, FileText } from "lucide-react";
import { LessonPlan, OrganizationLessonPlan } from "@/types/lessonPlan";

interface LessonPlanCardProps {
  lessonPlan: LessonPlan | OrganizationLessonPlan;
  onPreview: (lessonPlan: LessonPlan | OrganizationLessonPlan) => void;
  onDelete: (lessonPlan: LessonPlan | OrganizationLessonPlan) => void;
}

export const LessonPlanCard = ({ lessonPlan, onPreview, onDelete }: LessonPlanCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx':
      case 'doc': return '📝';
      case 'xlsx':
      case 'xls': return '📊';
      default: return '📄';
    }
  };

  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-lg">{getFileIcon(lessonPlan.file_type)}</span>
          </div>
          <Badge className={getStatusColor(lessonPlan.status)}>
            {lessonPlan.status}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg text-foreground">{lessonPlan.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {lessonPlan.description || 'No description provided'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            {lessonPlan.subject}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            {lessonPlan.grade_level}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lessonPlan.duration ? `${lessonPlan.duration} min` : 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(lessonPlan.created_at).toLocaleDateString()}
          </div>
        </div>

        {lessonPlan.file_name && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">File:</span> {lessonPlan.file_name}
            {lessonPlan.file_size && (
              <span className="ml-2">
                ({(lessonPlan.file_size / 1024 / 1024).toFixed(1)}MB)
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 border-border hover:bg-secondary"
            onClick={() => onPreview(lessonPlan)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" variant="outline" className="border-border hover:bg-secondary">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lesson Plan</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{lessonPlan.title}"? This action cannot be undone and will also delete the associated file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(lessonPlan)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};
