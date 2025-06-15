
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface LessonPlanSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const LessonPlanSearch = ({ searchTerm, onSearchChange }: LessonPlanSearchProps) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lesson plans..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>
      <Button variant="outline" className="border-border">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};
