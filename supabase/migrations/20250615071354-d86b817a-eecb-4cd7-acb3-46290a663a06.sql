
-- Add organization lesson plans table
CREATE TABLE public.organization_lesson_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.organization_credentials(id) ON DELETE CASCADE,
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

-- Enable RLS on organization_lesson_plans table
ALTER TABLE public.organization_lesson_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization lesson plans (organization users can only access their org's lesson plans)
CREATE POLICY "Organization members can view their org's lesson plans" 
  ON public.organization_lesson_plans 
  FOR SELECT 
  USING (
    organization_id IN (
      SELECT oc.organization_id 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can insert their org's lesson plans" 
  ON public.organization_lesson_plans 
  FOR INSERT 
  WITH CHECK (
    organization_id IN (
      SELECT oc.organization_id 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can update their org's lesson plans" 
  ON public.organization_lesson_plans 
  FOR UPDATE 
  USING (
    organization_id IN (
      SELECT oc.organization_id 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can delete their org's lesson plans" 
  ON public.organization_lesson_plans 
  FOR DELETE 
  USING (
    organization_id IN (
      SELECT oc.organization_id 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

-- Add trigger for updated_at column
CREATE TRIGGER update_organization_lesson_plans_updated_at 
    BEFORE UPDATE ON public.organization_lesson_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for organization lesson plan files (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('organization-lesson-plans', 'organization-lesson-plans', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for organization-lesson-plans bucket
CREATE POLICY "Organization members can upload their org's lesson plans" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'organization-lesson-plans' AND 
    (storage.foldername(name))[1] IN (
      SELECT oc.organization_id::text 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can view their org's lesson plans" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'organization-lesson-plans' AND 
    (storage.foldername(name))[1] IN (
      SELECT oc.organization_id::text 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can update their org's lesson plans" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'organization-lesson-plans' AND 
    (storage.foldername(name))[1] IN (
      SELECT oc.organization_id::text 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );

CREATE POLICY "Organization members can delete their org's lesson plans" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'organization-lesson-plans' AND 
    (storage.foldername(name))[1] IN (
      SELECT oc.organization_id::text 
      FROM public.organization_credentials oc 
      WHERE oc.username = current_setting('app.current_user', true)
    )
  );
