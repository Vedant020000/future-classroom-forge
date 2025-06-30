
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lessonData, aiQuestions } = await req.json();
    
    const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleAIApiKey) {
      throw new Error('Google AI API key not configured');
    }

    const genAI = new GoogleGenerativeAI(googleAIApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching PDF knowledge base for relevant educational content...');

    // Create targeted search queries for different aspects of lesson planning
    const searchQueries = [
      `${lessonData.subject} ${lessonData.grade} teaching methods engagement activities`,
      `${lessonData.subject} assessment strategies formative summative evaluation`,
      `differentiation learning styles multiple intelligences ${lessonData.grade}`,
      `${lessonData.subject} pedagogy best practices research evidence`,
      `classroom management techniques ${lessonData.grade} behavior strategies`,
      `${lessonData.title} ${lessonData.subject} lesson activities examples`
    ];

    let relevantKnowledge: any[] = [];
    
    // Search PDF knowledge base for each query
    for (const query of searchQueries) {
      try {
        const { data: searchResults, error } = await supabase.functions.invoke('search-pdf-knowledge', {
          body: { 
            query, 
            subject: lessonData.subject, 
            gradeLevel: lessonData.grade,
            limit: 3
          }
        });
        
        if (error) {
          console.error(`Search error for query "${query}":`, error);
          continue;
        }
        
        if (searchResults?.results) {
          relevantKnowledge.push(...searchResults.results);
        }
      } catch (searchError) {
        console.error(`Search error for query "${query}":`, searchError);
      }
    }

    // Remove duplicates and get top results
    const uniqueKnowledge = relevantKnowledge
      .filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    console.log(`Found ${uniqueKnowledge.length} relevant knowledge chunks from uploaded PDFs`);

    // Format PDF-based research content
    const pdfResearchContent = uniqueKnowledge.length > 0 
      ? uniqueKnowledge.map(knowledge => 
          `**Source: ${knowledge.source}** (Relevance: ${knowledge.relevanceScore})\n${knowledge.content}`
        ).join('\n\n---\n\n')
      : '';

    // Create enhanced prompt with PDF research integration
    const prompt = `You are an expert educator creating a research-backed lesson plan. Use the educational research and best practices from the uploaded documents to create a comprehensive, evidence-based lesson plan.

LESSON REQUIREMENTS:
- Title: ${lessonData.title}
- Subject: ${lessonData.subject}
- Grade Level: ${lessonData.grade}
- Duration: ${lessonData.duration}
- Learning Objectives: ${lessonData.objectives || 'To be developed based on content'}
- Content Outline: ${lessonData.outline || 'To be structured based on best practices'}
- Student Considerations: ${lessonData.studentNeeds || 'Address diverse learning needs'}

TEACHER INPUT FROM AI QUESTIONS:
${aiQuestions.map((q: any) => `Q: ${q.question}\nA: ${q.answer || 'Not answered'}`).join('\n\n')}

RELEVANT EDUCATIONAL RESEARCH FROM UPLOADED DOCUMENTS:
${pdfResearchContent || 'No specific PDF research found - using general educational best practices'}

${pdfResearchContent ? 
`INSTRUCTIONS: Create a detailed lesson plan that directly incorporates and references the research findings above. Cite specific strategies, methods, and evidence from the uploaded documents.` 
: 
`INSTRUCTIONS: Create a research-based lesson plan using established educational principles including active learning, formative assessment, differentiation, and Universal Design for Learning (UDL).`}

Create a comprehensive lesson plan with these sections:

## ${lessonData.title}
**Subject:** ${lessonData.subject} | **Grade:** ${lessonData.grade} | **Duration:** ${lessonData.duration}

### Learning Objectives
- [Create 3-5 measurable objectives aligned with standards]

### Materials & Technology
- [List specific resources needed]

### Lesson Structure

#### Opening (X minutes)
- Hook/Engagement Activity
- Learning objectives introduction
- Connection to prior knowledge

#### Main Instruction (X minutes)
- Direct instruction with active learning elements
- Guided practice opportunities
- Formative assessment checkpoints

#### Independent Practice (X minutes)
- Differentiated activities
- Student choice elements
- Scaffolding for different ability levels

#### Closure (X minutes)
- Summary and reflection
- Assessment of learning
- Preview of next lesson

### Assessment Strategies
- Formative assessment techniques
- Summative assessment plan
- Success criteria

### Differentiation & Accommodations
- For advanced learners
- For struggling learners
- For English language learners
- For students with disabilities

### Extension Activities
- [Additional challenges and enrichment]

### Cross-Curricular Connections
- [Links to other subjects]

### Research Integration
- [Reference specific strategies from the uploaded research]

Make this lesson plan practical, detailed, and immediately usable in the classroom. Include specific timing, clear instructions, and research citations where applicable.`;

    console.log('Generating research-enhanced lesson plan...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const lessonPlan = response.text();

    console.log('Successfully generated PDF research-enhanced lesson plan');

    return new Response(JSON.stringify({ 
      lessonPlan,
      researchReferences: uniqueKnowledge.map(k => ({
        source: k.source,
        relevanceScore: k.relevanceScore,
        topic: k.content.substring(0, 100) + '...'
      })),
      knowledgeChunksUsed: uniqueKnowledge.length,
      hasPDFResearch: uniqueKnowledge.length > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-lesson-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate lesson plan with PDF research'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
