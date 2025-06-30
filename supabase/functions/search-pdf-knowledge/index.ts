
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchResult {
  id: string;
  content: string;
  source: string;
  relevanceScore: number;
  metadata: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, subject, gradeLevel, limit = 5 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the search query
    let searchQuery = supabase
      .from('pdf_knowledge_chunks')
      .select('*');

    // Add text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ').join(' | ');
      searchQuery = searchQuery.textSearch('content', searchTerms);
    }

    // Add metadata filters
    const filters = [];
    if (subject && subject !== 'all') {
      filters.push(`metadata->>'subject'.eq.${subject}`);
      filters.push(`metadata->>'subject'.eq.all`);
    }
    
    if (gradeLevel && gradeLevel !== 'all') {
      filters.push(`metadata->>'gradeLevel'.eq.${gradeLevel}`);
      filters.push(`metadata->>'gradeLevel'.eq.all`);
    }

    if (filters.length > 0) {
      searchQuery = searchQuery.or(filters.join(','));
    }

    const { data: chunks, error } = await searchQuery.limit(limit * 3);

    if (error) {
      throw error;
    }

    // Score and rank results
    const scoredResults = scoreSearchResults(chunks || [], query);
    const topResults = scoredResults.slice(0, limit);

    console.log(`Found ${topResults.length} relevant knowledge chunks for query: "${query}"`);

    return new Response(JSON.stringify({ 
      results: topResults,
      totalFound: chunks?.length || 0
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

function scoreSearchResults(chunks: any[], query: string): SearchResult[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  return chunks.map(chunk => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    
    // Keyword matching with different weights
    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = contentLower.match(regex) || [];
      score += matches.length * 3;
      
      // Partial matches
      if (contentLower.includes(word)) {
        score += 1;
      }
    });
    
    // Boost for educational terms
    const educationalTerms = [
      'learning', 'teaching', 'student', 'assessment', 'engagement', 'strategy',
      'pedagogy', 'curriculum', 'instruction', 'classroom', 'education'
    ];
    educationalTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 2;
      }
    });
    
    // Boost for methodology terms
    const methodTerms = [
      'method', 'approach', 'technique', 'practice', 'framework', 'model'
    ];
    methodTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 1;
      }
    });
    
    return {
      id: chunk.id,
      content: chunk.content,
      source: chunk.metadata.source,
      relevanceScore: score,
      metadata: chunk.metadata
    };
  })
  .filter(result => result.relevanceScore > 0)
  .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
