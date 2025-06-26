
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pencil,
  Type,
  Image,
  Download,
  Upload,
  Undo,
  Redo,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExcalidrawToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onAddBlock: (type: 'activity' | 'vocabulary' | 'question' | 'custom') => void;
}

export const ExcalidrawToolbar = ({ selectedTool, onToolChange, onAddBlock }: ExcalidrawToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const blockTypes = [
    { type: 'activity' as const, label: 'Activity', color: 'bg-orange-500' },
    { type: 'vocabulary' as const, label: 'Vocab', color: 'bg-yellow-500' },
    { type: 'question' as const, label: 'Question', color: 'bg-purple-500' },
    { type: 'custom' as const, label: 'Custom', color: 'bg-gray-500' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2 flex items-center gap-1">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-700",
                selectedTool === tool.id && "bg-blue-100 text-blue-700 hover:bg-blue-200"
              )}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Lesson Blocks */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-gray-600 mr-2">Blocks:</span>
          {blockTypes.map(({ type, label, color }) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => onAddBlock(type)}
              className="h-8 px-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1"
              title={`Add ${label} Block`}
            >
              <div className={cn("w-2 h-2 rounded", color)} />
              {label}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-700"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-700"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-700"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Export/Import */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-700"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-700"
            title="Import"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
