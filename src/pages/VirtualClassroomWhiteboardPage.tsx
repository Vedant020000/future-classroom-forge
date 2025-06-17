
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
  PenTool,
  Eraser,
  Circle,
  Square,
  Type,
  Palette,
  Undo,
  Redo,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const VirtualClassroomWhiteboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "JS", canDraw: false },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", canDraw: true },
    { id: 3, name: "Mike Chen", avatar: "MC", canDraw: false },
    { id: 4, name: "Emma Davis", avatar: "ED", canDraw: true },
  ]);
  
  const { profile } = useAuth();
  const colors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Setting up whiteboard classroom..." />;
  }

  return (
    <VirtualClassroomLayout>
      <div className="h-screen flex">
        {/* Whiteboard Tools Sidebar */}
        <div className="w-20 bg-black/50 p-2 space-y-2">
          <h3 className="text-xs font-medium text-white text-center mb-4">Tools</h3>
          
          {[
            { id: 'pen', icon: PenTool, label: 'Pen' },
            { id: 'eraser', icon: Eraser, label: 'Eraser' },
            { id: 'circle', icon: Circle, label: 'Circle' },
            { id: 'square', icon: Square, label: 'Square' },
            { id: 'text', icon: Type, label: 'Text' },
          ].map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "outline"}
              size="icon"
              onClick={() => setSelectedTool(tool.id)}
              className="w-full"
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <div className="pt-2 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">Colors</p>
            <div className="grid grid-cols-2 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded border-2 ${
                    selectedColor === color ? 'border-white' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-600 space-y-1">
            <Button variant="outline" size="icon" className="w-full">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-full">
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-full">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-black/50">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Interactive Whiteboard Classroom
            </h1>
            
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

          {/* Whiteboard Area */}
          <div className="flex-1 p-4">
            <Card className="relative bg-white h-full overflow-hidden border-2 border-gray-300">
              <div className="absolute inset-0 p-4">
                <div className="text-center text-gray-400 mt-20">
                  <PenTool className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Interactive Whiteboard</h3>
                  <p>Use the tools on the left to draw, write, and collaborate</p>
                  <div className="mt-8 space-y-2">
                    <div className="w-64 h-1 bg-blue-300 mx-auto rounded" />
                    <div className="w-48 h-1 bg-red-300 mx-auto rounded" />
                    <div className="w-32 h-8 bg-yellow-300 mx-auto rounded flex items-center justify-center text-sm text-gray-700">
                      Sample Text
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Drawing permissions indicator */}
              <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded">
                <p className="text-xs text-white">
                  Drawing: {participants.filter(p => p.canDraw).length + 1} participants
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Participants Sidebar */}
        <div className="w-64 bg-black/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {profile?.teacher_name ? profile.teacher_name.split(' ').map(n => n[0]).join('') : 'T'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{profile?.teacher_name || 'Teacher'}</p>
              <p className="text-xs text-green-400">Drawing enabled</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Participants</h3>
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {participant.avatar}
                  </div>
                  <span className="text-sm text-white">{participant.name}</span>
                </div>
                <Button
                  variant={participant.canDraw ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {participant.canDraw ? "Can Draw" : "View Only"}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Palette className="h-4 w-4 mr-2" />
              Clear Board
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Save className="h-4 w-4 mr-2" />
              Save Board
            </Button>
          </div>
        </div>
      </div>
    </VirtualClassroomLayout>
  );
};
