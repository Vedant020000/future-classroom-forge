
import { supabase } from '@/integrations/supabase/client';
import { OrganizationLessonPlan, UploadLessonPlanData } from '@/types/lessonPlan';

export const organizationLessonPlanService = {
  async fetchLessonPlans(teacherId: string, organizationId: string): Promise<OrganizationLessonPlan[]> {
    console.log('Fetching organization lesson plans for teacher:', teacherId, 'org:', organizationId);
    
    const { data, error } = await supabase
      .from('organization_lesson_plans')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching organization lesson plans:', error);
      throw error;
    }
    return data as OrganizationLessonPlan[];
  },

  async uploadLessonPlan(
    teacherId: string, 
    organizationId: string, 
    uploadData: UploadLessonPlanData
  ): Promise<OrganizationLessonPlan> {
    const { file, title, subject, grade_level, description, duration } = uploadData;

    // Validate file type
    const allowedTypes = ['pdf', 'docx', 'xlsx', 'doc', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      throw new Error('Please upload a PDF, Word document, or Excel file only');
    }

    console.log('Uploading organization file:', file.name, 'for teacher:', teacherId);

    // Upload file to organization storage
    const fileName = `${organizationId}/${Date.now()}_${file.name}`;
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('organization-lesson-plans')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Organization storage upload error:', uploadError);
      throw uploadError;
    }

    console.log('Organization file uploaded successfully:', storageData);

    // Create organization lesson plan record
    const { data, error } = await supabase
      .from('organization_lesson_plans')
      .insert({
        organization_id: organizationId,
        teacher_id: teacherId,
        title,
        subject,
        grade_level,
        description,
        duration,
        file_path: storageData.path,
        file_name: file.name,
        file_type: fileExtension,
        file_size: file.size,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Organization database insert error:', error);
      throw error;
    }

    console.log('Organization lesson plan created:', data);
    return data;
  },

  async deleteLessonPlan(teacherId: string, lessonPlan: OrganizationLessonPlan): Promise<void> {
    console.log('Deleting organization lesson plan:', lessonPlan.id);

    // Delete file from organization storage if it exists
    if (lessonPlan.file_path) {
      const { error: storageError } = await supabase.storage
        .from('organization-lesson-plans')
        .remove([lessonPlan.file_path]);
      
      if (storageError) {
        console.error('Organization storage delete error:', storageError);
      }
    }

    // Delete organization lesson plan record
    const { error } = await supabase
      .from('organization_lesson_plans')
      .delete()
      .eq('id', lessonPlan.id)
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Organization database delete error:', error);
      throw error;
    }
  },

  async getFileUrl(filePath: string): Promise<string | null> {
    console.log('Getting organization file URL for:', filePath);
    
    const { data, error } = await supabase.storage
      .from('organization-lesson-plans')
      .createSignedUrl(filePath, 3600);
    
    if (error) {
      console.error('Error getting organization file URL:', error);
      return null;
    }
    
    console.log('Organization file URL generated:', data?.signedUrl);
    return data?.signedUrl || null;
  }
};
