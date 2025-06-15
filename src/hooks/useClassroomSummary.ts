
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClassroomSummary {
  id: string;
  summary: string;
  student_count: number;
  generated_at: string;
  student_data_hash: string;
}

export const useClassroomSummary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['classroom-summary'],
    queryFn: async () => {
      console.log('Fetching classroom summary...');
      
      const { data, error } = await supabase
        .from('classroom_summaries')
        .select('*')
        .eq('id', 'main-classroom')
        .maybeSingle();

      if (error) {
        console.error('Error fetching classroom summary:', error);
        throw error;
      }
      
      return data as ClassroomSummary | null;
    },
  });

  const generateSummary = useMutation({
    mutationFn: async () => {
      console.log('Generating new classroom summary...');
      
      const { data, error } = await supabase.functions.invoke('analyze-students', {
        body: {}
      });

      if (error) {
        console.error('Error calling analyze-students function:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroom-summary'] });
      toast({
        title: "Success",
        description: "Classroom summary generated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Generate summary error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate classroom summary",
        variant: "destructive",
      });
    },
  });

  return {
    summary,
    isLoading,
    error,
    generateSummary: generateSummary.mutate,
    isGenerating: generateSummary.isPending,
  };
};
