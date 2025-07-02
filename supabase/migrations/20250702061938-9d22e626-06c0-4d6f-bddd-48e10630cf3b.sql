-- Enable the vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to pdf_knowledge_chunks table
ALTER TABLE public.pdf_knowledge_chunks 
ADD COLUMN embedding vector(1536);

-- Add index for vector similarity search
CREATE INDEX idx_pdf_knowledge_embedding 
ON public.pdf_knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);