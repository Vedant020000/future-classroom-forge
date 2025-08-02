
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectType: (type: 'organization') => void;
  onBack?: () => void;
}

export const UserTypeSelection = ({ onSelectType, onBack }: UserTypeSelectionProps) => {
  useEffect(() => {
    onSelectType('organization');
  }, [onSelectType]);

  return (
    <div className="space-y-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Welcome to TheFuture Classroom</h2>
        <p className="text-gray-400">Continuing with organization login</p>
      </div>

      <div className="flex justify-center">
        <Card 
          className="p-6 border-2 border-purple-500 bg-purple-500/10"
        >
          <div className="text-center space-y-4">
            <Building2 className="h-12 w-12 text-purple-400 mx-auto" />
            <h3 className="text-xl font-semibold text-white">Organization Member</h3>
            <p className="text-gray-400 text-sm">
              For teachers who are part of a school or organization with a subscription
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Access organizational features</li>
              <li>• Shared resources and templates</li>
              <li>• School-wide analytics</li>
              <li>• Sign in with organization credentials</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
