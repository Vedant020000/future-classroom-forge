
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette,
  BookOpen,
  Users,
  Clock,
  Target,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ExcalidrawCanvas } from "@/components/whiteboard/ExcalidrawCanvas";

export const CreateLessonPlanPage = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    classroom: "",
    topic: "",
    date: "",
    duration: "",
    skillFocus: "",
    learningGoals: "",
    studentDescription: "",
  });

  const classrooms = [
    "5th Grade A", "5th Grade B", "6th Grade Math", "7th Grade Science", 
    "8th Grade English", "9th Grade History", "10th Grade Biology"
  ];

  const durations = ["30 min", "45 min", "60 min", "90 min", "120 min"];

  const handleGeneratePlan = async () => {
    if (!formData.classroom || !formData.topic || !formData.date || !formData.duration) {
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setStep(2);
      setIsGenerating(false);
    }, 1500);
  };

  if (step === 2) {
    return <ExcalidrawCanvas lessonData={formData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Visual Lesson Builder
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create engaging lesson plans with AI-powered visual blocks. Start with foundation blocks, then build your perfect lesson.
          </p>
          <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 max-w-sm mx-auto">
            <Sparkles className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 font-medium">AI-Assisted Foundation Blocks</span>
          </div>
        </div>

        <Card className="bg-white shadow-xl border-0 p-8">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Setup Your Lesson</h2>
              <p className="text-gray-600">Tell us about your lesson and we'll create foundational blocks to get you started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classroom" className="text-gray-900 font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Classroom *
                </Label>
                <Select value={formData.classroom} onValueChange={(value) => setFormData({...formData, classroom: value})}>
                  <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select your classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((classroom) => (
                      <SelectItem key={classroom} value={classroom}>
                        {classroom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-900 font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Lesson Topic *
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Rosa Parks & Civil Rights Movement"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-900 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-gray-900 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Duration *
                </Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skillFocus" className="text-gray-900 font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Skill Focus
                </Label>
                <Input
                  id="skillFocus"
                  placeholder="e.g., Critical thinking, Reading comprehension, Historical analysis"
                  value={formData.skillFocus}
                  onChange={(e) => setFormData({...formData, skillFocus: e.target.value})}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningGoals" className="text-gray-900 font-medium">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  placeholder="What should students learn or be able to do by the end of this lesson?"
                  value={formData.learningGoals}
                  onChange={(e) => setFormData({...formData, learningGoals: e.target.value})}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500 min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentDescription" className="text-gray-900 font-medium">Student Context (Optional)</Label>
                <Textarea
                  id="studentDescription"
                  placeholder="Tell us about your students - reading levels, classroom dynamics, special considerations..."
                  value={formData.studentDescription}
                  onChange={(e) => setFormData({...formData, studentDescription: e.target.value})}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500 min-h-24"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleGeneratePlan}
                disabled={!formData.classroom || !formData.topic || !formData.date || !formData.duration || isGenerating}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Foundation Blocks...
                  </>
                ) : (
                  <>
                    Generate Visual Lesson Plan
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
