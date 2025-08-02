import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
    const { query, subject, gradeLevel, limit = 5 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'pdf_knowledge_chunks',
      queryName: 'match_documents',
    });

    const retriever = vectorStore.asRetriever(limit, {
      subject: subject === 'all' ? undefined : subject,
      gradeLevel: gradeLevel === 'all' ? undefined : gradeLevel,
    });

    const results = await retriever.getRelevantDocuments(query);

    return new Response(JSON.stringify({ 
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error searching PDF knowledge:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
