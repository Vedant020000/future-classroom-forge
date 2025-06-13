
import { useState } from "react";
import { VirtualClassroomLayout } from "@/components/layout/VirtualClassroomLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LessonPlanSelector } from "@/components/virtual-classroom/LessonPlanSelector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Users, 
  MessageCircle,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock
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

type SimulationState = 'selecting' | 'loading' | 'running' | 'completed';

export const VirtualClassroomPage = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>('selecting');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);

  const virtualStudents = [
    { name: "Alex Chen", personality: "Analytical", engagement: "High", difficulty: "Advanced" },
    { name: "Emma Rodriguez", personality: "Creative", engagement: "Medium", difficulty: "Grade Level" },
    { name: "Marcus Johnson", personality: "Kinesthetic", engagement: "Low", difficulty: "Below Grade" },
    { name: "Sofia Patel", personality: "Social", engagement: "High", difficulty: "Grade Level" },
    { name: "Jamie Williams", personality: "Quiet", engagement: "Medium", difficulty: "Advanced" }
  ];

  const insights = [
    {
      type: "warning",
      icon: AlertTriangle,
      message: "Marcus may struggle with abstract concepts - consider concrete examples",
      timing: "5 minutes in"
    },
    {
      type: "success", 
      icon: CheckCircle,
      message: "Alex and Sofia are showing strong engagement with the current activity",
      timing: "12 minutes in"
    },
    {
      type: "suggestion",
      icon: Brain,
      message: "Emma might benefit from visual representations - try adding diagrams",
      timing: "18 minutes in"
    }
  ];

  const handleSelectPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setSimulationState('loading');
    
    // Simulate loading
    setTimeout(() => {
      setSimulationState('running');
      startSimulation();
    }, 3000);
  };

  const handleUploadPlan = (file: File) => {
    console.log('Uploading file:', file.name);
    // Handle file upload logic here
    const mockPlan: LessonPlan = {
      id: 999,
      title: file.name.replace(/\.[^/.]+$/, ""),
      subject: "Uploaded",
      grade: "Custom",
      duration: "60 min",
      students: 30,
      created: new Date().toISOString().split('T')[0],
      status: "Ready",
      description: "Uploaded lesson plan"
    };
    handleSelectPlan(mockPlan);
  };

  const startSimulation = () => {
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationState('completed');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const resetSimulation = () => {
    setSimulationProgress(0);
    setSimulationState('selecting');
    setSelectedPlan(null);
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'suggestion': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-gray-600 bg-gray-900';
    }
  };

  if (simulationState === 'loading') {
    return <LoadingScreen message={`Loading ${selectedPlan?.title}...`} />;
  }

  if (simulationState === 'selecting') {
    return (
      <VirtualClassroomLayout>
        <LessonPlanSelector 
          onSelectPlan={handleSelectPlan}
          onUploadPlan={handleUploadPlan}
        />
      </VirtualClassroomLayout>
    );
  }

  return (
    <VirtualClassroomLayout>
      <div className="p-8 space-y-8 pt-20">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Virtual Classroom - {selectedPlan?.title}
          </h1>
          <p className="text-gray-400 mt-2">
            {selectedPlan?.subject} • {selectedPlan?.grade} • {selectedPlan?.duration}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Controls */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Play className="h-5 w-5 text-primary" />
                Simulation Controls
              </h3>
              
              {simulationState === 'running' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">Simulation Progress</span>
                    <span className="text-sm text-gray-400">{simulationProgress}% Complete</span>
                  </div>
                  <Progress value={simulationProgress} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              )}

              {simulationState === 'completed' && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2 text-white">Simulation Complete!</h4>
                  <p className="text-gray-400 mb-6">
                    Review the insights and feedback below to improve your lesson plan
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetSimulation} variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Simulation
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      Save Results
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Real-time Insights */}
            {(simulationState === 'running' || simulationState === 'completed') && (
              <Card className="p-6 bg-gray-900 border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start gap-3">
                        <insight.icon className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{insight.message}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {insight.timing}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Virtual Students */}
          <div className="space-y-6">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-primary" />
                Virtual Students
              </h3>
              <div className="space-y-4">
                {virtualStudents.map((student, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-white">{student.name}</span>
                      <span className={`text-xs font-medium ${getEngagementColor(student.engagement)}`}>
                        {student.engagement}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Type: {student.personality}</div>
                      <div>Level: {student.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gray-900 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5 text-primary" />
                Live Feedback
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-gray-800">
                  <p className="font-medium text-white">Alex:</p>
                  <p className="text-gray-400">"I understand the equation, but can we see more examples?"</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-800">
                  <p className="font-medium text-white">Emma:</p>
                  <p className="text-gray-400">"This is confusing. Can you explain it differently?"</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-800">
                  <p className="font-medium text-white">Marcus:</p>
                  <p className="text-gray-400">"I'm lost. Can we slow down?"</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
