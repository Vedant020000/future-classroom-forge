
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Educational knowledge base for RAG
interface EducationalKnowledge {
  id: string;
  category: string;
  topic: string;
  content: string;
  tags: string[];
  source: string;
  gradeLevel?: string;
  subject?: string;
}

const educationalKnowledgeBase: EducationalKnowledge[] = [
  {
    id: "eng-001",
    category: "Engagement",
    topic: "Active Learning Techniques",
    content: "Research shows that students retain 90% of what they teach others versus 10% of what they read. Implement peer teaching, think-pair-share, and jigsaw activities. Use the 10-2 rule: for every 10 minutes of instruction, provide 2 minutes of processing time.",
    tags: ["active-learning", "retention", "peer-teaching"],
    source: "Educational Psychology Research",
    gradeLevel: "all",
    subject: "all"
  },
  {
    id: "eng-002",
    category: "Engagement",
    topic: "Questioning Strategies",
    content: "Use Bloom's Taxonomy to create higher-order thinking questions. Start with knowledge and comprehension questions, then move to analysis, synthesis, and evaluation. Wait at least 3-5 seconds after asking a question before calling on students.",
    tags: ["questioning", "blooms-taxonomy", "critical-thinking"],
    source: "Bloom's Educational Objectives",
    gradeLevel: "all",
    subject: "all"
  },
  {
    id: "ass-001",
    category: "Assessment",
    topic: "Formative Assessment Techniques",
    content: "Use exit tickets, thumbs up/down, one minute papers, and digital polling. Implement 'fist to five' confidence checks. Formative assessment should happen every 10-15 minutes during instruction to gauge understanding.",
    tags: ["formative-assessment", "real-time-feedback", "understanding-checks"],
    source: "Assessment for Learning Research",
    gradeLevel: "all",
    subject: "all"
  },
  {
    id: "diff-001",
    category: "Differentiation",
    topic: "Multiple Learning Styles",
    content: "Address visual, auditory, kinesthetic, and reading/writing learners. Provide content in multiple formats: infographics, videos, hands-on activities, and text. Use the VARK model to ensure all learning preferences are met.",
    tags: ["learning-styles", "VARK", "multiple-modalities"],
    source: "Learning Styles Research",
    gradeLevel: "all",
    subject: "all"
  },
  {
    id: "math-001",
    category: "Subject-Specific",
    topic: "Mathematical Problem Solving",
    content: "Use the 5 Practices for Orchestrating Productive Mathematical Discourse: anticipating, monitoring, selecting, sequencing, and connecting student responses. Emphasize mathematical reasoning and communication.",
    tags: ["mathematics", "problem-solving", "discourse"],
    source: "Mathematical Teaching Practices",
    gradeLevel: "all",
    subject: "Mathematics"
  },
  {
    id: "sci-001",
    category: "Subject-Specific",
    topic: "Scientific Inquiry",
    content: "Implement the 5E model: Engage, Explore, Explain, Elaborate, Evaluate. Students should formulate hypotheses, design experiments, collect data, and draw conclusions. Emphasize scientific practices over content memorization.",
    tags: ["science", "inquiry", "5E-model", "scientific-method"],
    source: "Science Education Research",
    gradeLevel: "all",
    subject: "Science"
  },
  {
    id: "eng-004",
    category: "Subject-Specific",
    topic: "Reading Comprehension Strategies",
    content: "Teach explicit comprehension strategies: predicting, questioning, clarifying, summarizing. Use think-alouds to model metacognitive processes. Implement guided reading with leveled texts.",
    tags: ["reading", "comprehension", "metacognition", "guided-reading"],
    source: "Reading Research",
    gradeLevel: "elementary-middle",
    subject: "English"
  },
  {
    id: "udl-001",
    category: "Inclusion",
    topic: "Universal Design for Learning",
    content: "Provide multiple means of representation (visual, auditory, text), engagement (choice, relevance, challenge), and expression (writing, speaking, creating). Remove barriers to learning for all students.",
    tags: ["UDL", "accessibility", "multiple-means", "inclusion"],
    source: "UDL Guidelines",
    gradeLevel: "all",
    subject: "all"
  }
];

function searchRelevantKnowledge(query: string, subject?: string, gradeLevel?: string, limit: number = 3): EducationalKnowledge[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  const scored = educationalKnowledgeBase.map(item => {
    let score = 0;

    // Content relevance
    const contentLower = item.content.toLowerCase();
    queryWords.forEach(word => {
      if (contentLower.includes(word)) score += 2;
    });

    // Tag relevance
    item.tags.forEach(tag => {
      queryWords.forEach(word => {
        if (tag.includes(word)) score += 3;
      });
    });

    // Topic relevance
    const topicLower = item.topic.toLowerCase();
    queryWords.forEach(word => {
      if (topicLower.includes(word)) score += 4;
    });

    // Subject match
    if (subject && (item.subject === subject || item.subject === 'all')) {
      score += 2;
    }

    // Grade level match  
    if (gradeLevel && (item.gradeLevel === gradeLevel || item.gradeLevel === 'all')) {
      score += 1;
    }

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function getKnowledgeByCategory(category: string, subject?: string, gradeLevel?: string): EducationalKnowledge[] {
  return educationalKnowledgeBase.filter(item => {
    const categoryMatch = item.category.toLowerCase() === category.toLowerCase();
    const subjectMatch = !subject || item.subject === subject || item.subject === 'all';
    const gradeMatch = !gradeLevel || item.gradeLevel === gradeLevel || item.gradeLevel === 'all';
    
    return categoryMatch && subjectMatch && gradeMatch;
  });
}

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

    // RAG: Retrieve relevant educational knowledge
    const relevantKnowledge: EducationalKnowledge[] = [];
    
    // Search for engagement strategies
    relevantKnowledge.push(...searchRelevantKnowledge(`engagement activities ${lessonData.subject}`, lessonData.subject, lessonData.grade, 2));
    
    // Search for assessment strategies
    relevantKnowledge.push(...searchRelevantKnowledge(`assessment ${lessonData.subject}`, lessonData.subject, lessonData.grade, 2));
    
    // Search for differentiation strategies
    relevantKnowledge.push(...searchRelevantKnowledge(`differentiation learning styles`, lessonData.subject, lessonData.grade, 1));
    
    // Get subject-specific strategies
    const subjectStrategies = getKnowledgeByCategory('Subject-Specific', lessonData.subject, lessonData.grade);
    if (subjectStrategies.length > 0) {
      relevantKnowledge.push(subjectStrategies[0]);
    }

    // Get inclusion strategies
    const inclusionStrategies = getKnowledgeByCategory('Inclusion', lessonData.subject, lessonData.grade);
    if (inclusionStrategies.length > 0) {
      relevantKnowledge.push(inclusionStrategies[0]);
    }

    // Format research-based recommendations
    const researchRecommendations = relevantKnowledge.map(knowledge => 
      `**${knowledge.topic}** (${knowledge.source}):\n${knowledge.content}`
    ).join('\n\n');

    // Create the enhanced prompt with RAG content
    const prompt = `You are an expert educator and lesson plan creator with access to cutting-edge educational research. Create a comprehensive, research-backed lesson plan based on the following information and educational best practices:

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

RESEARCH-BASED EDUCATIONAL STRATEGIES TO INCORPORATE:
${researchRecommendations}

Please create a highly detailed, research-backed lesson plan that incorporates these evidence-based strategies. The lesson plan should include:

1. **Clear Learning Objectives** (aligned with standards and measurable)
2. **Materials and Technology** (specific tools and resources)
3. **Detailed Lesson Structure** with time allocations including:
   - Hook/Engagement Activity (research-based)
   - Direct Instruction with active learning elements
   - Guided Practice with formative assessment
   - Independent Practice with differentiation
   - Closure with reflection
4. **Assessment Strategies** (both formative and summative, research-backed)
5. **Differentiation Strategies** (for diverse learners, based on UDL principles)
6. **Extension Activities** (for advanced learners)
7. **Intervention Strategies** (for struggling learners)
8. **Cross-Curricular Connections**
9. **Real-World Applications**
10. **Reflection Questions** (for both students and teacher)
11. **Research Citations** (reference the educational strategies used)

IMPORTANT GUIDELINES:
- Incorporate active learning techniques with the 10-2 rule
- Use Bloom's Taxonomy for questioning strategies
- Include multiple means of representation, engagement, and expression (UDL)
- Implement formative assessment every 10-15 minutes
- Address different learning styles (visual, auditory, kinesthetic, reading/writing)
- Integrate technology meaningfully using the SAMR model
- Include social-emotional learning elements
- Ensure cultural responsiveness and inclusivity
- Use research-backed time management and pacing
- Incorporate student choice and voice

Format the lesson plan in clear markdown with appropriate headings and sections. Make it practical, engaging, research-backed, and ready to use in the classroom. Reference specific educational research and frameworks throughout.

The lesson plan should be professional, highly detailed, and demonstrate deep pedagogical knowledge backed by educational research.`;

    console.log('Generating enhanced lesson plan with RAG system...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const lessonPlan = response.text();

    console.log('Generated research-backed lesson plan successfully');

    return new Response(JSON.stringify({ 
      lessonPlan,
      researchReferences: relevantKnowledge.map(k => ({
        topic: k.topic,
        source: k.source,
        category: k.category
      }))
    }), {
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
