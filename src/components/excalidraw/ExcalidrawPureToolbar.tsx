
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
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExcalidrawPureToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
}

export const ExcalidrawPureToolbar = ({ 
  selectedTool, 
  onToolChange, 
  onUndo,
  onRedo,
  onClear,
  onExport,
  onImport,
  strokeColor,
  fillColor,
  strokeWidth,
  onStrokeColorChange,
  onFillColorChange,
  onStrokeWidthChange
}: ExcalidrawPureToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const colors = ['#000000', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5', '#495057'];
  const strokeWidths = [1, 2, 4, 8];

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
                "h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                selectedTool === tool.id && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">Stroke:</span>
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded border-2 border-gray-300",
                strokeColor === color && "ring-2 ring-blue-500"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onStrokeColorChange(color)}
              title={`Stroke: ${color}`}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Fill Colors */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">Fill:</span>
          <button
            className={cn(
              "w-6 h-6 rounded border-2 border-gray-300 bg-white",
              fillColor === 'transparent' && "ring-2 ring-blue-500"
            )}
            onClick={() => onFillColorChange('transparent')}
            title="No fill"
          >
            <div className="w-full h-full bg-gradient-to-br from-transparent to-transparent relative">
              <div className="absolute inset-0 bg-red-500 transform rotate-45 w-px h-full left-1/2"></div>
            </div>
          </button>
          {colors.slice(1).map((color) => (
            <button
              key={`fill-${color}`}
              className={cn(
                "w-6 h-6 rounded border-2 border-gray-300",
                fillColor === color && "ring-2 ring-blue-500"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onFillColorChange(color)}
              title={`Fill: ${color}`}
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Stroke Width */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">Width:</span>
          {strokeWidths.map((width) => (
            <button
              key={width}
              className={cn(
                "w-6 h-6 rounded border-2 border-gray-300 bg-white flex items-center justify-center",
                strokeWidth === width && "ring-2 ring-blue-500"
              )}
              onClick={() => onStrokeWidthChange(width)}
              title={`Stroke width: ${width}px`}
            >
              <div 
                className="bg-black rounded-full"
                style={{ width: `${width}px`, height: `${width}px` }}
              />
            </button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onUndo}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onRedo}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onClear}
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
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onExport}
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
