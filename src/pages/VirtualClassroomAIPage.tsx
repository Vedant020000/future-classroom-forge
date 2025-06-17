
import { useState, useEffect } from "react";
import { VirtualClassroomLayout } from "@/components/layout/VirtualClassroomLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Brain,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Target,
  BookOpen,
  MessageSquare,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomAIPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [aiInsights, setAiInsights] = useState([
    { type: 'engagement', message: 'Student engagement is 85% - excellent!', priority: 'high' },
    { type: 'suggestion', message: 'Consider a quick quiz to reinforce the concept', priority: 'medium' },
    { type: 'attention', message: '3 students seem confused about the last topic', priority: 'high' },
  ]);
  
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "JS", engagement: 95, understanding: 80, questions: 2 },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", engagement: 75, understanding: 90, questions: 1 },
    { id: 3, name: "Mike Chen", avatar: "MC", engagement: 60, understanding: 65, questions: 0 },
    { id: 4, name: "Emma Davis", avatar: "ED", engagement: 88, understanding: 85, questions: 3 },
  ]);
  
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'engagement': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'attention': return AlertCircle;
      default: return Brain;
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Initializing AI classroom assistant..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black/50">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI-Assisted Smart Classroom
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/30 rounded-lg">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white">AI Active</span>
            </div>
            <Button
              variant={isMicOn ? "default" : "destructive"}
              size="icon"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="icon"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-4 space-y-4">
            {/* Teacher Video with AI Overlay */}
            <Card className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500 h-80 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto relative">
                    {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {profile?.teacher_name || 'Teacher'} (You)
                  </h3>
                  <p className="text-gray-400">AI-Enhanced Teaching Mode</p>
                </div>
              </div>
              
              {/* AI Live Insights Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-lg max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-medium text-white">Live AI Analysis</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-green-400">• Class engagement: 77%</div>
                  <div className="text-xs text-yellow-400">• Comprehension rate: 80%</div>
                  <div className="text-xs text-blue-400">• Optimal pace detected</div>
                </div>
              </div>
            </Card>

            {/* Student Grid with AI Analytics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {participants.map((participant) => (
                <Card key={participant.id} className="relative bg-gray-800 border-gray-600 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto">
                        {participant.avatar}
                      </div>
                      <p className="text-xs text-white font-medium">{participant.name}</p>
                    </div>
                  </div>
                  
                  {/* AI Metrics Overlay */}
                  <div className="absolute top-2 left-2 space-y-1">
                    <div className={`text-xs ${getEngagementColor(participant.engagement)}`}>
                      E: {participant.engagement}%
                    </div>
                    <div className={`text-xs ${getEngagementColor(participant.understanding)}`}>
                      U: {participant.understanding}%
                    </div>
                    {participant.questions > 0 && (
                      <div className="text-xs text-orange-400">
                        Q: {participant.questions}
                      </div>
                    )}
                  </div>
                  
                  {/* Alert indicator for low engagement */}
                  {participant.engagement < 70 && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="w-96 bg-black/50 p-4 space-y-4">
            {/* AI Insights */}
            <Card className="bg-purple-900/20 border-purple-500 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="font-medium text-white">AI Insights</h3>
              </div>
              
              <div className="space-y-3">
                {aiInsights.map((insight, index) => {
                  const Icon = getInsightIcon(insight.type);
                  return (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      insight.priority === 'high' ? 'border-red-400 bg-red-900/20' :
                      insight.priority === 'medium' ? 'border-yellow-400 bg-yellow-900/20' :
                      'border-blue-400 bg-blue-900/20'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 text-gray-300" />
                        <p className="text-sm text-white">{insight.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Smart Suggestions */}
            <Card className="bg-blue-900/20 border-blue-500 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-blue-400" />
                <h3 className="font-medium text-white">Smart Suggestions</h3>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Review Previous Concept
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Comprehension Question
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Interactive Activity
                </Button>
              </div>
            </Card>

            {/* Real-time Analytics */}
            <Card className="bg-green-900/20 border-green-500 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h3 className="font-medium text-white">Live Analytics</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Class Engagement</span>
                  <span className="text-sm font-medium text-green-400">77%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '77%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Understanding</span>
                  <span className="text-sm font-medium text-yellow-400">80%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Active Participation</span>
                  <span className="text-sm font-medium text-blue-400">6/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
