
import { useState } from 'react';
import { UserTypeSelection } from '@/components/auth/UserTypeSelection';
import { OrganizationLogin } from '@/components/auth/OrganizationLogin';

type AuthStep = 'select-type' | 'organization';

export const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('select-type');

  const handleSelectType = (type: 'organization') => {
    setCurrentStep(type);
  };

  const handleBack = () => {
    setCurrentStep('select-type');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {currentStep === 'select-type' && (
          <UserTypeSelection onSelectType={handleSelectType} />
        )}
        
        {currentStep === 'organization' && (
          <OrganizationLogin onBack={handleBack} />
        )}
      </div>
    </div>
  );
};
