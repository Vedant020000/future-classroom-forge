
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
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLessonPlans } from "@/hooks/useLessonPlans";

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
    { number: 3, title: "Generate Plan", icon: Wand2 },
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
    
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleQuestionAnswer = (questionId: number, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ));
  };

  const handleGenerateLessonPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      // Prepare lesson plan data with AI responses
      const answeredQuestions = questions.filter(q => q.answer?.trim());
      const lessonPlanData = {
        ...formData,
        aiQuestions: answeredQuestions,
        generatedAt: new Date().toISOString(),
      };

      // Create a blob with the lesson plan data as JSON
      const lessonPlanContent = JSON.stringify(lessonPlanData, null, 2);
      const blob = new Blob([lessonPlanContent], { type: 'application/json' });
      const file = new File([blob], `${formData.title.replace(/\s+/g, '_')}_lesson_plan.json`, {
        type: 'application/json'
      });

      // Upload to database using the existing hook
      await uploadLessonPlan.mutateAsync({
        file,
        title: formData.title,
        subject: formData.subject,
        grade_level: formData.grade,
        description: formData.objectives || "AI-generated lesson plan",
        duration: parseInt(formData.duration.replace(' min', '')) || undefined,
      });

      toast({
        title: "Success!",
        description: "Your lesson plan has been created and saved.",
      });

      // Navigate to lesson plans page
      navigate('/lesson-plans');

    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate lesson plan",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const progress = (step / 3) * 100;

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Create Lesson Plan
        </h1>
        <p className="text-muted-foreground mt-2">
          Let AI help you create engaging and effective lesson plans
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Step {step} of 3</span>
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
              <Wand2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Generate Your Lesson Plan</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Ready to Create Your Personalized Lesson Plan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-secondary">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {formData.subject} - {formData.grade}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {formData.duration}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {questions.filter(q => q.answer?.trim()).length} of {questions.length} questions answered
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Our AI will analyze your lesson information and answers to create a comprehensive, 
                  personalized lesson plan that will be saved to your lesson plans library.
                </p>
                
                <Button 
                  onClick={handleGenerateLessonPlan}
                  disabled={isGeneratingPlan}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Lesson Plan...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate & Save Lesson Plan
                    </>
                  )}
                </Button>
              </div>
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
              disabled={step === 1 && isGeneratingQuestions}
              className="bg-primary hover:bg-primary/90"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
