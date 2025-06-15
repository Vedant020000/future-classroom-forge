
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";
import { LessonPlan, OrganizationLessonPlan } from "@/types/lessonPlan";
import { useLessonPlans } from "@/hooks/useLessonPlans";

interface PreviewLessonPlanDialogProps {
  lessonPlan: LessonPlan | OrganizationLessonPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewLessonPlanDialog = ({ lessonPlan, open, onOpenChange }: PreviewLessonPlanDialogProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getFileUrl } = useLessonPlans();

  useEffect(() => {
    if (lessonPlan?.file_path && open) {
      setLoading(true);
      getFileUrl(lessonPlan.file_path)
        .then(url => {
          setFileUrl(url || null);
        })
        .catch(error => {
          console.error('Error getting file URL:', error);
          setFileUrl(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setFileUrl(null);
    }
  }, [lessonPlan, open, getFileUrl]);

  if (!lessonPlan) return null;

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = lessonPlan.file_name || 'lesson-plan';
      link.click();
    }
  };

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {lessonPlan.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Subject:</span> {lessonPlan.subject}
            </div>
            <div>
              <span className="font-medium">Grade:</span> {lessonPlan.grade_level}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {lessonPlan.duration ? `${lessonPlan.duration} min` : 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                lessonPlan.status === 'active' ? 'bg-green-100 text-green-800' :
                lessonPlan.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                lessonPlan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lessonPlan.status}
              </span>
            </div>
          </div>

          {lessonPlan.description && (
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-sm text-muted-foreground">{lessonPlan.description}</p>
            </div>
          )}

          <div>
            <span className="font-medium">File:</span> {lessonPlan.file_name} 
            {lessonPlan.file_size && (
              <span className="text-sm text-muted-foreground ml-2">
                ({(lessonPlan.file_size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}

          {fileUrl && !loading && (
            <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-[400px]">
              {lessonPlan.file_type === 'pdf' ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-96"
                  title={lessonPlan.title}
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-center">
                  <div>
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Preview not available</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Preview is only available for PDF files. 
                      {lessonPlan.file_type === 'docx' || lessonPlan.file_type === 'doc' ? ' Word documents' : ' Excel files'} 
                      {' '}can be downloaded or opened in a new tab.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!fileUrl && !loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Unable to load file preview</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {fileUrl && (
              <>
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleOpenInNewTab} variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </>
            )}
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
