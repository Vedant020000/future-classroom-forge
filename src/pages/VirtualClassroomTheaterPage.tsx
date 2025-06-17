
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
  Theater,
  Presentation,
  Volume2,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomTheaterPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "JS", watching: true },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", watching: true },
    { id: 3, name: "Mike Chen", avatar: "MC", watching: false },
    { id: 4, name: "Emma Davis", avatar: "ED", watching: true },
    { id: 5, name: "Alex Wilson", avatar: "AW", watching: true },
  ]);
  
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Setting up theater classroom..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black/50">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Theater className="h-5 w-5" />
            Theater Classroom - Presentation Focus
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isPresenting ? "default" : "outline"}
              onClick={() => setIsPresenting(!isPresenting)}
            >
              <Presentation className="h-4 w-4 mr-2" />
              {isPresenting ? "Stop Presenting" : "Start Presenting"}
            </Button>
            <Button
              variant={isMicOn ? "default" : "destructive"}
              size="icon"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Main Stage Area */}
        <div className="flex-1 p-4">
          <Card className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500 h-full overflow-hidden">
            {isPresenting ? (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Monitor className="h-24 w-24 text-purple-400 mx-auto" />
                  <h2 className="text-2xl font-bold text-white">Screen Sharing Active</h2>
                  <p className="text-gray-400">Your presentation is being shared with all participants</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-2xl">
                    {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {profile?.teacher_name || 'Teacher'}
                    </h2>
                    <p className="text-xl text-gray-300">
                      {profile?.user_type === 'organization' ? profile.school_name : 'Individual Teacher'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Stage controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <Button
                variant={isMicOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsMicOn(!isMicOn)}
                className="rounded-full"
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full"
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Audience Strip */}
        <div className="bg-black/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white">Audience ({participants.length})</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="h-4 w-4" />
              {participants.filter(p => p.watching).length} watching
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {participants.map((participant) => (
              <div key={participant.id} className="flex-shrink-0">
                <Card className={`w-20 h-16 relative overflow-hidden ${
                  participant.watching ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto ${
                        participant.watching ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {participant.avatar}
                      </div>
                      <p className="text-xs text-white mt-1">{participant.name.split(' ')[0]}</p>
                    </div>
                  </div>
                  {participant.watching && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
