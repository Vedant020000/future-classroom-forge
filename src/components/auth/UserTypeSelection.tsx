
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, User, ArrowLeft } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectType: (type: 'individual' | 'organization') => void;
  onBack?: () => void;
}

export const UserTypeSelection = ({ onSelectType, onBack }: UserTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'organization' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelectType(selectedType);
    }
  };

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
        <p className="text-gray-400">Choose your account type to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className={`p-6 cursor-pointer transition-all border-2 ${
            selectedType === 'individual' 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-700 bg-gray-900 hover:border-gray-600'
          }`}
          onClick={() => setSelectedType('individual')}
        >
          <div className="text-center space-y-4">
            <User className="h-12 w-12 text-purple-400 mx-auto" />
            <h3 className="text-xl font-semibold text-white">Individual Teacher</h3>
            <p className="text-gray-400 text-sm">
              Perfect for independent educators who want to manage their own classroom
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Set up your classroom profile</li>
              <li>• Track individual students</li>
              <li>• Create personalized lesson plans</li>
              <li>• Sign in with Google or email</li>
            </ul>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer transition-all border-2 ${
            selectedType === 'organization' 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-700 bg-gray-900 hover:border-gray-600'
          }`}
          onClick={() => setSelectedType('organization')}
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

      {selectedType && (
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Continue as {selectedType === 'individual' ? 'Individual Teacher' : 'Organization Member'}
          </Button>
        </div>
      )}
    </div>
  );
};
