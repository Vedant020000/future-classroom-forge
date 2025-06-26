
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { WhiteboardCanvas } from "@/components/whiteboard/WhiteboardCanvas";

export const CreateLessonPlanPage = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  
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
    }, 2000);
  };

  if (step === 2) {
    return <WhiteboardCanvas lessonData={formData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Palette className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visual Lesson Builder
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Create engaging lesson plans with AI-powered visual blocks
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">AI-Assisted Foundation Blocks</span>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">Setup Your Lesson</h2>
              <p className="text-slate-400">Tell us about your lesson and we'll create foundational blocks to get you started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classroom" className="text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Classroom *
                </Label>
                <Select value={formData.classroom} onValueChange={(value) => setFormData({...formData, classroom: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select your classroom" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {classrooms.map((classroom) => (
                      <SelectItem key={classroom} value={classroom} className="text-white focus:bg-slate-700">
                        {classroom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic" className="text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lesson Topic *
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Rosa Parks & Racism"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration *
                </Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration} className="text-white focus:bg-slate-700">
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skillFocus" className="text-white flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Skill Focus
                </Label>
                <Input
                  id="skillFocus"
                  placeholder="e.g., Critical thinking, Reading comprehension, Historical analysis"
                  value={formData.skillFocus}
                  onChange={(e) => setFormData({...formData, skillFocus: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningGoals" className="text-white">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  placeholder="What should students learn or be able to do by the end of this lesson?"
                  value={formData.learningGoals}
                  onChange={(e) => setFormData({...formData, learningGoals: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentDescription" className="text-white">Student Context (Optional)</Label>
                <Textarea
                  id="studentDescription"
                  placeholder="Tell us about your students - reading levels, classroom dynamics, special considerations..."
                  value={formData.studentDescription}
                  onChange={(e) => setFormData({...formData, studentDescription: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleGeneratePlan}
                disabled={!formData.classroom || !formData.topic || !formData.date || !formData.duration || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                    Generating Foundation Blocks...
                  </>
                ) : (
                  <>
                    Generate Whiteboard Plan
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
