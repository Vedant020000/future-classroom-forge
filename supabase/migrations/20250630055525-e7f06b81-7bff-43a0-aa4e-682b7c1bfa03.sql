
-- Create table for storing PDF knowledge chunks
CREATE TABLE public.pdf_knowledge_chunks (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better search performance
CREATE INDEX idx_pdf_knowledge_content ON public.pdf_knowledge_chunks USING gin(to_tsvector('english', content));
CREATE INDEX idx_pdf_knowledge_metadata ON public.pdf_knowledge_chunks USING gin(metadata);
CREATE INDEX idx_pdf_knowledge_source ON public.pdf_knowledge_chunks ((metadata->>'source'));
CREATE INDEX idx_pdf_knowledge_subject ON public.pdf_knowledge_chunks ((metadata->>'subject'));
CREATE INDEX idx_pdf_knowledge_grade ON public.pdf_knowledge_chunks ((metadata->>'gradeLevel'));

-- Enable Row Level Security
ALTER TABLE public.pdf_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read knowledge chunks
CREATE POLICY "Allow authenticated users to read PDF knowledge" 
  ON public.pdf_knowledge_chunks 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to insert knowledge chunks
CREATE POLICY "Allow authenticated users to insert PDF knowledge" 
  ON public.pdf_knowledge_chunks 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Add trigger to update updated_at column
CREATE TRIGGER update_pdf_knowledge_chunks_updated_at
  BEFORE UPDATE ON public.pdf_knowledge_chunks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
