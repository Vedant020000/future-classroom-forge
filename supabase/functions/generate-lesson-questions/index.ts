
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LessonPlanData {
  title: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: string;
  outline: string;
  studentNeeds: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lessonData }: { lessonData: LessonPlanData } = await req.json();
    
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    console.log('Generating questions for lesson:', lessonData.title);

    const prompt = `Based on the following lesson plan details, generate exactly 10 insightful questions that will help gather more specific information to create a comprehensive and engaging lesson plan. The questions should be practical and help understand the specific context, student needs, and implementation details.

Lesson Details:
- Title: ${lessonData.title}
- Subject: ${lessonData.subject}
- Grade Level: ${lessonData.grade}
- Duration: ${lessonData.duration}
- Learning Objectives: ${lessonData.objectives}
- Content Outline: ${lessonData.outline}
- Student Considerations: ${lessonData.studentNeeds}

Generate 10 questions that will help create a more tailored and effective lesson plan. Focus on:
1. Specific classroom dynamics and student engagement strategies
2. Assessment methods and success criteria
3. Resource requirements and technology integration
4. Differentiation strategies for diverse learners
5. Real-world applications and connections
6. Interactive activities and hands-on learning opportunities
7. Time management and pacing considerations
8. Extension activities for advanced learners
9. Support strategies for struggling students
10. Connection to previous/future lessons

Return the response as a JSON array of question objects with the following format:
[
  {
    "id": 1,
    "question": "Question text here",
    "category": "Category name",
    "importance": "high|medium|low"
  }
]

Make each question specific, actionable, and directly relevant to improving the lesson plan.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    let questions;
    try {
      // Look for JSON array in the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse the entire response as JSON
        questions = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON, using fallback questions');
      // Fallback questions if parsing fails
      questions = [
        { id: 1, question: "What specific classroom resources and materials do you have available?", category: "Resources", importance: "high" },
        { id: 2, question: "How would you like to assess student understanding during the lesson?", category: "Assessment", importance: "high" },
        { id: 3, question: "What prior knowledge should students have before this lesson?", category: "Prerequisites", importance: "medium" },
        { id: 4, question: "How can this lesson connect to real-world applications?", category: "Relevance", importance: "medium" },
        { id: 5, question: "What interactive activities would engage your students most?", category: "Engagement", importance: "high" },
        { id: 6, question: "How will you differentiate for students with varying ability levels?", category: "Differentiation", importance: "high" },
        { id: 7, question: "What technology tools could enhance this lesson?", category: "Technology", importance: "medium" },
        { id: 8, question: "How does this lesson connect to your curriculum standards?", category: "Standards", importance: "medium" },
        { id: 9, question: "What homework or follow-up activities would reinforce learning?", category: "Extension", importance: "low" },
        { id: 10, question: "How will you handle potential misconceptions students might have?", category: "Misconceptions", importance: "medium" }
      ];
    }

    // Ensure we have exactly 10 questions
    if (Array.isArray(questions) && questions.length > 10) {
      questions = questions.slice(0, 10);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-lesson-questions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        questions: [] // Return empty array as fallback
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
