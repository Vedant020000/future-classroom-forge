
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Edit3, 
  Trash2, 
  Bot, 
  User, 
  Move,
  Loader2,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: 'center' | 'concept' | 'output' | 'activity' | 'vocabulary' | 'question' | 'custom';
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isLoading?: boolean;
  connections?: string[];
}

interface LessonBlockProps {
  block: Block;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const LessonBlock = ({ 
  block, 
  isSelected, 
  onMouseDown, 
  onUpdate, 
  onDelete 
}: LessonBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const [editTitle, setEditTitle] = useState(block.title);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const getBlockIcon = (type: Block['type']) => {
    const icons = {
      center: Target,
      concept: Lightbulb,
      output: CheckCircle,
      activity: BookOpen,
      vocabulary: BookOpen,
      question: HelpCircle,
      custom: Sparkles
    };
    return icons[type];
  };

  const getBlockColor = (type: Block['type']) => {
    const colors = {
      center: 'from-purple-600 to-pink-600',
      concept: 'from-blue-600 to-cyan-600',
      output: 'from-green-600 to-emerald-600',
      activity: 'from-orange-600 to-red-600',
      vocabulary: 'from-yellow-600 to-orange-500',
      question: 'from-indigo-600 to-purple-600',
      custom: 'from-gray-600 to-slate-600'
    };
    return colors[type];
  };

  const handleSave = () => {
    onUpdate({ 
      title: editTitle, 
      content: editContent 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(block.title);
    setEditContent(block.content);
    setIsEditing(false);
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    // Simulate AI generation
    setTimeout(() => {
      const aiContent = `AI-generated content for ${block.type}: This is contextual content based on your lesson topic and type.`;
      setEditContent(aiContent);
      setIsGeneratingAI(false);
    }, 2000);
  };

  const Icon = getBlockIcon(block.type);

  return (
    <Card 
      className={cn(
        "absolute cursor-move border transition-all duration-200",
        isSelected 
          ? "border-purple-400 shadow-lg shadow-purple-400/20 ring-2 ring-purple-400/30" 
          : "border-slate-600 hover:border-slate-500",
        block.isLoading && "animate-pulse"
      )}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
        zIndex: isSelected ? 10 : 5
      }}
      onMouseDown={onMouseDown}
    >
      {/* Block Header */}
      <div className={cn(
        "p-3 rounded-t-lg bg-gradient-to-r text-white",
        getBlockColor(block.type)
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-6 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/70"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="font-medium text-sm">{block.title}</span>
            )}
          </div>
          
          {isSelected && !isEditing && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Block Content */}
      <div className="p-3 bg-slate-800 rounded-b-lg h-[calc(100%-52px)]">
        {block.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        ) : isEditing ? (
          <div className="space-y-3 h-full flex flex-col">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 bg-slate-700 border-slate-600 text-white text-sm resize-none"
              placeholder="Enter your content..."
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleGenerateWithAI}
                  disabled={isGeneratingAI}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGeneratingAI ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Bot className="h-3 w-3 mr-1" />
                  )}
                  Generate with AI
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="h-full overflow-auto text-slate-300 text-sm leading-relaxed cursor-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {block.content}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-400 cursor-se-resize" />
      )}
    </Card>
  );
};
