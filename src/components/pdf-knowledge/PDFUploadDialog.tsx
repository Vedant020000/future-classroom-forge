
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export const PDFUploadDialog = ({ open, onOpenChange, onUploadComplete }: PDFUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState({
    category: "general",
    subject: "all",
    gradeLevel: "all",
    description: ""
  });
  const { toast } = useToast();

  const subjects = [
    "all", "Mathematics", "Science", "English", "History", "Geography", 
    "Art", "Music", "Physical Education", "Computer Science"
  ];

  const grades = [
    "all", "elementary", "middle", "high", "Grade 1", "Grade 2", "Grade 3", 
    "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", 
    "Grade 10", "Grade 11", "Grade 12"
  ];

  const categories = [
    "general", "engagement", "assessment", "differentiation", "subject-specific", 
    "classroom-management", "technology", "inclusion", "social-emotional"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simple text extraction - in production you'd use a proper PDF parser
    // For now, we'll simulate extraction by reading file info
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        // This would be replaced with actual PDF text extraction
        resolve(`Educational content from ${file.name}. 

This represents extracted text content from the PDF document. In a production system, this would contain the actual parsed text from the PDF using libraries like PDF.js or similar.

Key educational concepts and strategies would be extracted here, including:
- Teaching methodologies and approaches
- Assessment techniques and rubrics  
- Classroom management strategies
- Subject-specific pedagogical content
- Learning theories and research findings
- Student engagement techniques
- Differentiation strategies
- Technology integration methods

The content would maintain its original structure and context to preserve the educational value and research citations contained within the document.`);
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Extract text from PDF
      toast({
        title: "Processing...",
        description: "Extracting text from PDF document...",
      });

      const pdfContent = await extractTextFromPDF(file);

      // Process the PDF content through the edge function
      const { data, error } = await supabase.functions.invoke('process-pdf-knowledge', {
        body: {
          pdfContent,
          filename: file.name,
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
            fileSize: file.size
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `PDF processed successfully. ${data.chunksProcessed} knowledge chunks added to enhance AI lesson generation.`,
      });

      // Reset form
      setFile(null);
      setMetadata({
        category: "general",
        subject: "all",
        gradeLevel: "all",
        description: ""
      });

      onOpenChange(false);
      onUploadComplete?.();

    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process PDF file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Educational PDF
          </DialogTitle>
          <DialogDescription>
            Add educational resources to enhance AI lesson plan generation with research-backed content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              {file && <FileText className="h-4 w-4 text-green-600" />}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={metadata.category} 
                onValueChange={(value) => setMetadata({...metadata, category: value})}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={metadata.subject} 
                onValueChange={(value) => setMetadata({...metadata, subject: value})}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level</Label>
            <Select 
              value={metadata.gradeLevel} 
              onValueChange={(value) => setMetadata({...metadata, gradeLevel: value})}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the PDF content and how it should be used..."
              value={metadata.description}
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              disabled={isProcessing}
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">How it works:</p>
                <p>Your PDF will be processed into knowledge chunks that the AI can reference when generating lesson plans, making them more research-backed and comprehensive.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Process
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
