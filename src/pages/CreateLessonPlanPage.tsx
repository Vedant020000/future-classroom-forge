
import { useState } from "react";
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
  ArrowRight
} from "lucide-react";

export const CreateLessonPlanPage = () => {
  const [step, setStep] = useState(1);
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
    { number: 1, title: "Basic Information", icon: BookOpen },
    { number: 2, title: "Learning Objectives", icon: Target },
    { number: 3, title: "Content Outline", icon: Lightbulb },
    { number: 4, title: "AI Enhancement", icon: Wand2 },
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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / 4) * 100;

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
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Photosynthesis"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
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
                <Label htmlFor="grade">Grade Level</Label>
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
                <Label htmlFor="duration">Duration</Label>
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Learning Objectives</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">What should students learn?</Label>
                <Textarea
                  id="objectives"
                  placeholder="List the key learning objectives for this lesson..."
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  className="bg-secondary border-border min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentNeeds">Special Student Considerations</Label>
                <Textarea
                  id="studentNeeds"
                  placeholder="Any specific student needs, learning disabilities, or accommodations to consider..."
                  value={formData.studentNeeds}
                  onChange={(e) => setFormData({...formData, studentNeeds: e.target.value})}
                  className="bg-secondary border-border min-h-24"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Content Outline</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outline">Lesson Content Outline</Label>
                <Textarea
                  id="outline"
                  placeholder="Provide a basic outline of the lesson content, activities, and flow..."
                  value={formData.outline}
                  onChange={(e) => setFormData({...formData, outline: e.target.value})}
                  className="bg-secondary border-border min-h-48"
                />
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">💡 Tips for a great outline:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Include introduction, main activities, and conclusion</li>
                  <li>• Mention any materials or resources needed</li>
                  <li>• Consider different learning styles and engagement methods</li>
                  <li>• Include assessment or evaluation methods</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Wand2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">AI Enhancement</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Ready to Generate Your Lesson Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-secondary">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {formData.subject || "Subject"} - {formData.grade || "Grade"}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {formData.duration || "Duration"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Our AI will analyze your input and create a comprehensive lesson plan with detailed activities, 
                  assessment methods, and personalized recommendations based on your students' needs.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Lesson Plan with AI
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
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={step === 4}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
