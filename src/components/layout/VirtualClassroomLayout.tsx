
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface VirtualClassroomLayoutProps {
  children: React.ReactNode;
}

export const VirtualClassroomLayout = ({ children }: VirtualClassroomLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline" className="bg-black/50 border-primary/30 hover:bg-primary/20 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      {/* Main content */}
      <div className="w-full h-screen">
        {children}
      </div>
    </div>
  );
};
