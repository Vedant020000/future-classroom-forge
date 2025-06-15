
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface IndividualSignupProps {
  onBack: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  teacherName: string;
  gradeLevel: string;
  studentCount: number;
  subjectSpecialization: string;
  yearsExperience: number;
  schoolName: string;
}

export const IndividualSignup = ({ onBack }: IndividualSignupProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        if (data.password !== data.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }

        const profileData = {
          user_type: 'individual',
          teacher_name: data.teacherName,
          grade_level: data.gradeLevel,
          student_count: data.studentCount,
          subject_specialization: data.subjectSpecialization,
          years_experience: data.yearsExperience,
          school_name: data.schoolName,
        };

        const { error } = await signUp(data.email, data.password, profileData);
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google.",
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

      <Card className="p-8 bg-gray-900 border-gray-700">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Your Teacher Profile'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Set up your classroom information'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherName">Full Name</Label>
                  <Input
                    id="teacherName"
                    {...register('teacherName', { required: 'Name is required' })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  {errors.teacherName && <p className="text-red-400 text-sm">{errors.teacherName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      placeholder="e.g., 5th Grade, High School"
                      {...register('gradeLevel', { required: 'Grade level is required' })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {errors.gradeLevel && <p className="text-red-400 text-sm">{errors.gradeLevel.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students</Label>
                    <Input
                      id="studentCount"
                      type="number"
                      {...register('studentCount', { required: 'Student count is required', min: { value: 1, message: 'Must have at least 1 student' } })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {errors.studentCount && <p className="text-red-400 text-sm">{errors.studentCount.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectSpecialization">Subject Specialization</Label>
                  <Input
                    id="subjectSpecialization"
                    placeholder="e.g., Mathematics, English, Science"
                    {...register('subjectSpecialization', { required: 'Subject specialization is required' })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  {errors.subjectSpecialization && <p className="text-red-400 text-sm">{errors.subjectSpecialization.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      {...register('yearsExperience', { required: 'Years of experience is required', min: { value: 0, message: 'Cannot be negative' } })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {errors.yearsExperience && <p className="text-red-400 text-sm">{errors.yearsExperience.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      {...register('schoolName', { required: 'School name is required' })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {errors.schoolName && <p className="text-red-400 text-sm">{errors.schoolName.message}</p>}
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
