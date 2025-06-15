
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OrganizationLoginProps {
  onBack: () => void;
}

interface FormData {
  username: string;
  password: string;
}

export const OrganizationLogin = ({ onBack }: OrganizationLoginProps) => {
  const [loading, setLoading] = useState(false);
  const { signInWithOrganization } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      const { error } = await signInWithOrganization(data.username, data.password);
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to account type
      </Button>

      <Card className="p-8 bg-gray-900 border-gray-700 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Building2 className="h-16 w-16 text-purple-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Organization Login</h2>
            <p className="text-gray-400">
              Sign in with your organization credentials
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <h3 className="text-sm font-medium text-white mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Username:</strong> teacher001</p>
              <p><strong>Password:</strong> password123</p>
              <p><strong>Organization:</strong> Springfield Elementary School</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username', { required: 'Username is required' })}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your organization username"
              />
              {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sign In to Organization
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            <p>Need help accessing your organization account?</p>
            <button className="text-purple-400 hover:text-purple-300">
              Contact your administrator
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
