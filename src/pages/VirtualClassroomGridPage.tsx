
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
  Grid3X3,
  Maximize2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomGridPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [gridSize, setGridSize] = useState(12);
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "JS", isTeacher: false, handRaised: false },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", isTeacher: false, handRaised: true },
    { id: 3, name: "Mike Chen", avatar: "MC", isTeacher: false, handRaised: false },
    { id: 4, name: "Emma Davis", avatar: "ED", isTeacher: false, handRaised: false },
    { id: 5, name: "Alex Wilson", avatar: "AW", isTeacher: false, handRaised: false },
    { id: 6, name: "Lisa Brown", avatar: "LB", isTeacher: false, handRaised: true },
    { id: 7, name: "David Lee", avatar: "DL", isTeacher: false, handRaised: false },
    { id: 8, name: "Rachel Green", avatar: "RG", isTeacher: false, handRaised: false },
  ]);
  
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Setting up grid classroom..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="h-screen p-4">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Grid Classroom - Large Group Focus
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridSize(9)}
                className={gridSize === 9 ? "bg-primary" : ""}
              >
                3x3
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridSize(12)}
                className={gridSize === 12 ? "bg-primary" : ""}
              >
                3x4
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGridSize(16)}
                className={gridSize === 16 ? "bg-primary" : ""}
              >
                4x4
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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

        {/* Grid Layout */}
        <div className={`grid gap-2 h-[calc(100vh-120px)] ${
          gridSize === 9 ? 'grid-cols-3 grid-rows-3' : 
          gridSize === 12 ? 'grid-cols-4 grid-rows-3' : 
          'grid-cols-4 grid-rows-4'
        }`}>
          {/* Teacher Video - Larger */}
          <Card className={`relative bg-purple-900/30 border-purple-500 overflow-hidden ${
            gridSize === 9 ? 'col-span-1 row-span-1' : 'col-span-2 row-span-2'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto">
                  {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                </div>
                <p className="text-sm font-medium text-white">
                  {profile?.teacher_name || 'Teacher'} (You)
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </Card>

          {/* Student Videos */}
          {participants.slice(0, gridSize - 1).map((participant, index) => (
            <Card key={participant.id} className="relative bg-gray-800 border-gray-600 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto ${
                    participant.handRaised ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {participant.avatar}
                  </div>
                  <p className="text-xs text-white font-medium">{participant.name}</p>
                </div>
              </div>
              {participant.handRaised && (
                <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </Card>
          ))}

          {/* Empty slots for more participants */}
          {Array.from({ length: Math.max(0, gridSize - participants.length - 1) }).map((_, index) => (
            <Card key={`empty-${index}`} className="relative bg-gray-900/50 border-gray-700 border-dashed overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-1">
                  <Users className="h-6 w-6 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-500">Waiting</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer with participant count */}
        <div className="mt-4 flex justify-center">
          <div className="bg-black/50 px-4 py-2 rounded-lg">
            <p className="text-sm text-white">
              {participants.length + 1} participants • Grid optimized for large groups
            </p>
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
