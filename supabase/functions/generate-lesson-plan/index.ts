import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ChatGoogleGenerativeAI } from "https://esm.sh/@langchain/google-genai";
import { SupabaseVectorStore } from 'https://esm.sh/@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai';
import { StringOutputParser } from "https://esm.sh/@langchain/core/output_parsers";
import { PromptTemplate } from "https://esm.sh/@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "https://esm.sh/@langchain/core/runnables";

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const embeddings = new OpenAIEmbeddings({ openAIApiKey });
    const model = new ChatGoogleGenerativeAI({ apiKey: googleAIApiKey, model: "gemini-1.5-flash" });

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'pdf_knowledge_chunks',
      queryName: 'match_documents',
    });

    const retriever = vectorStore.asRetriever(10, {
      subject: lessonData.subject === 'all' ? undefined : lessonData.subject,
      gradeLevel: lessonData.grade === 'all' ? undefined : lessonData.grade,
    });

    const template = `You are an expert educator creating a research-backed lesson plan. Use the educational research and best practices from the uploaded documents to create a comprehensive, evidence-based lesson plan.

Context:
{context}

Question:
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

Make this lesson plan practical, detailed, and immediately usable in the classroom. Include specific timing, clear instructions, and research citations where applicable.

Teacher Input:
${aiQuestions.map((q: any) => `Q: ${q.question}\nA: ${q.answer || 'Not answered'}`).join('\n\n')}
`;

    const prompt = PromptTemplate.fromTemplate(template);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\n\n")),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const lessonPlan = await chain.invoke(
      `Create a lesson plan for a ${lessonData.grade} ${lessonData.subject} class on the topic of "${lessonData.title}".`
    );

    return new Response(JSON.stringify({ 
      lessonPlan,
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
