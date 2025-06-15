
-- Create lesson_plans table to store lesson plan metadata
CREATE TABLE public.lesson_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- duration in minutes
  file_path TEXT, -- path to the uploaded file in storage
  file_name TEXT, -- original file name
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'doc', 'xls')),
  file_size INTEGER, -- file size in bytes
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lesson_plans table
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for lesson_plans (teachers can only access their own lesson plans)
CREATE POLICY "Teachers can view their own lesson plans" 
  ON public.lesson_plans 
  FOR SELECT 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert their own lesson plans" 
  ON public.lesson_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own lesson plans" 
  ON public.lesson_plans 
  FOR UPDATE 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own lesson plans" 
  ON public.lesson_plans 
  FOR DELETE 
  USING (auth.uid() = teacher_id);

-- Create storage bucket for lesson plan files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lesson-plans', 'lesson-plans', false);

-- Storage policies for lesson-plans bucket
CREATE POLICY "Teachers can upload their own lesson plans" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'lesson-plans' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can view their own lesson plans" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'lesson-plans' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can update their own lesson plans" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'lesson-plans' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Teachers can delete their own lesson plans" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'lesson-plans' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add trigger for updated_at column
CREATE TRIGGER update_lesson_plans_updated_at 
    BEFORE UPDATE ON public.lesson_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
