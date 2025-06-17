
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
  UserCheck,
  Users,
  Timer,
  Settings,
  Volume2,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomBreakoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [breakoutTime, setBreakoutTime] = useState(900); // 15 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0); // 0 = main room
  
  const [breakoutRooms] = useState([
    {
      id: 1,
      name: "Room 1 - Math Problem",
      participants: [
        { id: 1, name: "John Smith", avatar: "JS" },
        { id: 2, name: "Sarah Johnson", avatar: "SJ" },
      ],
      active: true
    },
    {
      id: 2,
      name: "Room 2 - Science Experiment",
      participants: [
        { id: 3, name: "Mike Chen", avatar: "MC" },
        { id: 4, name: "Emma Davis", avatar: "ED" },
      ],
      active: true
    },
    {
      id: 3,
      name: "Room 3 - Literature Discussion",
      participants: [
        { id: 5, name: "Alex Wilson", avatar: "AW" },
        { id: 6, name: "Lisa Brown", avatar: "LB" },
      ],
      active: false
    }
  ]);
  
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTimerActive && breakoutTime > 0) {
      const interval = setInterval(() => {
        setBreakoutTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, breakoutTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <LoadingScreen message="Setting up breakout rooms..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black/50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Breakout Rooms Classroom
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Timer className="h-4 w-4" />
              {formatTime(breakoutTime)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? "Pause" : "Start"}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Room Settings
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

        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-4">
            {currentRoom === 0 ? (
              /* Main Room View */
              <div className="space-y-4">
                {/* Teacher Control Panel */}
                <Card className="bg-purple-900/30 border-purple-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                        {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Main Room - Teacher Control</h2>
                        <p className="text-gray-300">Monitor and manage all breakout rooms</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Broadcast Message
                      </Button>
                      <Button variant="outline">
                        Close All Rooms
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Breakout Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {breakoutRooms.map((room) => (
                    <Card key={room.id} className={`p-4 ${
                      room.active ? 'bg-green-900/20 border-green-500' : 'bg-gray-800 border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{room.name}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          room.active ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {room.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {participant.avatar}
                            </div>
                            <span className="text-sm text-white">{participant.name}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentRoom(room.id)}
                          className="flex-1"
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Add Room Card */}
                  <Card className="p-4 bg-gray-900/50 border-gray-700 border-dashed">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400 mb-3">Create New Room</p>
                      <Button variant="outline" size="sm">
                        Add Room
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              /* Breakout Room View */
              <div className="space-y-4">
                <Card className="bg-blue-900/30 border-blue-500 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {breakoutRooms.find(r => r.id === currentRoom)?.name}
                      </h2>
                      <p className="text-sm text-gray-300">
                        {breakoutRooms.find(r => r.id === currentRoom)?.participants.length} participants
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentRoom(0)}
                    >
                      Return to Main Room
                    </Button>
                  </div>
                </Card>

                {/* Room Video Grid */}
                <div className="grid grid-cols-2 gap-4 h-96">
                  {breakoutRooms.find(r => r.id === currentRoom)?.participants.map((participant) => (
                    <Card key={participant.id} className="relative bg-gray-800 border-gray-600 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white mx-auto">
                            {participant.avatar}
                          </div>
                          <p className="text-sm font-medium text-white">{participant.name}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-black/50 p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-white">Room Status</h3>
              <div className="space-y-1">
                {breakoutRooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                    <span className="text-sm text-white">{room.name.split(' - ')[0]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{room.participants.length}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        room.active ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-white">Quick Actions</h3>
              <div className="space-y-1">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Timer className="h-4 w-4 mr-2" />
                  Extend Time (+5 min)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Shuffle Participants
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
