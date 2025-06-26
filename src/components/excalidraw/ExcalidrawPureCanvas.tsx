
import { useState, useRef, useEffect } from "react";
import { ExcalidrawPureToolbar } from "./ExcalidrawPureToolbar";
import { useToast } from "@/hooks/use-toast";

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
  fillColor: string;
  strokeWidth: number;
}

export const ExcalidrawPureCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentStrokeColor, setCurrentStrokeColor] = useState('#000000');
  const [currentFillColor, setCurrentFillColor] = useState('transparent');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(2);
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - panOffset.x;
    const y = e.clientY - rect.top - panOffset.y;

    if (selectedTool === 'select') {
      setIsPanning(true);
      setDragOffset({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (selectedTool === 'draw') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(selectedTool)) {
      const newElement: DrawingElement = {
        id: `element-${Date.now()}`,
        type: selectedTool as any,
        x,
        y,
        width: 0,
        height: 0,
        strokeColor: currentStrokeColor,
        fillColor: currentFillColor,
        strokeWidth: currentStrokeWidth
      };
      
      setDrawingElements(prev => [...prev, newElement]);
      setIsDrawing(true);
    } else if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement: DrawingElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          x,
          y,
          text,
          strokeColor: currentStrokeColor,
          fillColor: currentFillColor,
          strokeWidth: currentStrokeWidth
        };
        setDrawingElements(prev => [...prev, newElement]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isDrawing && selectedTool === 'draw' && currentPath.length > 0) {
      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;
      setCurrentPath(prev => [...prev, { x, y }]);
    } else if (isDrawing && ['rectangle', 'circle', 'line', 'arrow'].includes(selectedTool)) {
      const x = e.clientX - rect.left - panOffset.x;
      const y = e.clientY - rect.top - panOffset.y;
      
      setDrawingElements(prev => prev.map((el, index) => 
        index === prev.length - 1 
          ? { ...el, width: x - el.x, height: y - el.y }
          : el
      ));
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
        strokeColor: currentStrokeColor,
        fillColor: currentFillColor,
        strokeWidth: currentStrokeWidth
      };
      setDrawingElements(prev => [...prev, newElement]);
    }
    
    setIsPanning(false);
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleUndo = () => {
    setDrawingElements(prev => prev.slice(0, -1));
    toast({ title: "Undone!" });
  };

  const handleRedo = () => {
    // Implement redo logic
    toast({ title: "Redo feature coming soon!" });
  };

  const handleClear = () => {
    setDrawingElements([]);
    toast({ title: "Canvas cleared!" });
  };

  const handleExport = () => {
    toast({ title: "Export feature coming soon!" });
  };

  const handleImport = () => {
    toast({ title: "Import feature coming soon!" });
  };

  const renderDrawingElements = () => {
    return drawingElements.map(element => {
      const commonProps = {
        key: element.id,
        stroke: element.strokeColor,
        strokeWidth: element.strokeWidth,
        fill: element.fillColor === 'transparent' ? 'none' : element.fillColor
      };

      switch (element.type) {
        case 'rectangle':
          return (
            <rect
              {...commonProps}
              x={element.x}
              y={element.y}
              width={Math.abs(element.width || 0)}
              height={Math.abs(element.height || 0)}
            />
          );
        case 'circle':
          const radius = Math.abs(element.width || 0) / 2;
          return (
            <circle
              {...commonProps}
              cx={element.x + radius}
              cy={element.y + radius}
              r={radius}
            />
          );
        case 'line':
          return (
            <line
              {...commonProps}
              x1={element.x}
              y1={element.y}
              x2={element.x + (element.width || 0)}
              y2={element.y + (element.height || 0)}
            />
          );
        case 'arrow':
          const arrowLength = Math.sqrt(Math.pow(element.width || 0, 2) + Math.pow(element.height || 0, 2));
          const arrowAngle = Math.atan2(element.height || 0, element.width || 0);
          const arrowHeadLength = 10;
          const arrowHeadAngle = Math.PI / 6;
          
          return (
            <g {...commonProps}>
              <line
                x1={element.x}
                y1={element.y}
                x2={element.x + (element.width || 0)}
                y2={element.y + (element.height || 0)}
              />
              <line
                x1={element.x + (element.width || 0)}
                y1={element.y + (element.height || 0)}
                x2={element.x + (element.width || 0) - arrowHeadLength * Math.cos(arrowAngle - arrowHeadAngle)}
                y2={element.y + (element.height || 0) - arrowHeadLength * Math.sin(arrowAngle - arrowHeadAngle)}
              />
              <line
                x1={element.x + (element.width || 0)}
                y1={element.y + (element.height || 0)}
                x2={element.x + (element.width || 0) - arrowHeadLength * Math.cos(arrowAngle + arrowHeadAngle)}
                y2={element.y + (element.height || 0) - arrowHeadLength * Math.sin(arrowAngle + arrowHeadAngle)}
              />
            </g>
          );
        case 'draw':
          if (!element.points || element.points.length < 2) return null;
          const pathData = element.points.reduce((path, point, index) => {
            return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
          }, '');
          return (
            <path
              {...commonProps}
              d={pathData}
              fill="none"
            />
          );
        case 'text':
          return (
            <text
              key={element.id}
              x={element.x}
              y={element.y}
              fill={element.strokeColor}
              fontSize={element.strokeWidth * 8}
              fontFamily="Arial, sans-serif"
            >
              {element.text}
            </text>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Toolbar */}
      <ExcalidrawPureToolbar 
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onExport={handleExport}
        onImport={handleImport}
        strokeColor={currentStrokeColor}
        fillColor={currentFillColor}
        strokeWidth={currentStrokeWidth}
        onStrokeColorChange={setCurrentStrokeColor}
        onFillColorChange={setCurrentFillColor}
        onStrokeWidthChange={setCurrentStrokeWidth}
      />

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[calc(100vh-80px)] bg-white overflow-hidden cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(0,0,0,0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      >
        {/* SVG Layer for Drawing */}
        <svg 
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            zIndex: 5 
          }}
        >
          {renderDrawingElements()}
          {/* Current drawing path */}
          {isDrawing && selectedTool === 'draw' && currentPath.length > 1 && (
            <path
              d={currentPath.reduce((path, point, index) => {
                return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
              }, '')}
              fill="none"
              stroke={currentStrokeColor}
              strokeWidth={currentStrokeWidth}
            />
          )}
        </svg>
      </div>
    </div>
  );
};
