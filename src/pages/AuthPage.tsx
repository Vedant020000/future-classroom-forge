
import { useState } from 'react';
import { UserTypeSelection } from '@/components/auth/UserTypeSelection';
import { IndividualSignup } from '@/components/auth/IndividualSignup';
import { OrganizationLogin } from '@/components/auth/OrganizationLogin';

type AuthStep = 'select-type' | 'individual' | 'organization';

export const AuthPage = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('select-type');

  const handleSelectType = (type: 'individual' | 'organization') => {
    setCurrentStep(type);
  };

  const handleBack = () => {
    setCurrentStep('select-type');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {currentStep === 'select-type' && (
          <UserTypeSelection onSelectType={handleSelectType} />
        )}
        
        {currentStep === 'individual' && (
          <IndividualSignup onBack={handleBack} />
        )}
        
        {currentStep === 'organization' && (
          <OrganizationLogin onBack={handleBack} />
        )}
      </div>
    </div>
  );
};
