
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

    // Split PDF content into chunks
    const chunks = splitIntoChunks(pdfContent, filename, metadata);
    
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

function splitIntoChunks(content: string, source: string, metadata: any): PDFKnowledgeChunk[] {
  // Split by paragraphs and filter out short chunks
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 100);
  const chunks: PDFKnowledgeChunk[] = [];
  
  paragraphs.forEach((paragraph, index) => {
    // Further split very long paragraphs
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let currentChunk = '';
    let chunkIndex = 0;
    
    sentences.forEach(sentence => {
      if (currentChunk.length + sentence.length > 1000 && currentChunk.length > 0) {
        chunks.push({
          id: `${source.replace(/\.[^/.]+$/, '')}-chunk-${index}-${chunkIndex}`,
          content: currentChunk.trim(),
          metadata: {
            source,
            page: Math.floor(index / 3) + 1,
            category: metadata.category || 'general',
            subject: metadata.subject || 'all',
            gradeLevel: metadata.gradeLevel || 'all',
            uploadedAt: metadata.uploadedAt,
            fileSize: metadata.fileSize
          }
        });
        currentChunk = sentence.trim();
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence.trim();
      }
    });
    
    if (currentChunk.trim().length > 50) {
      chunks.push({
        id: `${source.replace(/\.[^/.]+$/, '')}-chunk-${index}-${chunkIndex}`,
        content: currentChunk.trim(),
        metadata: {
          source,
          page: Math.floor(index / 3) + 1,
          category: metadata.category || 'general',
          subject: metadata.subject || 'all',
          gradeLevel: metadata.gradeLevel || 'all',
          uploadedAt: metadata.uploadedAt,
          fileSize: metadata.fileSize
        }
      });
    }
  });
  
  return chunks;
}
