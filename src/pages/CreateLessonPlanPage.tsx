import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  BookOpen, 
  Users, 
  Clock, 
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Loader2,
  Download,
  Monitor,
  Brain,
  Sparkles,
  Upload,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLessonPlans } from "@/hooks/useLessonPlans";
import { PDFUploadDialog } from "@/components/pdf-knowledge/PDFUploadDialog";

interface Question {
  id: number;
  question: string;
  category: string;
  importance: string;
  answer?: string;
}

export const CreateLessonPlanPage = () => {
  const [step, setStep] = useState(1);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generatedLessonPlan, setGeneratedLessonPlan] = useState<string>("");
  const [researchReferences, setResearchReferences] = useState<any[]>([]);
  const [lessonPlanId, setLessonPlanId] = useState<string>("");
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uploadLessonPlan } = useLessonPlans();
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    duration: "",
    objectives: "",
    outline: "",
    studentNeeds: "",
  });

  const steps = [
    { number: 1, title: "Lesson Information", icon: BookOpen },
    { number: 2, title: "AI Questions", icon: HelpCircle },
    { number: 3, title: "RAG-Enhanced Generation", icon: Brain },
    { number: 4, title: "Review & Save", icon: CheckCircle },
  ];

  const subjects = [
    "Mathematics", "Science", "English", "History", "Geography", 
    "Art", "Music", "Physical Education", "Computer Science", "Other"
  ];

  const grades = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12"
  ];

  const durations = ["30 min", "45 min", "60 min", "90 min", "120 min"];

  const handleNext = async () => {
    if (step === 1) {
      // Validate required fields
      if (!formData.title || !formData.subject || !formData.grade || !formData.duration) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        });
        return;
      }
      
      // Generate AI questions
      setIsGeneratingQuestions(true);
      try {
        const { data, error } = await supabase.functions.invoke('generate-lesson-questions', {
          body: { lessonData: formData }
        });

        if (error) throw error;

        if (data?.questions) {
          setQuestions(data.questions.map((q: any) => ({ ...q, answer: "" })));
        }
      } catch (error: any) {
        console.error('Error generating questions:', error);
        toast({
          title: "Error",
          description: "Failed to generate AI questions. Using default questions.",
          variant: "destructive",
        });
        // Use fallback questions
        setQuestions([
          { id: 1, question: "What specific classroom resources do you have available?", category: "Resources", importance: "high", answer: "" },
          { id: 2, question: "How would you like to assess student understanding?", category: "Assessment", importance: "high", answer: "" },
          { id: 3, question: "What prior knowledge should students have?", category: "Prerequisites", importance: "medium", answer: "" },
          { id: 4, question: "How can this lesson connect to real-world applications?", category: "Relevance", importance: "medium", answer: "" },
          { id: 5, question: "What interactive activities would engage your students?", category: "Engagement", importance: "high", answer: "" },
        ]);
      } finally {
        setIsGeneratingQuestions(false);
      }
    }
    
    if (step === 2) {
      // Generate lesson plan using AI with RAG enhancement
      setIsGeneratingPlan(true);
      try {
        const { data, error } = await supabase.functions.invoke('generate-lesson-plan', {
          body: { 
            lessonData: formData,
            aiQuestions: questions.filter(q => q.answer?.trim())
          }
        });

        if (error) throw error;

        if (data?.lessonPlan) {
          setGeneratedLessonPlan(data.lessonPlan);
          if (data?.researchReferences) {
            setResearchReferences(data.researchReferences);
          }
        }
      } catch (error: any) {
        console.error('Error generating lesson plan:', error);
        // Create a fallback lesson plan
        const fallbackPlan = `# ${formData.title}

## Subject: ${formData.subject}
## Grade Level: ${formData.grade}
## Duration: ${formData.duration}

## Learning Objectives
${formData.objectives || "Students will understand the key concepts of this lesson."}

## Lesson Overview
${formData.outline || "This lesson introduces students to the core topic through engaging activities and discussions."}

## Materials Needed
- Whiteboard/markers
- Student worksheets
- Interactive materials

## Lesson Structure

### Introduction (10 minutes)
- Welcome students and review previous lesson
- Introduce today's topic and objectives

### Main Activity (${parseInt(formData.duration.replace(' min', '')) - 20} minutes)
- Interactive demonstration
- Guided practice
- Student activities

### Conclusion (10 minutes)
- Review key concepts
- Preview next lesson
- Assessment check

## Assessment
- Formative assessment through questioning
- Observation of student participation
- Exit ticket or quick quiz

## Homework/Extension
- Practice exercises
- Additional reading/research

## Notes
${formData.studentNeeds || "Consider individual student needs and adapt as necessary."}

---
Generated with AI assistance based on your inputs and teaching preferences.`;
        
        setGeneratedLessonPlan(fallbackPlan);
        
        toast({
          title: "Lesson Plan Generated",
          description: "Created using fallback template. You can edit it in the next step.",
        });
      } finally {
        setIsGeneratingPlan(false);
      }
    }
    
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleQuestionAnswer = (questionId: number, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ));
  };

  const handleSaveLessonPlan = async () => {
    try {
      // Create a comprehensive lesson plan object
      const lessonPlanData = {
        ...formData,
        aiQuestions: questions.filter(q => q.answer?.trim()),
        generatedPlan: generatedLessonPlan,
        researchReferences,
        generatedAt: new Date().toISOString(),
      };

      // Create a blob with the lesson plan content
      const lessonPlanContent = `${generatedLessonPlan}\n\n---\n\nAI Questions & Answers:\n${
        questions.filter(q => q.answer?.trim()).map(q => 
          `Q: ${q.question}\nA: ${q.answer}\n`
        ).join('\n')
      }\n\n---\n\nResearch References:\n${
        researchReferences.map(ref => `- ${ref.topic} (${ref.source})`).join('\n')
      }`;
      
      const blob = new Blob([lessonPlanContent], { type: 'text/markdown' });
      const file = new File([blob], `${formData.title.replace(/\s+/g, '_')}_lesson_plan.md`, {
        type: 'text/markdown'
      });

      // Upload to database using the existing hook
      const result = await uploadLessonPlan.mutateAsync({
        file,
        title: formData.title,
        subject: formData.subject,
        grade_level: formData.grade,
        description: formData.objectives || "RAG-enhanced AI-generated lesson plan",
        duration: parseInt(formData.duration.replace(' min', '')) || undefined,
      });

      setLessonPlanId(result.id);

      toast({
        title: "Success!",
        description: "Your research-backed lesson plan has been generated and saved to your library.",
      });

    } catch (error: any) {
      console.error('Error saving lesson plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save lesson plan",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const lessonPlanContent = `${generatedLessonPlan}\n\n---\n\nAI Questions & Answers:\n${
      questions.filter(q => q.answer?.trim()).map(q => 
        `Q: ${q.question}\nA: ${q.answer}\n`
      ).join('\n')
    }\n\n---\n\nResearch References:\n${
      researchReferences.map(ref => `- ${ref.topic} (${ref.source})`).join('\n')
    }`;
    
    const blob = new Blob([lessonPlanContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '_')}_lesson_plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your research-backed lesson plan has been downloaded to your device.",
    });
  };

  const handleSendToClassroom = () => {
    // Store lesson plan data in localStorage for the virtual classroom
    localStorage.setItem('currentLessonPlan', JSON.stringify({
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade,
      duration: formData.duration,
      content: generatedLessonPlan,
      id: lessonPlanId
    }));
    
    navigate('/virtual-classroom');
  };

  const progress = (step / 4) * 100;

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Create Research-Backed Lesson Plan
            </h1>
            <p className="text-muted-foreground mt-2">
              Let AI create highly constructive lesson plans using educational research and best practices
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-600 font-medium">Enhanced with PDF-based Research (RAG)</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowPDFUpload(true)}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Research PDFs
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Step {step} of 4</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between">
          {steps.map((s) => (
            <div key={s.number} className={`flex items-center gap-2 ${
              step >= s.number ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step >= s.number 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border'
              }`}>
                {step > s.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 bg-card border-border">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Lesson Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Photosynthesis"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level *</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Learning Objectives</Label>
                <Textarea
                  id="objectives"
                  placeholder="What should students learn from this lesson?"
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  className="bg-secondary border-border min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outline">Content Outline</Label>
                <Textarea
                  id="outline"
                  placeholder="Provide a basic outline of the lesson content and flow..."
                  value={formData.outline}
                  onChange={(e) => setFormData({...formData, outline: e.target.value})}
                  className="bg-secondary border-border min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentNeeds">Student Considerations</Label>
                <Textarea
                  id="studentNeeds"
                  placeholder="Any specific student needs, learning styles, or accommodations..."
                  value={formData.studentNeeds}
                  onChange={(e) => setFormData({...formData, studentNeeds: e.target.value})}
                  className="bg-secondary border-border min-h-24"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">AI-Generated Questions</h2>
            </div>
            
            {isGeneratingQuestions ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">AI is generating personalized questions for your lesson...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Answer these AI-generated questions to help create a more personalized and effective lesson plan.
                </p>
                
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-4 border border-border rounded-lg bg-secondary/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary">Question {index + 1}</span>
                            <Badge variant="outline" className={getImportanceColor(question.importance)}>
                              {question.importance}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-3">{question.question}</p>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Your answer..."
                        value={question.answer || ""}
                        onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                        className="bg-background border-border"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">PDF Research-Enhanced Generation</h2>
            </div>
            
            {isGeneratingPlan ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
                    <Sparkles className="h-6 w-6 absolute -top-1 -right-1 text-yellow-500 animate-bounce" />
                  </div>
                  <p className="text-muted-foreground">AI is searching your uploaded PDFs and creating a research-backed lesson plan...</p>
                  <p className="text-sm text-muted-foreground">Incorporating educational research from your knowledge base</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-purple-800">Ready to Generate Your PDF Research-Enhanced Lesson Plan</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-white/80">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {formData.subject} - {formData.grade}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80">
                        <Clock className="h-3 w-3 mr-1" />
                        {formData.duration}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-white/80">
                        <Users className="h-3 w-3 mr-1" />
                        {questions.filter(q => q.answer?.trim()).length} of {questions.length} questions answered
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80">
                        <Brain className="h-3 w-3 mr-1" />
                        RAG-Enhanced with Research
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-purple-800 mb-2">PDF Research Integration:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Search through your uploaded educational PDFs</li>
                      <li>• Extract relevant research findings and methodologies</li>
                      <li>• Apply evidence-based teaching strategies</li>
                      <li>• Reference specific research sources in the lesson plan</li>
                      <li>• Customize approaches based on your knowledge base</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm text-purple-700">
                    Our AI will analyze your lesson information, teacher responses, and uploaded research PDFs to create a 
                    comprehensive, evidence-based lesson plan with direct citations from your knowledge base.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Your PDF Research-Enhanced Lesson Plan is Ready!</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-green-800">
                  🎉 PDF Research-Enhanced Lesson Plan Generated Successfully!
                </h3>
                <p className="text-green-700 mb-6">
                  Your personalized lesson plan for "{formData.title}" has been created using AI and your uploaded 
                  educational research PDFs, incorporating evidence-based teaching strategies and best practices.
                </p>

                {researchReferences.length > 0 && (
                  <div className="bg-white/60 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">PDF Research Sources Used:</h4>
                    <div className="space-y-2">
                      {researchReferences.map((ref, index) => (
                        <div key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <FileText className="h-3 w-3 mt-1" />
                          <div>
                            <span className="font-medium">{ref.source}</span>
                            <span className="text-green-600"> (Relevance: {ref.relevanceScore})</span>
                            <br />
                            <span className="text-xs">{ref.topic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Button 
                    onClick={handleSaveLessonPlan}
                    className="bg-primary hover:bg-primary/90"
                    disabled={!!lessonPlanId}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {lessonPlanId ? 'Saved to Library' : 'Save to Library'}
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Plan
                  </Button>
                </div>
                
                {lessonPlanId && (
                  <div className="space-y-4">
                    <div className="border-t border-green-200 pt-4">
                      <h4 className="font-medium text-green-800 mb-3">What would you like to do next?</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={handleSendToClassroom}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Monitor className="h-4 w-4 mr-2" />
                          Use in Virtual Classroom
                        </Button>
                        <Button 
                          onClick={() => navigate('/lesson-plans')}
                          variant="outline"
                          className="border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View All Lesson Plans
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {generatedLessonPlan && (
                <div className="space-y-4">
                  <h3 className="font-medium">Preview:</h3>
                  <div className="bg-secondary/50 border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedLessonPlan.substring(0, 500)}...
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={step === 1}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {step < 3 && (
            <Button 
              onClick={handleNext}
              disabled={(step === 1 && isGeneratingQuestions) || (step === 2 && isGeneratingPlan)}
              className="bg-primary hover:bg-primary/90"
            >
              {(step === 1 && isGeneratingQuestions) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (step === 2 && isGeneratingPlan) ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Research-Backed Plan...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
          {step === 3 && !isGeneratingPlan && (
            <Button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90"
            >
              View Results
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* PDF Upload Dialog */}
      <PDFUploadDialog 
        open={showPDFUpload} 
        onOpenChange={setShowPDFUpload}
        onUploadComplete={() => {
          toast({
            title: "Knowledge Base Updated",
            description: "Your research PDFs will now be used to enhance lesson plan generation.",
          });
        }}
      />
    </div>
  );
};
