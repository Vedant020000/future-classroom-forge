
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

interface Student {
  id: string;
  name: string;
  grade: string;
  academic_level: string;
  behavior: string;
  engagement: string;
  learning_style: string;
  notes?: string;
  subjects?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting student data analysis...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Fetch all students from the database
    const { data: students, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching students:', fetchError);
      throw new Error('Failed to fetch student data');
    }

    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ 
        summary: 'No students found in the classroom.',
        studentCount: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Analyzing ${students.length} students...`);

    // Create a structured prompt for Gemini
    const studentsData = students.map((student: Student) => ({
      grade: student.grade,
      academic_level: student.academic_level,
      behavior: student.behavior,
      engagement: student.engagement,
      learning_style: student.learning_style,
      subjects: student.subjects || [],
      notes: student.notes || ''
    }));

    const prompt = `
As an experienced educational analyst, analyze the following classroom student data and provide a comprehensive summary. Focus on patterns, trends, and key characteristics that would help a teacher plan effective lessons.

Student Data (${students.length} students):
${JSON.stringify(studentsData, null, 2)}

Please provide a classroom summary that includes:

1. **Academic Distribution**: Overview of academic levels and performance patterns
2. **Behavioral Patterns**: Common behavioral characteristics and any notable patterns
3. **Engagement Levels**: General engagement patterns and motivation indicators
4. **Learning Styles**: Distribution of learning preferences and styles
5. **Key Teaching Considerations**: Specific recommendations for lesson planning and classroom management
6. **Potential Challenges**: Areas that may require special attention or differentiated instruction
7. **Classroom Strengths**: Positive characteristics to leverage in lesson planning

Keep the summary concise but actionable, focusing on information that would directly impact lesson planning and teaching strategies. Limit to 3-4 paragraphs maximum.
`;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_AI_API_KEY!,
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
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.';

    console.log('Successfully generated classroom summary');

    // Store the summary in the database (we'll create a classroom_summaries table)
    const { data: summaryData, error: summaryError } = await supabase
      .from('classroom_summaries')
      .upsert({
        id: 'main-classroom', // For now, using a single classroom
        summary: summary,
        student_count: students.length,
        generated_at: new Date().toISOString(),
        student_data_hash: JSON.stringify(studentsData) // To detect changes
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (summaryError) {
      console.error('Error storing summary:', summaryError);
      // Continue even if storage fails
    }

    return new Response(JSON.stringify({ 
      summary,
      studentCount: students.length,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-students function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze student data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
