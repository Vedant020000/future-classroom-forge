
import { Loader2, GraduationCap } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Preparing Virtual Classroom..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <GraduationCap className="h-16 w-16 text-primary mx-auto" />
          <Loader2 className="h-8 w-8 text-primary animate-spin absolute -bottom-2 -right-2" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">TheFuture Classroom</h2>
          <p className="text-gray-400">{message}</p>
        </div>
        
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};
