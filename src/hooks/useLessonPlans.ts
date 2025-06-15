
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
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessonPlans = [], isLoading, error } = useQuery({
    queryKey: ['lesson-plans', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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

      // Validate file type
      const allowedTypes = ['pdf', 'docx', 'xlsx', 'doc', 'xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        throw new Error('Please upload a PDF, Word document, or Excel file only');
      }

      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lesson-plans')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

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

      if (error) throw error;
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

      // Delete file from storage if it exists
      if (lessonPlan.file_path) {
        await supabase.storage
          .from('lesson-plans')
          .remove([lessonPlan.file_path]);
      }

      // Delete lesson plan record
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', lessonPlan.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-plans', user?.id] });
      toast({
        title: "Success",
        description: "Lesson plan deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete lesson plan",
        variant: "destructive",
      });
    },
  });

  const getFileUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('lesson-plans')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    return data?.signedUrl;
  };

  return {
    lessonPlans,
    isLoading,
    error,
    uploadLessonPlan,
    deleteLessonPlan,
    getFileUrl,
  };
};
