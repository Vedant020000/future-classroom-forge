
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

interface DrawingElement {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow' | 'draw' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  points?: { x: number; y: number }[];
  text?: string;
  strokeColor: string;
  strokeWidth: number;
}

interface ExcalidrawCanvasProps {
  lessonData: LessonData;
}

export const ExcalidrawCanvas = ({ lessonData }: ExcalidrawCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
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

  const addNewBlock = () => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: 'custom',
      title: 'New Block',
      content: '',
      x: Math.random() * 300 + 200,
      y: Math.random() * 200 + 200,
      width: 280,
      height: 160
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock.id);
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

  const handleMouseDown = (e: React.MouseEvent, blockId?: string) => {
    if (blockId && selectedTool === 'select') {
      setSelectedBlock(blockId);
      setIsDragging(true);
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        setDragOffset({
          x: e.clientX - block.x,
          y: e.clientY - block.y
        });
      }
      return;
    }

    if (selectedTool === 'select' && !blockId) {
      setIsPanning(true);
      setDragOffset({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (selectedTool === 'draw') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setCurrentPath([{ 
          x: e.clientX - rect.left - panOffset.x, 
          y: e.clientY - rect.top - panOffset.y 
        }]);
      }
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(selectedTool)) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - panOffset.x;
        const y = e.clientY - rect.top - panOffset.y;
        
        const newElement: DrawingElement = {
          id: `element-${Date.now()}`,
          type: selectedTool as any,
          x,
          y,
          width: 0,
          height: 0,
          strokeColor: '#ffffff',
          strokeWidth: 2
        };
        
        setDrawingElements(prev => [...prev, newElement]);
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedBlock && selectedTool === 'select') {
      updateBlock(selectedBlock, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isDrawing && selectedTool === 'draw' && currentPath.length > 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setCurrentPath(prev => [...prev, { 
          x: e.clientX - rect.left - panOffset.x, 
          y: e.clientY - rect.top - panOffset.y 
        }]);
      }
    } else if (isDrawing && ['rectangle', 'circle', 'line', 'arrow'].includes(selectedTool)) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && drawingElements.length > 0) {
        const lastElement = drawingElements[drawingElements.length - 1];
        const newWidth = e.clientX - rect.left - panOffset.x - lastElement.x;
        const newHeight = e.clientY - rect.top - panOffset.y - lastElement.y;
        
        setDrawingElements(prev => prev.map((el, index) => 
          index === prev.length - 1 
            ? { ...el, width: newWidth, height: newHeight }
            : el
        ));
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && selectedTool === 'draw' && currentPath.length > 1) {
      const newElement: DrawingElement = {
        id: `path-${Date.now()}`,
        type: 'draw',
        x: 0,
        y: 0,
        points: currentPath,
        strokeColor: '#ffffff',
        strokeWidth: 2
      };
      setDrawingElements(prev => [...prev, newElement]);
    }
    
    setIsDragging(false);
    setIsPanning(false);
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(null);
    }
  };

  const renderDrawingElements = () => {
    return drawingElements.map(element => {
      switch (element.type) {
        case 'rectangle':
          return (
            <rect
              key={element.id}
              x={element.x}
              y={element.y}
              width={Math.abs(element.width || 0)}
              height={Math.abs(element.height || 0)}
              fill="none"
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
            />
          );
        case 'circle':
          const radius = Math.abs(element.width || 0) / 2;
          return (
            <circle
              key={element.id}
              cx={element.x + radius}
              cy={element.y + radius}
              r={radius}
              fill="none"
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
            />
          );
        case 'line':
          return (
            <line
              key={element.id}
              x1={element.x}
              y1={element.y}
              x2={element.x + (element.width || 0)}
              y2={element.y + (element.height || 0)}
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
            />
          );
        case 'draw':
          if (!element.points || element.points.length < 2) return null;
          const pathData = element.points.reduce((path, point, index) => {
            return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
          }, '');
          return (
            <path
              key={element.id}
              d={pathData}
              fill="none"
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/create-lesson-plan')}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Setup
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">{lessonData.topic}</h1>
            <p className="text-sm text-gray-400">{lessonData.classroom} • {lessonData.date} • {lessonData.duration}</p>
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
        onUndo={() => {}}
        onRedo={() => {}}
        onClear={() => {
          setDrawingElements([]);
          setBlocks(blocks.filter(b => ['center', 'concepts', 'output'].includes(b.id)));
        }}
        onExport={() => toast({ title: "Export feature coming soon!" })}
        onImport={() => toast({ title: "Import feature coming soon!" })}
      />

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[calc(100vh-120px)] bg-gray-900 overflow-hidden cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      >
        {/* SVG Layer for Drawing */}
        <svg 
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ zIndex: 5 }}
        >
          {renderDrawingElements()}
          {/* Current drawing path */}
          {isDrawing && selectedTool === 'draw' && currentPath.length > 1 && (
            <path
              d={currentPath.reduce((path, point, index) => {
                return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
              }, '')}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {blocks.map(block => 
            block.connections?.map(targetId => {
              const target = blocks.find(b => b.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${block.id}-${targetId}`}
                  x1={block.x + block.width / 2 + panOffset.x}
                  y1={block.y + block.height / 2 + panOffset.y}
                  x2={target.x + target.width / 2 + panOffset.x}
                  y2={target.y + target.height / 2 + panOffset.y}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
              );
            })
          )}
        </svg>

        {/* Blocks */}
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            zIndex: 10
          }}
        >
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
        </div>

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center backdrop-blur-sm" style={{ zIndex: 100 }}>
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 text-center max-w-md">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">AI is crafting your foundation blocks...</h3>
              <p className="text-gray-400">Creating the perfect starting structure for your lesson plan</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
