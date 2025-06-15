
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LessonPlan, OrganizationLessonPlan, UploadLessonPlanData } from '@/types/lessonPlan';
import { individualLessonPlanService } from '@/services/individualLessonPlanService';
import { organizationLessonPlanService } from '@/services/organizationLessonPlanService';

export const useLessonPlans = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log('useLessonPlans - Current user:', user?.id);
  console.log('useLessonPlans - User profile:', profile);

  const isOrganizationUser = user?.id?.startsWith('org_');
  const organizationId = profile?.organization_id;

  const { data: lessonPlans = [], isLoading, error } = useQuery({
    queryKey: ['lesson-plans', user?.id, isOrganizationUser],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, throwing error');
        throw new Error('User not authenticated');
      }

      if (isOrganizationUser && organizationId) {
        return await organizationLessonPlanService.fetchLessonPlans(user.id, organizationId);
      } else if (!isOrganizationUser) {
        return await individualLessonPlanService.fetchLessonPlans(user.id);
      }
      
      return [];
    },
    enabled: !!user,
  });

  const uploadLessonPlan = useMutation({
    mutationFn: async (uploadData: UploadLessonPlanData) => {
      if (!user) throw new Error('User not authenticated');

      if (isOrganizationUser && organizationId) {
        return await organizationLessonPlanService.uploadLessonPlan(user.id, organizationId, uploadData);
      } else if (!isOrganizationUser) {
        return await individualLessonPlanService.uploadLessonPlan(user.id, uploadData);
      }
      
      throw new Error('Unable to determine user type for upload');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-plans', user?.id, isOrganizationUser] });
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
    mutationFn: async (lessonPlan: LessonPlan | OrganizationLessonPlan) => {
      if (!user) throw new Error('User not authenticated');

      if (isOrganizationUser) {
        await organizationLessonPlanService.deleteLessonPlan(user.id, lessonPlan as OrganizationLessonPlan);
      } else {
        await individualLessonPlanService.deleteLessonPlan(user.id, lessonPlan as LessonPlan);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-plans', user?.id, isOrganizationUser] });
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
    if (!user) return null;
    
    if (isOrganizationUser) {
      return await organizationLessonPlanService.getFileUrl(filePath);
    } else {
      return await individualLessonPlanService.getFileUrl(filePath);
    }
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

export type { LessonPlan };
