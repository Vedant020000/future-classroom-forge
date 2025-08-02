import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Document } from "https://esm.sh/langchain/document";
import { RecursiveCharacterTextSplitter } from 'https://esm.sh/langchain/text_splitter';
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai';
import { SupabaseVectorStore } from 'https://esm.sh/@langchain/community/vectorstores/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, filename, metadata } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
      separators: ["\n\n", "\n", ". ", " "],
    });

    const doc = new Document({
      pageContent: pdfContent,
      metadata: {
        source: filename,
        ...metadata,
      },
    });

    const chunks = await splitter.splitDocuments([doc]);

    await SupabaseVectorStore.fromDocuments(chunks, embeddings, {
      client: supabase,
      tableName: 'pdf_knowledge_chunks',
      queryName: 'match_documents',
    });

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
