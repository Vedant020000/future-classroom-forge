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
  Monitor,
  Users,
  MessageSquare,
  Settings,
  Hand,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "JS", isTeacher: false, handRaised: false },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", isTeacher: false, handRaised: true },
    { id: 3, name: "Mike Chen", avatar: "MC", isTeacher: false, handRaised: false },
  ]);
  
  const { profile } = useAuth();

  useEffect(() => {
    // Simulate loading time for classroom setup
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Setting up your virtual classroom..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen gap-4 p-4">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Teacher/Main Screen */}
          <Card className="relative bg-gray-900 border-gray-700 h-96 lg:h-[60%] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto">
                  {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {profile?.teacher_name || 'Teacher'} (You)
                </h3>
                <p className="text-gray-400">
                  {profile?.user_type === 'organization' ? profile.school_name : 'Individual Teacher'}
                </p>
              </div>
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button
                variant={isMicOn ? "default" : "destructive"}
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className="rounded-full"
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full"
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isScreenSharing ? "secondary" : "outline"}
                size="icon"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="rounded-full"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Student Video Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-48 lg:h-[35%]">
            {participants.map((participant) => (
              <Card key={participant.id} className="relative bg-gray-800 border-gray-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto relative ${
                      participant.handRaised ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}>
                      {participant.avatar}
                      {participant.handRaised && (
                        <Hand className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-bounce" />
                      )}
                    </div>
                    <p className="text-xs text-white font-medium">{participant.name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Participants Panel */}
          <Card className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Participants ({participants.length + 1})
              </h3>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {/* Teacher (You) */}
              <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                  </div>
                  <span className="text-sm text-white">You (Teacher)</span>
                </div>
                <Mic className="h-4 w-4 text-green-400" />
              </div>
              
              {/* Students */}
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {participant.avatar}
                    </div>
                    <span className="text-sm text-white">{participant.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {participant.handRaised && (
                      <Hand className="h-3 w-3 text-yellow-400" />
                    )}
                    <MicOff className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Panel */}
          <Card className="bg-gray-900 border-gray-700 p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </h3>
            </div>
            
            <div className="space-y-3 mb-4 h-32 overflow-y-auto">
              <div className="text-xs text-gray-400">
                <span className="font-medium">Sarah Johnson:</span> Can you repeat the last part?
              </div>
              <div className="text-xs text-gray-400">
                <span className="font-medium">Mike Chen:</span> Thanks for the explanation!
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
              />
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-900 border-gray-700 p-4">
            <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Room Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Monitor className="h-4 w-4 mr-2" />
                Share Screen
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
