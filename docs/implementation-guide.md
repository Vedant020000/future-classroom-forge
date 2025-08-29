# Implementation Guide: Supabase → PocketBase + LangChain

## Quick Start Implementation

### Step 1: Install Dependencies

```bash
# Install PocketBase client
npm install pocketbase

# Install LangChain and related packages
npm install langchain @langchain/core @langchain/community

# Install vector store alternatives
npm install lancedb chromadb

# Install local LLM support
npm install @langchain/community/llms/ollama

# Install embedding models
npm install @langchain/community/embeddings/hf_transformers
npm install sentence-transformers

# Install PDF processing
npm install pdf-parse pdfjs-dist

# Install development tools
npm install -D @types/node
```

### Step 2: Update package.json

```json
{
  "dependencies": {
    "pocketbase": "^0.22.0",
    "langchain": "^0.2.0",
    "@langchain/core": "^0.2.0",
    "@langchain/community": "^0.2.0",
    "lancedb": "^0.5.0",
    "chromadb": "^1.8.0",
    "@langchain/community/llms/ollama": "^0.2.0",
    "@langchain/community/embeddings/hf_transformers": "^0.2.0",
    "sentence-transformers": "^2.2.2",
    "pdf-parse": "^1.1.1",
    "pdfjs-dist": "^4.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "pocketbase:start": "./pocketbase serve --http=127.0.0.1:8090",
    "ollama:start": "ollama serve",
    "ollama:pull": "ollama pull llama3.2:3b",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

### Step 3: Create PocketBase Client

```typescript
// src/integrations/pocketbase/client.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Type definitions for PocketBase collections
export interface PocketBaseUser {
  id: string;
  email: string;
  name: string;
  user_type: 'individual' | 'organization';
  organization_id?: string;
  gemini_api_key?: string;
  created: string;
  updated: string;
}

export interface PocketBaseStudent {
  id: string;
  name: string;
  grade: string;
  academic_level: string;
  learning_style: string;
  behavior: string;
  engagement: string;
  special_needs: string;
  teacher_id: string;
  created: string;
  updated: string;
}

export interface PocketBaseLessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  objectives: string;
  outline: string;
  student_needs: string;
  file: string;
  status: 'draft' | 'published';
  teacher_id: string;
  organization_id?: string;
  created: string;
  updated: string;
}

export interface PocketBasePDFChunk {
  id: string;
  content: string;
  metadata: {
    filename: string;
    subject?: string;
    grade_level?: string;
    page?: number;
  };
  embedding: number[];
  teacher_id: string;
  created: string;
}
```

### Step 4: Update Authentication Hook

```typescript
// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { pb, PocketBaseUser } from '@/integrations/pocketbase/client';

interface AuthContextType {
  user: PocketBaseUser | null;
  session: any;
  profile: PocketBaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, data: Partial<PocketBaseUser>) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithOrganization: (orgId: string, email: string, password: string) => Promise<any>;
  signOut: () => void;
  updateProfile: (data: Partial<PocketBaseUser>) => Promise<any>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<PocketBaseUser | null>(pb.authStore.model);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pb.authStore.onChange((auth) => {
      setUser(auth.model);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await pb.collection('users').authWithPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, data: Partial<PocketBaseUser>) => {
    setLoading(true);
    try {
      const result = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        ...data
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    // Implement OAuth with PocketBase
    return await pb.collection('users').authWithOAuth2({ provider: 'google' });
  };

  const signInWithOrganization = async (orgId: string, email: string, password: string) => {
    // Custom organization login logic
    const result = await signIn(email, password);
    if (result.record.organization_id !== orgId) {
      throw new Error('User does not belong to this organization');
    }
    return result;
  };

  const signOut = () => {
    pb.authStore.clear();
  };

  const updateProfile = async (data: Partial<PocketBaseUser>) => {
    if (!user) throw new Error('No user logged in');
    return await pb.collection('users').update(user.id, data);
  };

  return {
    user,
    session: pb.authStore,
    profile: user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithOrganization,
    signOut,
    updateProfile,
  };
};
```

### Step 5: Create AI Services

```typescript
// src/services/ai/baseService.ts
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

// Configure LLM
export const createLLM = () => {
  return new ChatOllama({
    model: "llama3.2:3b",
    baseUrl: "http://localhost:11434",
  });
};

// Configure embeddings
export const createEmbeddings = () => {
  return new HuggingFaceTransformersEmbeddings({
    modelName: "sentence-transformers/all-MiniLM-L6-v2",
  });
};
```

```typescript
// src/services/ai/studentAnalysisService.ts
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createLLM } from './baseService';
import { pb } from '@/integrations/pocketbase/client';

export const analyzeStudents = async (): Promise<string> => {
  const llm = createLLM();
  
  // Fetch students from PocketBase
  const students = await pb.collection('students').getList(1, 100);
  
  const prompt = PromptTemplate.fromTemplate(`
    Analyze the following classroom students and provide insights:
    {students}
    
    Provide a comprehensive classroom summary including:
    1. Overall class dynamics
    2. Learning style distribution
    3. Academic performance patterns
    4. Behavioral considerations
    5. Teaching recommendations
    
    Format the response as a well-structured markdown document.
  `);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  
  const result = await chain.invoke({
    students: JSON.stringify(students.items, null, 2)
  });

  // Save to PocketBase
  await pb.collection('classroom_summaries').upsert('main-classroom', {
    summary: result,
    student_count: students.items.length,
    generated_at: new Date().toISOString(),
  });

  return result;
};
```

```typescript
// src/services/ai/lessonQuestionService.ts
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createLLM } from './baseService';

export const generateLessonQuestions = async (lessonData: any): Promise<any[]> => {
  const llm = createLLM();

  const prompt = PromptTemplate.fromTemplate(`
    Generate 10 questions for this lesson plan:
    Title: {title}
    Subject: {subject}
    Grade: {grade}
    Objectives: {objectives}
    
    Generate questions that:
    1. Test understanding of key concepts
    2. Encourage critical thinking
    3. Are appropriate for the grade level
    4. Cover different difficulty levels
    
    Return ONLY a valid JSON array with this exact format:
    [
      {{"question": "What is...?", "type": "comprehension", "difficulty": "easy"}},
      {{"question": "How would you...?", "type": "application", "difficulty": "medium"}},
      ...
    ]
  `);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  
  const result = await chain.invoke(lessonData);
  
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error('Failed to parse questions JSON:', result);
    // Fallback to basic questions
    return [
      { question: "What are the main objectives of this lesson?", type: "comprehension", difficulty: "easy" },
      { question: "How can you apply these concepts in real life?", type: "application", difficulty: "medium" },
    ];
  }
};
```

```typescript
// src/services/ai/pdfProcessingService.ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createEmbeddings } from './baseService';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';
import { pb } from '@/integrations/pocketbase/client';

export const processPDFKnowledge = async (text: string, metadata: any): Promise<any> => {
  // Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.createDocuments([text], [metadata]);

  // Create embeddings
  const embeddings = createEmbeddings();

  // Store in LanceDB
  const db = await LanceDB.connect('./vectorstore');
  const table = await db.createTable('pdf_knowledge', docs, embeddings);
  
  // Also store metadata in PocketBase for easy querying
  for (const doc of docs) {
    await pb.collection('pdf_knowledge_chunks').create({
      content: doc.pageContent,
      metadata: doc.metadata,
      teacher_id: pb.authStore.model?.id,
    });
  }
  
  return { success: true, chunks: docs.length };
};
```

```typescript
// src/services/ai/knowledgeSearchService.ts
import { createEmbeddings } from './baseService';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';

export const searchPDFKnowledge = async (query: string, filters?: any): Promise<any[]> => {
  const embeddings = createEmbeddings();

  const db = await LanceDB.connect('./vectorstore');
  const table = await db.openTable('pdf_knowledge');
  
  const results = await table.search(query)
    .metricType('cosine')
    .limit(5)
    .execute();

  return results;
};
```

```typescript
// src/services/ai/lessonPlanGenerationService.ts
import { RetrievalQAChain } from 'langchain/chains';
import { createLLM } from './baseService';
import { searchPDFKnowledge } from './knowledgeSearchService';

export const generateLessonPlan = async (lessonData: any, qaAnswers: any): Promise<string> => {
  const llm = createLLM();

  // Retrieve relevant knowledge
  const relevantDocs = await searchPDFKnowledge(
    `${lessonData.subject} ${lessonData.grade} ${lessonData.objectives}`
  );

  // Create RAG chain
  const chain = RetrievalQAChain.fromLLM(llm, relevantDocs);
  
  const prompt = `
    Create a comprehensive lesson plan based on:
    - Lesson requirements: ${JSON.stringify(lessonData)}
    - Teacher Q&A: ${JSON.stringify(qaAnswers)}
    - Relevant knowledge: ${relevantDocs.map(d => d.pageContent).join('\n')}
    
    Format as detailed markdown with sections for:
    1. Learning Objectives
    2. Materials Needed
    3. Lesson Procedure
    4. Assessment Methods
    5. Differentiation Strategies
    6. Extension Activities
  `;

  const result = await chain.invoke({ query: prompt });
  return result.text;
};
```

### Step 6: Update Service Layer

```typescript
// src/services/pocketbaseLessonPlanService.ts
import { pb, PocketBaseLessonPlan } from '@/integrations/pocketbase/client';

export const uploadLessonPlan = async (file: File, metadata: Partial<PocketBaseLessonPlan>) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title || '');
  formData.append('subject', metadata.subject || '');
  formData.append('grade', metadata.grade || '');
  formData.append('duration', metadata.duration?.toString() || '0');
  formData.append('objectives', metadata.objectives || '');
  formData.append('outline', metadata.outline || '');
  formData.append('student_needs', metadata.student_needs || '');
  formData.append('status', metadata.status || 'draft');
  
  return await pb.collection('lesson_plans').create(formData);
};

export const getLessonPlans = async (page = 1, perPage = 50) => {
  return await pb.collection('lesson_plans').getList(page, perPage, {
    sort: '-created',
  });
};

export const getLessonPlan = async (id: string) => {
  return await pb.collection('lesson_plans').getOne(id);
};

export const deleteLessonPlan = async (id: string) => {
  return await pb.collection('lesson_plans').delete(id);
};

export const getLessonPlanFile = async (recordId: string) => {
  const record = await pb.collection('lesson_plans').getOne(recordId);
  return pb.files.getUrl(record, record.file);
};
```

### Step 7: Update Hooks

```typescript
// src/hooks/useLessonPlans.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLessonPlans, 
  uploadLessonPlan, 
  deleteLessonPlan,
  getLessonPlanFile 
} from '@/services/pocketbaseLessonPlanService';

export const useLessonPlans = () => {
  const queryClient = useQueryClient();

  const { data: lessonPlans, isLoading, error } = useQuery({
    queryKey: ['lessonPlans'],
    queryFn: () => getLessonPlans(),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: any }) =>
      uploadLessonPlan(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonPlans'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLessonPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonPlans'] });
    },
  });

  const getFileUrl = async (recordId: string) => {
    return await getLessonPlanFile(recordId);
  };

  return {
    lessonPlans: lessonPlans?.items || [],
    isLoading,
    error,
    uploadLessonPlan: uploadMutation.mutate,
    deleteLessonPlan: deleteMutation.mutate,
    getFileUrl,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
```

### Step 8: Create Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    container_name: future-classroom-pocketbase
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb_data
    restart: unless-stopped
    environment:
      - POCKETBASE_ADMIN_EMAIL=admin@futureclassroom.com
      - POCKETBASE_ADMIN_PASSWORD=admin123

  ollama:
    image: ollama/ollama:latest
    container_name: future-classroom-ollama
    ports:
      - "11434:11434"
    volumes:
      - ./ollama_data:/root/.ollama
    restart: unless-stopped
    environment:
      - OLLAMA_HOST=0.0.0.0

  lancedb:
    image: lancedb/lance:latest
    container_name: future-classroom-lancedb
    ports:
      - "8080:8080"
    volumes:
      - ./lance_data:/data
    restart: unless-stopped

volumes:
  pb_data:
  ollama_data:
  lance_data:
```

### Step 9: Environment Configuration

```bash
# .env.local
VITE_POCKETBASE_URL=http://localhost:8090
VITE_OLLAMA_URL=http://localhost:11434
VITE_LANCEDB_URL=http://localhost:8080

# Optional: Hugging Face API key for better embeddings
VITE_HUGGINGFACE_API_KEY=your_hf_api_key_here
```

### Step 10: Migration Script

```typescript
// scripts/migrate-supabase-to-pocketbase.ts
import { createClient } from '@supabase/supabase-js';
import { pb } from '../src/integrations/pocketbase/client';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateData() {
  console.log('Starting migration...');

  // Migrate students
  const { data: students } = await supabase.from('students').select('*');
  for (const student of students || []) {
    await pb.collection('students').create({
      name: student.name,
      grade: student.grade,
      academic_level: student.academic_level,
      learning_style: student.learning_style,
      behavior: student.behavior,
      engagement: student.engagement,
      special_needs: student.special_needs,
      teacher_id: student.teacher_id,
    });
  }

  // Migrate lesson plans
  const { data: lessonPlans } = await supabase.from('lesson_plans').select('*');
  for (const plan of lessonPlans || []) {
    await pb.collection('lesson_plans').create({
      title: plan.title,
      subject: plan.subject,
      grade: plan.grade,
      duration: plan.duration,
      objectives: plan.objectives,
      outline: plan.outline,
      student_needs: plan.student_needs,
      status: plan.status,
      teacher_id: plan.teacher_id,
    });
  }

  console.log('Migration completed!');
}

migrateData().catch(console.error);
```

## Testing the Migration

### 1. Start Services

```bash
# Start all services
npm run docker:up

# Or start individually
npm run pocketbase:start
npm run ollama:start
```

### 2. Pull LLM Models

```bash
# Pull a small model for testing
npm run ollama:pull

# Or pull specific models
ollama pull llama3.2:3b
ollama pull gemma2:2b
```

### 3. Test AI Services

```typescript
// Test script
import { analyzeStudents } from '@/services/ai/studentAnalysisService';
import { generateLessonQuestions } from '@/services/ai/lessonQuestionService';

// Test student analysis
const summary = await analyzeStudents();
console.log('Student Analysis:', summary);

// Test question generation
const questions = await generateLessonQuestions({
  title: 'Introduction to Photosynthesis',
  subject: 'Science',
  grade: '5th Grade',
  objectives: 'Understand basic plant processes'
});
console.log('Generated Questions:', questions);
```

## Performance Optimization

### 1. Caching Strategy

```typescript
// src/services/cache.ts
import { pb } from '@/integrations/pocketbase/client';

export const cacheService = {
  async get(key: string) {
    const record = await pb.collection('cache').getFirstListItem(`key="${key}"`);
    return record.value;
  },

  async set(key: string, value: any, ttl = 3600) {
    await pb.collection('cache').upsert(key, {
      key,
      value,
      expires_at: new Date(Date.now() + ttl * 1000).toISOString(),
    });
  },
};
```

### 2. Batch Processing

```typescript
// src/services/ai/batchProcessingService.ts
export const batchProcessPDFs = async (files: File[]) => {
  const results = [];
  
  for (const file of files) {
    const text = await extractTextFromPDF(file);
    const result = await processPDFKnowledge(text, { filename: file.name });
    results.push(result);
  }
  
  return results;
};
```

This implementation guide provides a complete path to migrate from Supabase to PocketBase with LangChain, using free alternatives and maintaining all functionality while significantly reducing costs.

