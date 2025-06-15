
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Calendar,
  Clock,
  Users,
  Upload,
  FileText,
  AlertCircle
} from "lucide-react";
import { useLessonPlans, LessonPlan } from "@/hooks/useLessonPlans";
import { useAuth } from "@/hooks/useAuth";
import { UploadLessonPlanDialog } from "@/components/lesson-plans/UploadLessonPlanDialog";
import { PreviewLessonPlanDialog } from "@/components/lesson-plans/PreviewLessonPlanDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const LessonPlanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewLessonPlan, setPreviewLessonPlan] = useState<LessonPlan | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { user } = useAuth();
  const { lessonPlans, isLoading, error, deleteLessonPlan } = useLessonPlans();

  console.log('LessonPlanPage - User:', user?.id);
  console.log('LessonPlanPage - Lesson plans:', lessonPlans);
  console.log('LessonPlanPage - Loading:', isLoading);
  console.log('LessonPlanPage - Error:', error);

  const filteredPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handlePreview = (lessonPlan: LessonPlan) => {
    setPreviewLessonPlan(lessonPlan);
    setPreviewOpen(true);
  };

  const handleDelete = (lessonPlan: LessonPlan) => {
    deleteLessonPlan.mutate(lessonPlan);
  };

  // Show error state
  if (error) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Lesson Plans
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your lesson plans
            </p>
          </div>
        </div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Lesson Plans
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your lesson plans
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show main content
  return (
    <div className="p-8 space-y-8">
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

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lesson plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" className="border-border">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="text-lg">{getFileIcon(plan.file_type)}</span>
                </div>
                <Badge className={getStatusColor(plan.status)}>
                  {plan.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-foreground">{plan.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {plan.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {plan.subject}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {plan.grade_level}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {plan.duration ? `${plan.duration} min` : 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(plan.created_at).toLocaleDateString()}
                </div>
              </div>

              {plan.file_name && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">File:</span> {plan.file_name}
                  {plan.file_size && (
                    <span className="ml-2">
                      ({(plan.file_size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-border hover:bg-secondary"
                  onClick={() => handlePreview(plan)}
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
                        Are you sure you want to delete "{plan.title}"? This action cannot be undone and will also delete the associated file.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(plan)}
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
        ))}
      </div>

      {filteredPlans.length === 0 && !isLoading && (
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
      )}

      <PreviewLessonPlanDialog
        lessonPlan={previewLessonPlan}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};
