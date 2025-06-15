
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Create the prompt for lesson plan generation
    const prompt = `You are an expert educator and lesson plan creator. Create a comprehensive, engaging lesson plan based on the following information:

LESSON DETAILS:
- Title: ${lessonData.title}
- Subject: ${lessonData.subject}
- Grade Level: ${lessonData.grade}
- Duration: ${lessonData.duration}
- Learning Objectives: ${lessonData.objectives || 'Not specified'}
- Content Outline: ${lessonData.outline || 'Not specified'}
- Student Considerations: ${lessonData.studentNeeds || 'Not specified'}

TEACHER'S RESPONSES TO AI QUESTIONS:
${aiQuestions.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')}

Please create a detailed lesson plan that includes:
1. Clear learning objectives
2. Materials needed
3. Lesson structure with time allocations
4. Engaging activities based on the teacher's responses
5. Assessment strategies
6. Differentiation for various learners
7. Extension activities
8. Reflection questions

Format the lesson plan in clear markdown with appropriate headings and sections. Make it practical, engaging, and tailored to the specific grade level and subject. Incorporate the teacher's answers to create a personalized experience.

The lesson plan should be professional, detailed, and ready to use in the classroom.`;

    console.log('Generating lesson plan with prompt:', prompt.substring(0, 200) + '...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const lessonPlan = response.text();

    console.log('Generated lesson plan successfully');

    return new Response(JSON.stringify({ lessonPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-lesson-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate lesson plan'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
