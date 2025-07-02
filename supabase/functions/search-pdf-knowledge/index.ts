
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
    const { query, subject, gradeLevel, limit = 5, useSemanticSearch = true } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let allResults: any[] = [];

    // Semantic search using embeddings
    if (useSemanticSearch && query.trim()) {
      try {
        console.log('Performing semantic search...');
        
        // Generate embedding for the query
        const embeddingResponse = await fetch(`${supabaseUrl}/functions/v1/generate-embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: [query],
            model: 'text-embedding-3-small'
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          const queryEmbedding = embeddingData.embeddings[0].embedding;

          // Get all chunks with embeddings for similarity calculation
          let semanticQuery = supabase
            .from('pdf_knowledge_chunks')
            .select('*')
            .not('metadata->embedding', 'is', null);

          // Apply filters
          if (subject && subject !== 'all') {
            semanticQuery = semanticQuery.or(`metadata->>'subject'.eq.${subject},metadata->>'subject'.eq.all`);
          }
          
          if (gradeLevel && gradeLevel !== 'all') {
            semanticQuery = semanticQuery.or(`metadata->>'gradeLevel'.eq.${gradeLevel},metadata->>'gradeLevel'.eq.all`);
          }

          const { data: chunks, error } = await semanticQuery.limit(200);
          
          if (!error && chunks) {
            // Calculate cosine similarity
            const similarities = chunks.map(chunk => {
              const embedding = chunk.metadata.embedding;
              if (!embedding) return { ...chunk, similarity: 0 };
              
              const similarity = cosineSimilarity(queryEmbedding, embedding);
              return { ...chunk, similarity };
            });

            // Sort by similarity and take top results
            const topSemantic = similarities
              .sort((a, b) => b.similarity - a.similarity)
              .slice(0, Math.ceil(limit * 0.7)); // 70% semantic results

            allResults.push(...topSemantic.map(item => ({
              id: item.id,
              content: item.content,
              source: item.metadata.source,
              relevanceScore: item.similarity * 100,
              metadata: item.metadata,
              searchType: 'semantic'
            })));
          }
        }
      } catch (semanticError) {
        console.warn('Semantic search failed, falling back to keyword search:', semanticError);
      }
    }

    // Keyword search fallback/supplement
    let keywordQuery = supabase
      .from('pdf_knowledge_chunks')
      .select('*');

    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ').join(' | ');
      keywordQuery = keywordQuery.textSearch('content', searchTerms);
    }

    // Apply filters
    if (subject && subject !== 'all') {
      keywordQuery = keywordQuery.or(`metadata->>'subject'.eq.${subject},metadata->>'subject'.eq.all`);
    }
    
    if (gradeLevel && gradeLevel !== 'all') {
      keywordQuery = keywordQuery.or(`metadata->>'gradeLevel'.eq.${gradeLevel},metadata->>'gradeLevel'.eq.all`);
    }

    const { data: keywordChunks, error: keywordError } = await keywordQuery.limit(limit * 2);

    if (!keywordError && keywordChunks) {
      const keywordResults = scoreSearchResults(keywordChunks, query);
      const topKeyword = keywordResults.slice(0, Math.ceil(limit * 0.3)); // 30% keyword results
      
      allResults.push(...topKeyword.map(item => ({
        ...item,
        searchType: 'keyword'
      })));
    }

    // Remove duplicates and rank final results
    const uniqueResults = removeDuplicates(allResults);
    const finalResults = uniqueResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    console.log(`Found ${finalResults.length} relevant knowledge chunks for query: "${query}"`);
    console.log(`Search breakdown: ${finalResults.filter(r => r.searchType === 'semantic').length} semantic, ${finalResults.filter(r => r.searchType === 'keyword').length} keyword`);

    return new Response(JSON.stringify({ 
      results: finalResults,
      totalFound: allResults.length,
      searchTypes: {
        semantic: finalResults.filter(r => r.searchType === 'semantic').length,
        keyword: finalResults.filter(r => r.searchType === 'keyword').length
      }
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

// Utility functions
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

function removeDuplicates(results: any[]): any[] {
  const seen = new Set();
  return results.filter(result => {
    if (seen.has(result.id)) return false;
    seen.add(result.id);
    return true;
  });
}

function scoreSearchResults(chunks: any[], query: string): SearchResult[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  return chunks.map(chunk => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    
    // Keyword matching with different weights
    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = contentLower.match(regex) || [];
      score += matches.length * 5; // Increased weight for exact matches
      
      // Partial matches
      if (contentLower.includes(word)) {
        score += 2;
      }
      
      // Proximity scoring - bonus for words appearing near each other
      const wordIndex = contentLower.indexOf(word);
      if (wordIndex !== -1) {
        queryWords.forEach(otherWord => {
          if (word !== otherWord) {
            const otherIndex = contentLower.indexOf(otherWord, wordIndex - 50);
            if (otherIndex !== -1 && Math.abs(wordIndex - otherIndex) < 100) {
              score += 3; // Proximity bonus
            }
          }
        });
      }
    });
    
    // Boost for educational terms
    const educationalTerms = [
      'learning', 'teaching', 'student', 'assessment', 'engagement', 'strategy',
      'pedagogy', 'curriculum', 'instruction', 'classroom', 'education',
      'objective', 'outcome', 'skill', 'knowledge', 'understanding'
    ];
    educationalTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 3;
      }
    });
    
    // Boost for methodology terms
    const methodTerms = [
      'method', 'approach', 'technique', 'practice', 'framework', 'model',
      'theory', 'research', 'evidence', 'study', 'analysis'
    ];
    methodTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 2;
      }
    });
    
    // Boost for subject-specific terms
    const subjectTerms = [
      'mathematics', 'science', 'english', 'history', 'geography', 'art',
      'music', 'physical education', 'language', 'literature', 'biology',
      'chemistry', 'physics', 'algebra', 'geometry'
    ];
    subjectTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 2;
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
