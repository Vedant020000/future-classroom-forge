
export interface EducationalKnowledge {
  id: string;
  category: string;
  topic: string;
  content: string;
  tags: string[];
  source: string;
  gradeLevel?: string;
  subject?: string;
}

export const educationalKnowledgeBase: EducationalKnowledge[] = [
  // Engagement Strategies
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
    id: "eng-003",
    category: "Engagement",
    topic: "Gamification Elements",
    content: "Incorporate game mechanics like points, badges, leaderboards, and challenges. Use mystery boxes, escape rooms, and quest-based learning. Research shows gamification can increase engagement by 48% and learning outcomes by 36%.",
    tags: ["gamification", "motivation", "engagement"],
    source: "Educational Technology Research",
    gradeLevel: "elementary-middle",
    subject: "all"
  },

  // Assessment Strategies
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
    id: "ass-002",
    category: "Assessment",
    topic: "Authentic Assessment",
    content: "Create real-world performance tasks that mirror professional practices. Use portfolios, presentations, and project-based assessments. Students should understand the criteria and have opportunities for self and peer assessment.",
    tags: ["authentic-assessment", "real-world", "portfolios"],
    source: "Performance Assessment Studies",
    gradeLevel: "middle-high",
    subject: "all"
  },

  // Differentiation Strategies
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
    id: "diff-002",
    category: "Differentiation",
    topic: "Tiered Assignments",
    content: "Create assignments at different complexity levels while maintaining the same learning objectives. Use 'must do, should do, could do' structure. Provide choice in how students demonstrate their understanding.",
    tags: ["tiered-assignments", "choice", "complexity-levels"],
    source: "Differentiated Instruction Research",
    gradeLevel: "all",
    subject: "all"
  },

  // Technology Integration
  {
    id: "tech-001",
    category: "Technology",
    topic: "SAMR Model Integration",
    content: "Use the SAMR model: Substitution, Augmentation, Modification, Redefinition. Start with substitution (digital worksheets) and progress to redefinition (creating multimedia presentations). Technology should enhance, not replace, good pedagogy.",
    tags: ["SAMR", "technology-integration", "digital-tools"],
    source: "SAMR Technology Framework",
    gradeLevel: "all",
    subject: "all"
  },

  // Subject-Specific Strategies
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

  // Classroom Management
  {
    id: "mgmt-001",
    category: "Management",
    topic: "Positive Behavior Supports",
    content: "Establish clear expectations and routines. Use positive reinforcement more than correction (4:1 ratio). Implement restorative practices for conflicts. Create a sense of community and belonging.",
    tags: ["behavior", "positive-reinforcement", "community", "routines"],
    source: "Classroom Management Research",
    gradeLevel: "all",
    subject: "all"
  },

  // Universal Design for Learning
  {
    id: "udl-001",
    category: "Inclusion",
    topic: "Universal Design for Learning",
    content: "Provide multiple means of representation (visual, auditory, text), engagement (choice, relevance, challenge), and expression (writing, speaking, creating). Remove barriers to learning for all students.",
    tags: ["UDL", "accessibility", "multiple-means", "inclusion"],
    source: "UDL Guidelines",
    gradeLevel: "all",
    subject: "all"
  },

  // Social-Emotional Learning
  {
    id: "sel-001",
    category: "Social-Emotional",
    topic: "SEL Integration",
    content: "Integrate social-emotional learning through morning meetings, reflection journals, and collaborative projects. Teach self-awareness, self-management, social awareness, relationship skills, and responsible decision-making.",
    tags: ["SEL", "social-emotional", "collaboration", "reflection"],
    source: "CASEL Framework",
    gradeLevel: "all",
    subject: "all"
  }
];

export class EducationalRAG {
  private knowledgeBase: EducationalKnowledge[];

  constructor() {
    this.knowledgeBase = educationalKnowledgeBase;
  }

  searchRelevantKnowledge(query: string, subject?: string, gradeLevel?: string, limit: number = 5): EducationalKnowledge[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    const scored = this.knowledgeBase.map(item => {
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

  getKnowledgeByCategory(category: string, subject?: string, gradeLevel?: string): EducationalKnowledge[] {
    return this.knowledgeBase.filter(item => {
      const categoryMatch = item.category.toLowerCase() === category.toLowerCase();
      const subjectMatch = !subject || item.subject === subject || item.subject === 'all';
      const gradeMatch = !gradeLevel || item.gradeLevel === gradeLevel || item.gradeLevel === 'all';
      
      return categoryMatch && subjectMatch && gradeMatch;
    });
  }

  generateContextualRecommendations(lessonData: any): string {
    const { subject, grade, duration, objectives, outline } = lessonData;
    
    const recommendations: string[] = [];
    
    // Get engagement strategies
    const engagementStrategies = this.getKnowledgeByCategory('Engagement', subject, grade);
    if (engagementStrategies.length > 0) {
      recommendations.push(`**ENGAGEMENT STRATEGIES:**\n${engagementStrategies[0].content}`);
    }

    // Get assessment strategies
    const assessmentStrategies = this.getKnowledgeByCategory('Assessment', subject, grade);
    if (assessmentStrategies.length > 0) {
      recommendations.push(`**ASSESSMENT APPROACHES:**\n${assessmentStrategies[0].content}`);
    }

    // Get differentiation strategies
    const differentiationStrategies = this.getKnowledgeByCategory('Differentiation', subject, grade);
    if (differentiationStrategies.length > 0) {
      recommendations.push(`**DIFFERENTIATION TECHNIQUES:**\n${differentiationStrategies[0].content}`);
    }

    // Get subject-specific strategies
    const subjectStrategies = this.getKnowledgeByCategory('Subject-Specific', subject, grade);
    if (subjectStrategies.length > 0) {
      recommendations.push(`**SUBJECT-SPECIFIC BEST PRACTICES:**\n${subjectStrategies[0].content}`);
    }

    return recommendations.join('\n\n');
  }
}
