
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Play, Pause, RotateCcw, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const VirtualClassroomPage = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const mockLessonPlan = {
    title: "Introduction to Fractions",
    subject: "Mathematics",
    grade: "4th Grade",
    duration: "45 minutes"
  };

  const mockIssues = [
    {
      type: "warning",
      message: "Student 'Alex' might struggle with visual fraction representations",
      timestamp: "03:45",
      severity: "Medium"
    },
    {
      type: "suggestion",
      message: "Consider slowing down during the pie chart explanation",
      timestamp: "07:12",
      severity: "Low"
    },
    {
      type: "success",
      message: "Great engagement during hands-on activity!",
      timestamp: "12:30",
      severity: "Positive"
    }
  ];

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive);
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setSessionTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Monitor className="h-8 w-8 text-purple-400" />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Virtual Classroom</h1>
          <p className="text-gray-400">Test and refine your lesson plans in a simulated environment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Simulation Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Lesson Plan */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{mockLessonPlan.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {mockLessonPlan.subject} • {mockLessonPlan.grade} • {mockLessonPlan.duration}
                  </CardDescription>
                </div>
                <Badge variant={isSessionActive ? "default" : "secondary"}>
                  {isSessionActive ? "Active" : "Ready"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleSession}
                  className={`${
                    isSessionActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {isSessionActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Session
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetSession}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-400">Session Time:</span>
                  <span className="text-lg font-mono text-white">{formatTime(sessionTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Student Interaction */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                AI Student Interaction
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isSessionActive 
                  ? "AI students are responding to your lesson" 
                  : "Start a session to begin interacting with AI students"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSessionActive ? (
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        AI
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">Student Emma</p>
                        <p className="text-gray-300">"I'm confused about how 1/2 and 2/4 can be the same. Can you show me again?"</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your response to the student..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                      Send Response
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Start a session to begin interacting with AI students
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Issues and Feedback */}
        <div className="space-y-4">
          {/* Real-time Issues */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Real-time Feedback
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI-detected potential issues and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-start gap-2">
                      {issue.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />}
                      {issue.type === "suggestion" && <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5" />}
                      {issue.type === "success" && <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-white">{issue.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{issue.timestamp}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              issue.severity === "Medium" ? "border-yellow-600 text-yellow-400" :
                              issue.severity === "Low" ? "border-blue-600 text-blue-400" :
                              "border-green-600 text-green-400"
                            }`}
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Student Questions:</span>
                  <span className="text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement Level:</span>
                  <span className="text-green-400">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Potential Issues:</span>
                  <span className="text-yellow-400">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate:</span>
                  <span className="text-white">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Students */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Virtual Students</CardTitle>
              <CardDescription className="text-gray-400">
                Based on your student data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Emma", "Alex", "Sarah", "Michael"].map((name) => (
                  <div key={name} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white text-sm">{name}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
