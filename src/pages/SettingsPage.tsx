
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { User, School, GraduationCap, Users, Save } from "lucide-react";

export const SettingsPage = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    teacher_name: profile?.teacher_name || '',
    school_name: profile?.school_name || '',
    grade_level: profile?.grade_level || '',
    subject_specialization: profile?.subject_specialization || '',
    years_experience: profile?.years_experience?.toString() || '',
    student_count: profile?.student_count?.toString() || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...formData,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        student_count: formData.student_count ? parseInt(formData.student_count) : null
      });
      
      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and classroom preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teacher_name">Teacher Name</Label>
              <Input
                id="teacher_name"
                value={formData.teacher_name}
                onChange={(e) => setFormData(prev => ({ ...prev, teacher_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
                placeholder="Years teaching"
              />
            </div>
            <div>
              <Label htmlFor="subject_specialization">Subject Specialization</Label>
              <Input
                id="subject_specialization"
                value={formData.subject_specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, subject_specialization: e.target.value }))}
                placeholder="e.g., Mathematics, Science, English"
              />
            </div>
          </div>
        </Card>

        {/* School Information */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            School Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                value={formData.school_name}
                onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
                placeholder="Enter your school name"
              />
            </div>
            <div>
              <Label htmlFor="grade_level">Grade Level</Label>
              <Input
                id="grade_level"
                value={formData.grade_level}
                onChange={(e) => setFormData(prev => ({ ...prev, grade_level: e.target.value }))}
                placeholder="e.g., 5th Grade, High School"
              />
            </div>
            <div>
              <Label htmlFor="student_count">Number of Students</Label>
              <Input
                id="student_count"
                type="number"
                value={formData.student_count}
                onChange={(e) => setFormData(prev => ({ ...prev, student_count: e.target.value }))}
                placeholder="Total students in your classroom"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Separator />

      {/* Account Information */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Account Type:</span>
              <p className="font-medium capitalize">{profile?.user_type || 'Individual'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since:</span>
              <p className="font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          {profile?.organization_id && (
            <div>
              <span className="text-muted-foreground">Organization ID:</span>
              <p className="font-medium font-mono text-xs">{profile.organization_id}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
