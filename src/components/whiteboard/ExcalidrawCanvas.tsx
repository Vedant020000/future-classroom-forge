
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExcalidrawToolbar } from "./ExcalidrawToolbar";
import { ExcalidrawBlock } from "./ExcalidrawBlock";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface ExcalidrawCanvasProps {
  lessonData: LessonData;
}

export const ExcalidrawCanvas = ({ lessonData }: ExcalidrawCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
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
        title: 'Main Focus',
        content: '',
        x: 400,
        y: 200,
        width: 320,
        height: 180,
        isLoading: true
      },
      {
        id: 'concepts',
        type: 'concept',
        title: 'Key Concepts',
        content: '',
        x: 100,
        y: 120,
        width: 280,
        height: 160,
        isLoading: true
      },
      {
        id: 'output',
        type: 'output',
        title: 'Learning Outcome',
        content: '',
        x: 750,
        y: 150,
        width: 300,
        height: 170,
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
        title: "Foundation blocks generated! ✨",
        description: "Your AI-powered lesson structure is ready. Start building!",
      });
    }, 3000);
  }, [lessonData, toast]);

  const generateInitialContent = (blockType: Block['type'], data: LessonData): string => {
    switch (blockType) {
      case 'center':
        return `Why is understanding ${data.topic} important for students in today's world?`;
      case 'concept':
        return `Key concepts: Critical thinking, Historical context, Social justice, Making inferences, Understanding bias`;
      case 'output':
        return `Students will be able to articulate what ${data.topic} means in their community through a reflective exit slip`;
      default:
        return 'AI-generated content ready for editing';
    }
  };

  const addNewBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      title: getBlockTitle(type),
      content: '',
      x: Math.random() * 300 + 200,
      y: Math.random() * 200 + 200,
      width: 280,
      height: 160
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
    if (selectedTool !== 'select') return;
    
    setSelectedBlock(blockId);
    setIsDragging(true);
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setDragOffset({
        x: e.clientX - block.x,
        y: e.clientY - block.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedBlock && selectedTool === 'select') {
      updateBlock(selectedBlock, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/create-lesson-plan')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Setup
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{lessonData.topic}</h1>
            <p className="text-sm text-gray-500">{lessonData.classroom} • {lessonData.date} • {lessonData.duration}</p>
          </div>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Lesson Plan
        </Button>
      </div>

      {/* Toolbar */}
      <ExcalidrawToolbar 
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onAddBlock={addNewBlock}
      />

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[calc(100vh-120px)] bg-white overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(0,0,0,0.05) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Connection Lines */}
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
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
              );
            })
          )}
        </svg>

        {/* Blocks */}
        {blocks.map(block => (
          <ExcalidrawBlock
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
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm" style={{ zIndex: 100 }}>
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center max-w-md">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is crafting your foundation blocks...</h3>
              <p className="text-gray-600">Creating the perfect starting structure for your lesson plan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
