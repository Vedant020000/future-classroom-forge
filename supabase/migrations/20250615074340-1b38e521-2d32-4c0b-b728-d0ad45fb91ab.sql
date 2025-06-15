
-- Create table for storing AI-generated classroom summaries
CREATE TABLE public.classroom_summaries (
  id TEXT NOT NULL PRIMARY KEY,
  summary TEXT NOT NULL,
  student_count INTEGER NOT NULL DEFAULT 0,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  student_data_hash TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to update updated_at column
CREATE TRIGGER update_classroom_summaries_updated_at
  BEFORE UPDATE ON public.classroom_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add Row Level Security (RLS)
ALTER TABLE public.classroom_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their classroom summaries
CREATE POLICY "Users can view classroom summaries" 
  ON public.classroom_summaries 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert classroom summaries
CREATE POLICY "Users can create classroom summaries" 
  ON public.classroom_summaries 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for authenticated users to update classroom summaries
CREATE POLICY "Users can update classroom summaries" 
  ON public.classroom_summaries 
  FOR UPDATE 
  USING (true);
