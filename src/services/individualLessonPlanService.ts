
import { supabase } from '@/integrations/supabase/client';
import { LessonPlan, UploadLessonPlanData } from '@/types/lessonPlan';

export const individualLessonPlanService = {
  async fetchLessonPlans(userId: string): Promise<LessonPlan[]> {
    console.log('Fetching individual lesson plans for user:', userId);
    
    const { data, error } = await supabase
      .from('lesson_plans')
      .select('*')
      .eq('teacher_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lesson plans:', error);
      throw error;
    }
    return data as LessonPlan[];
  },

  async uploadLessonPlan(userId: string, uploadData: UploadLessonPlanData): Promise<LessonPlan> {
    const { file, title, subject, grade_level, description, duration } = uploadData;

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'xlsx', 'doc', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      throw new Error('Please upload a PDF, Word document, or Excel file only');
    }

    console.log('Uploading file:', file.name, 'for user:', userId);

    // Upload file to storage
    const fileName = `${userId}/${Date.now()}_${file.name}`;
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
        teacher_id: userId,
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

  async deleteLessonPlan(userId: string, lessonPlan: LessonPlan): Promise<void> {
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
      .eq('teacher_id', userId);

    if (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  },

  async getFileUrl(filePath: string): Promise<string | null> {
    console.log('Getting file URL for:', filePath);
    
    const { data, error } = await supabase.storage
      .from('lesson-plans')
      .createSignedUrl(filePath, 3600);
    
    if (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
    
    console.log('File URL generated:', data?.signedUrl);
    return data?.signedUrl || null;
  }
};
