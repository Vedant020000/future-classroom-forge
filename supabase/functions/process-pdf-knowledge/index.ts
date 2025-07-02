
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDFKnowledgeChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    page: number;
    category?: string;
    subject?: string;
    gradeLevel?: string;
    uploadedAt: string;
    fileSize: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, filename, metadata } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Split PDF content into chunks with embeddings
    const chunks = await splitIntoChunks(pdfContent, filename, metadata);
    
    // Store chunks in database
    const { data, error } = await supabase
      .from('pdf_knowledge_chunks')
      .insert(chunks);

    if (error) {
      throw error;
    }

    console.log(`Processed ${chunks.length} chunks from ${filename}`);

    return new Response(JSON.stringify({ 
      success: true, 
      chunksProcessed: chunks.length,
      message: `Successfully processed ${filename} into knowledge base`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process PDF for knowledge base'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function splitIntoChunks(content: string, source: string, metadata: any): Promise<PDFKnowledgeChunk[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  // Clean and preprocess content
  const cleanedContent = content
    .replace(/\n\s*\n+/g, '\n\n') // Normalize line breaks
    .replace(/[\r\f\v]/g, '') // Remove other whitespace chars
    .replace(/^\s*---.*?---\s*/gm, '') // Remove page markers
    .trim();

  // Split into paragraphs and filter meaningful content
  const paragraphs = cleanedContent
    .split(/\n\s*\n/)
    .filter(p => {
      const trimmed = p.trim();
      return trimmed.length > 100 && 
             !/^(page \d+|chapter \d+|\d+)$/i.test(trimmed) &&
             !/^(table of contents|index|bibliography|references)$/i.test(trimmed);
    });

  const chunks: PDFKnowledgeChunk[] = [];
  const textsForEmbedding: string[] = [];
  
  paragraphs.forEach((paragraph, paragraphIndex) => {
    // Split by sentences more intelligently
    const sentences = paragraph
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter(s => s.trim().length > 30);
    
    let currentChunk = '';
    let chunkIndex = 0;
    
    const processChunk = (chunkContent: string) => {
      if (chunkContent.trim().length < 100) return;
      
      const chunkId = `${source.replace(/\.[^/.]+$/, '')}-${paragraphIndex}-${chunkIndex}`;
      const chunk: PDFKnowledgeChunk = {
        id: chunkId,
        content: chunkContent.trim(),
        metadata: {
          source,
          page: Math.floor(paragraphIndex / 5) + 1,
          category: metadata.category || 'general',
          subject: metadata.subject || 'all',
          gradeLevel: metadata.gradeLevel || 'all',
          uploadedAt: metadata.uploadedAt,
          fileSize: metadata.fileSize,
          chunkIndex: chunks.length
        }
      };
      
      chunks.push(chunk);
      textsForEmbedding.push(chunkContent.trim());
    };

    sentences.forEach(sentence => {
      const sentenceLength = sentence.length;
      
      // If adding this sentence would exceed chunk size and we have content
      if (currentChunk.length + sentenceLength > 800 && currentChunk.length > 200) {
        processChunk(currentChunk);
        currentChunk = sentence.trim();
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence.trim();
      }
    });
    
    // Process the last chunk if it has meaningful content
    if (currentChunk.trim().length > 100) {
      processChunk(currentChunk);
    }
  });

  // Generate embeddings for all chunks
  if (textsForEmbedding.length > 0) {
    try {
      console.log(`Generating embeddings for ${textsForEmbedding.length} chunks...`);
      
      const embeddingResponse = await fetch(`${supabaseUrl}/functions/v1/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: textsForEmbedding,
          model: 'text-embedding-3-small'
        }),
      });

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json();
        
        // Add embeddings to chunks
        embeddingData.embeddings.forEach((embeddingItem: any, index: number) => {
          if (chunks[index]) {
            chunks[index].metadata.embedding = embeddingItem.embedding;
          }
        });
        
        console.log(`Successfully generated embeddings for ${embeddingData.embeddings.length} chunks`);
      } else {
        console.warn('Failed to generate embeddings, proceeding without them');
      }
    } catch (error) {
      console.warn('Error generating embeddings:', error);
    }
  }
  
  return chunks;
}
