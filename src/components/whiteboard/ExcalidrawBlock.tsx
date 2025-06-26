
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Edit3, 
  Trash2, 
  Bot, 
  Move,
  Loader2,
  Target,
  Lightbulb,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Sparkles,
  GripVertical
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

interface ExcalidrawBlockProps {
  block: Block;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const ExcalidrawBlock = ({ 
  block, 
  isSelected, 
  onMouseDown, 
  onUpdate, 
  onDelete 
}: ExcalidrawBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const [editTitle, setEditTitle] = useState(block.title);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

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
      center: 'border-purple-500 bg-purple-50',
      concept: 'border-blue-500 bg-blue-50',
      output: 'border-green-500 bg-green-50',
      activity: 'border-orange-500 bg-orange-50',
      vocabulary: 'border-yellow-500 bg-yellow-50',
      question: 'border-indigo-500 bg-indigo-50',
      custom: 'border-gray-500 bg-gray-50'
    };
    return colors[type];
  };

  const getHeaderColor = (type: Block['type']) => {
    const colors = {
      center: 'bg-purple-500',
      concept: 'bg-blue-500',
      output: 'bg-green-500',
      activity: 'bg-orange-500',
      vocabulary: 'bg-yellow-500',
      question: 'bg-indigo-500',
      custom: 'bg-gray-500'
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
      ref={blockRef}
      className={cn(
        "absolute select-none border-2 transition-all duration-200 shadow-sm",
        getBlockColor(block.type),
        isSelected 
          ? "shadow-lg ring-2 ring-blue-400/30 border-blue-400" 
          : "hover:shadow-md",
        block.isLoading && "animate-pulse"
      )}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
        zIndex: isSelected ? 20 : 10
      }}
    >
      {/* Block Header */}
      <div 
        className={cn(
          "flex items-center justify-between p-3 text-white cursor-move rounded-t-lg",
          getHeaderColor(block.type)
        )}
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="h-4 w-4 opacity-60" />
          <Icon className="h-4 w-4" />
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-6 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/70 flex-1"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <span className="font-medium text-sm flex-1">{block.title}</span>
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

      {/* Block Content */}
      <div className="p-4 h-[calc(100%-52px)] bg-white rounded-b-lg">
        {block.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Generating content...</p>
            </div>
          </div>
        ) : isEditing ? (
          <div className="space-y-3 h-full flex flex-col">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 border-gray-200 text-gray-900 text-sm resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your content..."
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={handleGenerateWithAI}
                disabled={isGeneratingAI}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGeneratingAI ? (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <Bot className="h-3 w-3 mr-2" />
                )}
                Generate with AI
              </Button>
              
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
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="h-full overflow-auto text-gray-700 text-sm leading-relaxed cursor-text p-1"
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelected) return;
              setIsEditing(true);
            }}
          >
            {block.content || (
              <span className="text-gray-400 italic">Click to add content...</span>
            )}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-400 cursor-se-resize opacity-60 hover:opacity-100" />
      )}
    </Card>
  );
};
