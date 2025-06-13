
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  BookOpen, 
  Play, 
  Clock, 
  Users,
  FileText
} from "lucide-react";

interface LessonPlan {
  id: number;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  students: number;
  created: string;
  status: string;
  description: string;
}

interface LessonPlanSelectorProps {
  onSelectPlan: (plan: LessonPlan) => void;
  onUploadPlan: (file: File) => void;
}

export const LessonPlanSelector = ({ onSelectPlan, onUploadPlan }: LessonPlanSelectorProps) => {
  const [selectedTab, setSelectedTab] = useState<'existing' | 'upload'>('existing');

  const existingPlans: LessonPlan[] = [
    {
      id: 1,
      title: "Introduction to Algebra",
      subject: "Mathematics",
      grade: "Grade 8",
      duration: "45 min",
      students: 28,
      created: "2024-01-15",
      status: "Ready",
      description: "Basic algebraic concepts and solving simple equations"
    },
    {
      id: 2,
      title: "World War II History", 
      subject: "History",
      grade: "Grade 10",
      duration: "60 min",
      students: 24,
      created: "2024-01-12",
      status: "Ready",
      description: "Major events and consequences of World War II"
    },
    {
      id: 3,
      title: "Chemical Reactions",
      subject: "Science",
      grade: "Grade 9",
      duration: "50 min",
      students: 26,
      created: "2024-01-08",
      status: "Ready",
      description: "Understanding chemical bonds and reaction types"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadPlan(file);
    }
  };

  const getStatusColor = (status: string) => {
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4">
          Virtual Classroom
        </h1>
        <p className="text-gray-400 text-lg">
          Select a lesson plan to begin your virtual teaching simulation
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-900 rounded-lg p-1 flex">
          <button
            className={`px-6 py-2 rounded-md transition-all ${
              selectedTab === 'existing'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setSelectedTab('existing')}
          >
            <BookOpen className="h-4 w-4 inline-block mr-2" />
            Existing Plans
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-all ${
              selectedTab === 'upload'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setSelectedTab('upload')}
          >
            <Upload className="h-4 w-4 inline-block mr-2" />
            Upload Plan
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'existing' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingPlans.map((plan) => (
            <Card key={plan.id} className="p-6 bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    {plan.subject}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    {plan.grade}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    {plan.duration}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="h-4 w-4" />
                    {plan.students} students
                  </div>
                </div>

                <Button 
                  onClick={() => onSelectPlan(plan)}
                  className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-gray-900 border-gray-800">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Lesson Plan</h3>
                <p className="text-gray-400 text-sm">
                  Upload a PDF, Word document, or text file containing your lesson plan
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-upload" className="text-white">
                    Choose File
                  </Label>
                  <Input
                    id="lesson-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="mt-2 bg-gray-800 border-gray-700 text-white file:bg-primary file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, Word, Text files (Max 10MB)
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
