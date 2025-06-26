
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Save, 
  Download, 
  Sparkles, 
  Edit3,
  Move,
  Trash2,
  Bot,
  User
} from "lucide-react";
import { LessonBlock } from "./LessonBlock";
import { BlockToolbar } from "./BlockToolbar";
import { useToast } from "@/hooks/use-toast";

interface LessonData {
  classroom: string;
  topic: string;
  date: string;
  duration: string;
  skillFocus: string;
  learningGoals: string;
  studentDescription: string;
}

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

interface WhiteboardCanvasProps {
  lessonData: LessonData;
}

export const WhiteboardCanvas = ({ lessonData }: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  // Initialize with loading blocks
  useEffect(() => {
    const initialBlocks: Block[] = [
      {
        id: 'center',
        type: 'center',
        title: 'Center Block',
        content: 'Loading main idea...',
        x: 400,
        y: 200,
        width: 300,
        height: 150,
        isLoading: true
      },
      {
        id: 'concepts',
        type: 'concept',
        title: 'Key Concepts',
        content: 'Loading core concepts...',
        x: 100,
        y: 100,
        width: 250,
        height: 120,
        isLoading: true
      },
      {
        id: 'output',
        type: 'output',
        title: 'Learning Outcome',
        content: 'Loading expected output...',
        x: 750,
        y: 150,
        width: 280,
        height: 130,
        isLoading: true
      }
    ];

    setBlocks(initialBlocks);

    // Simulate AI generation
    setTimeout(() => {
      setBlocks(prevBlocks => prevBlocks.map(block => ({
        ...block,
        isLoading: false,
        content: generateInitialContent(block.type, lessonData)
      })));
      setIsGenerating(false);
      toast({
        title: "Foundation blocks generated!",
        description: "Your AI-powered lesson structure is ready. Start building!",
      });
    }, 3000);
  }, [lessonData, toast]);

  const generateInitialContent = (blockType: Block['type'], data: LessonData): string => {
    switch (blockType) {
      case 'center':
        return `Why is ${data.topic} important for students to understand?`;
      case 'concept':
        return `Key concepts: Critical thinking, Historical context, Social justice, Making inferences`;
      case 'output':
        return `Students will be able to articulate what ${data.topic} means in their community through an exit slip`;
      default:
        return 'AI-generated content ready for editing';
    }
  };

  const addNewBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      title: getBlockTitle(type),
      content: 'Click to edit or generate with AI...',
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 200,
      width: 250,
      height: 120
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const getBlockTitle = (type: Block['type']): string => {
    const titles = {
      center: 'Main Focus',
      concept: 'Key Concepts',
      output: 'Learning Outcome',
      activity: 'Activity',
      vocabulary: 'Vocabulary',
      question: 'Essential Question',
      custom: 'Custom Block'
    };
    return titles[type];
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    setSelectedBlock(null);
  };

  const handleMouseDown = (e: React.MouseEvent, blockId: string) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(blockId);
      setIsDragging(true);
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        setDragOffset({
          x: e.clientX - block.x,
          y: e.clientY - block.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedBlock) {
      updateBlock(selectedBlock, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{lessonData.topic}</h1>
            <p className="text-sm text-slate-400">{lessonData.classroom} • {lessonData.date} • {lessonData.duration}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Save className="h-4 w-4 mr-2" />
              Save Plan
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <BlockToolbar onAddBlock={addNewBlock} />

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[calc(100vh-120px)] bg-slate-900 overflow-auto cursor-move"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Connection Lines - Simple implementation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {blocks.map(block => 
            block.connections?.map(targetId => {
              const target = blocks.find(b => b.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${block.id}-${targetId}`}
                  x1={block.x + block.width / 2}
                  y1={block.y + block.height / 2}
                  x2={target.x + target.width / 2}
                  y2={target.y + target.height / 2}
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })
          )}
        </svg>

        {/* Blocks */}
        {blocks.map(block => (
          <LessonBlock
            key={block.id}
            block={block}
            isSelected={selectedBlock === block.id}
            onMouseDown={(e) => handleMouseDown(e, block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center" style={{ zIndex: 50 }}>
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-2">AI is crafting your foundation blocks...</h3>
              <p className="text-slate-400">Creating the skeleton structure for your lesson plan</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
