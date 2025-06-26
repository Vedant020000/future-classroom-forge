
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
  Download,
  Upload,
  Undo,
  Redo,
  Trash2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExcalidrawToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onAddBlock: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const ExcalidrawToolbar = ({ 
  selectedTool, 
  onToolChange, 
  onAddBlock,
  onUndo,
  onRedo,
  onClear,
  onExport,
  onImport
}: ExcalidrawToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 flex items-center gap-1">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
                selectedTool === tool.id && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-600" />

        {/* Add Block */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddBlock}
          className="text-gray-300 hover:text-white hover:bg-gray-700 px-3"
          title="Add Block"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Block
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-600" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onUndo}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onRedo}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onClear}
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-600" />

        {/* Export/Import */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onExport}
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={onImport}
            title="Import"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
