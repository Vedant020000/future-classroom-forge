
-- Create a table for students
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  academic_level TEXT NOT NULL CHECK (academic_level IN ('Advanced', 'Grade Level', 'Below Grade')),
  behavior TEXT NOT NULL CHECK (behavior IN ('Excellent', 'Good', 'Needs Support')),
  engagement TEXT NOT NULL CHECK (engagement IN ('High', 'Medium', 'Low')),
  learning_style TEXT NOT NULL CHECK (learning_style IN ('Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing')),
  notes TEXT,
  subjects TEXT[], -- Array of subjects
  avatar TEXT, -- Store initials or avatar identifier
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - for now we'll make it public since there's no authentication yet
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations for now (since no auth is implemented)
CREATE POLICY "Allow all operations on students" 
  ON public.students 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create an index on name for faster searches
CREATE INDEX idx_students_name ON public.students(name);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
