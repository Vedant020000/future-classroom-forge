
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Target,
  Lightbulb,
  CheckCircle,
  BookOpen,
  HelpCircle,
  Sparkles,
  Plus
} from "lucide-react";

interface BlockToolbarProps {
  onAddBlock: (type: 'center' | 'concept' | 'output' | 'activity' | 'vocabulary' | 'question' | 'custom') => void;
}

export const BlockToolbar = ({ onAddBlock }: BlockToolbarProps) => {
  const blockTypes = [
    { type: 'activity' as const, label: 'Activity', icon: BookOpen, color: 'from-orange-600 to-red-600' },
    { type: 'vocabulary' as const, label: 'Vocab', icon: BookOpen, color: 'from-yellow-600 to-orange-500' },
    { type: 'question' as const, label: 'Question', icon: HelpCircle, color: 'from-indigo-600 to-purple-600' },
    { type: 'custom' as const, label: 'Custom', icon: Sparkles, color: 'from-gray-600 to-slate-600' },
  ];

  return (
    <Card className="fixed top-20 left-6 bg-slate-800/90 border-slate-700 p-3 backdrop-blur-sm z-20">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-slate-400 mb-1">Add Blocks</div>
        {blockTypes.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            size="sm"
            variant="ghost"
            onClick={() => onAddBlock(type)}
            className="justify-start gap-2 text-slate-300 hover:bg-slate-700"
          >
            <div className={`w-3 h-3 rounded bg-gradient-to-r ${color}`} />
            <Icon className="h-3 w-3" />
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
