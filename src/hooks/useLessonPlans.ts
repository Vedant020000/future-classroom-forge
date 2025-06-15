
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface LessonPlan {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  grade_level: string;
  description: string | null;
  duration: number | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useLessonPlans = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log('useLessonPlans - Current user:', user?.id);
  console.log('useLessonPlans - User profile:', profile);

  // Check if user is an organization user (has ID starting with "org_")
  const isOrganizationUser = user?.id?.startsWith('org_');

  const { data: lessonPlans = [], isLoading, error } = useQuery({
    queryKey: ['lesson-plans', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, throwing error');
        throw new Error('User not authenticated');
      }

      // If this is an organization user, return empty array since they don't have database records
      if (isOrganizationUser) {
        console.log('Organization user detected, returning empty lesson plans array');
        return [];
      }
      
      console.log('Fetching lesson plans for user:', user.id);
      
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Lesson plans query result:', { data, error });

      if (error) {
        console.error('Error fetching lesson plans:', error);
        throw error;
      }
      return data as LessonPlan[];
    },
    enabled: !!user,
  });

  const uploadLessonPlan = useMutation({
    mutationFn: async ({ 
      file, 
      title, 
      subject, 
      grade_level, 
      description, 
      duration 
    }: {
      file: File;
      title: string;
      subject: string;
      grade_level: string;
      description?: string;
      duration?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Prevent organization users from uploading
      if (isOrganizationUser) {
        throw new Error('Organization users cannot upload lesson plans');
      }

      // Validate file type
      const allowedTypes = ['pdf', 'docx', 'xlsx', 'doc', 'xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        throw new Error('Please upload a PDF, Word document, or Excel file only');
      }

      console.log('Uploading file:', file.name, 'for user:', user.id);

      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lesson-plans')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Create lesson plan record
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          teacher_id: user.id,
          title,
          subject,
          grade_level,
          description,
          duration,
          file_path: uploadData.path,
          file_name: file.name,
          file_type: fileExtension,
          file_size: file.size,
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Lesson plan created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-plans', user?.id] });
      toast({
        title: "Success",
        description: "Lesson plan uploaded successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Upload mutation error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload lesson plan",
        variant: "destructive",
      });
    },
  });

  const deleteLessonPlan = useMutation({
    mutationFn: async (lessonPlan: LessonPlan) => {
      if (!user) throw new Error('User not authenticated');

      // Prevent organization users from deleting
      if (isOrganizationUser) {
        throw new Error('Organization users cannot delete lesson plans');
      }

      console.log('Deleting lesson plan:', lessonPlan.id);

      // Delete file from storage if it exists
      if (lessonPlan.file_path) {
        const { error: storageError } = await supabase.storage
          .from('lesson-plans')
          .remove([lessonPlan.file_path]);
        
        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      // Delete lesson plan record
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', lessonPlan.id)
        .eq('teacher_id', user.id); // Ensure user can only delete their own plans

      if (error) {
        console.error('Database delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-plans', user?.id] });
      toast({
        title: "Success",
        description: "Lesson plan deleted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete lesson plan",
        variant: "destructive",
      });
    },
  });

  const getFileUrl = async (filePath: string) => {
    if (!user || isOrganizationUser) return null;
    
    console.log('Getting file URL for:', filePath);
    
    const { data, error } = await supabase.storage
      .from('lesson-plans')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
    
    console.log('File URL generated:', data?.signedUrl);
    return data?.signedUrl;
  };

  return {
    lessonPlans,
    isLoading,
    error,
    uploadLessonPlan,
    deleteLessonPlan,
    getFileUrl,
    isOrganizationUser,
  };
};
