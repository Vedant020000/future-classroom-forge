
import { useState } from "react";
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

export const VirtualClassroomPage = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  
  const availablePlans = [
    {
      id: 1,
      title: "Introduction to Algebra",
      subject: "Mathematics",
      grade: "Grade 8",
      duration: "45 min",
      status: "Ready"
    },
    {
      id: 2,
      title: "World War II History", 
      subject: "History",
      grade: "Grade 10", 
      duration: "60 min",
      status: "Draft"
    }
  ];

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
      message: "Marcus may struggle with abstract algebra concepts - consider concrete examples",
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

  const startSimulation = () => {
    setIsSimulating(true);
    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
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
      default: return 'border-border bg-secondary';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Virtual Classroom
        </h1>
        <p className="text-muted-foreground mt-2">
          Test your lesson plans with AI-powered student simulations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Plan Selection */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Select Lesson Plan
            </h3>
            <div className="space-y-3">
              {availablePlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-foreground">{plan.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.subject} • {plan.grade} • {plan.duration}
                    </p>
                  </div>
                  <Badge className={plan.status === 'Ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {plan.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Simulation Controls */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Simulation Controls
            </h3>
            
            {!isSimulating && simulationProgress === 0 && (
              <div className="text-center py-8">
                <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Ready to Start Virtual Class</h4>
                <p className="text-muted-foreground mb-6">
                  Select a lesson plan above and click start to begin the simulation
                </p>
                <Button onClick={startSimulation} className="bg-primary hover:bg-primary/90">
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            )}

            {isSimulating && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Simulation Progress</span>
                  <span className="text-sm text-muted-foreground">{simulationProgress}% Complete</span>
                </div>
                <Progress value={simulationProgress} className="h-2" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-border">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            )}

            {!isSimulating && simulationProgress === 100 && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Simulation Complete!</h4>
                <p className="text-muted-foreground mb-6">
                  Review the insights and feedback below to improve your lesson plan
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => {setSimulationProgress(0)}} variant="outline" className="border-border">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Run Again
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Save Results
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Real-time Insights */}
          {(isSimulating || simulationProgress === 100) && (
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start gap-3">
                      <insight.icon className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{insight.message}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
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
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Virtual Students
            </h3>
            <div className="space-y-4">
              {virtualStudents.map((student, index) => (
                <div key={index} className="p-3 rounded-lg bg-secondary border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{student.name}</span>
                    <span className={`text-xs font-medium ${getEngagementColor(student.engagement)}`}>
                      {student.engagement}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Type: {student.personality}</div>
                    <div>Level: {student.difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Live Feedback
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-secondary">
                <p className="font-medium">Alex:</p>
                <p className="text-muted-foreground">"I understand the equation, but can we see more examples?"</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="font-medium">Emma:</p>
                <p className="text-muted-foreground">"This is confusing. Can you explain it differently?"</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="font-medium">Marcus:</p>
                <p className="text-muted-foreground">"I'm lost. Can we slow down?"</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
