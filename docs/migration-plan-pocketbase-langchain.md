# Migration Plan: Supabase → PocketBase + LangChain

## Overview

This document outlines the migration strategy to replace Supabase with PocketBase and convert Edge Functions to LangChain-based solutions. This transition will reduce costs, improve control, and leverage free/open-source alternatives.

## Current Architecture Analysis

### What we're migrating from:
- **Database**: Supabase PostgreSQL with `vector` extension
- **Auth**: Supabase Auth (currently mocked)
- **Storage**: Supabase Storage buckets
- **Edge Functions**: 5 Deno functions for AI/RAG operations
- **Vector Store**: Supabase Vector store with OpenAI embeddings

### What we're migrating to:
- **Database**: PocketBase (SQLite-based, single executable)
- **Auth**: PocketBase built-in auth system
- **Storage**: PocketBase file attachments
- **AI Processing**: LangChain.js with local/cloud LLM options
- **Vector Store**: Multiple free alternatives

## Phase 1: PocketBase Setup & Database Migration

### 1.1 Install and Configure PocketBase

```bash
# Download PocketBase (single executable)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip

# Run PocketBase
./pocketbase serve --http="127.0.0.1:8090"
```

### 1.2 Database Schema Migration

**Free Alternative**: Use PocketBase's built-in schema builder instead of manual SQL migrations.

**Migration Strategy**:
1. Create collections in PocketBase admin UI
2. Export data from Supabase using pg_dump
3. Transform data format (PostgreSQL → SQLite compatible)
4. Import via PocketBase admin or API

**Key Collections to Create**:
```typescript
// PocketBase Collections (equivalent to Supabase tables)
- students
- profiles  
- lesson_plans
- organization_lesson_plans
- classroom_summaries
- pdf_knowledge_chunks
- organizations
- organization_credentials
```

### 1.3 Vector Storage Alternatives

**Option 1: ChromaDB (Free, Local)**
```bash
npm install chromadb
# Self-hosted vector database with similarity search
```

**Option 2: Qdrant (Free Tier Available)**
```bash
# Docker deployment
docker run -p 6333:6333 qdrant/qdrant
```

**Option 3: LanceDB (Free, Embedded)**
```bash
npm install lancedb
# Embedded vector database with SQL-like queries
```

**Recommended**: LanceDB for simplicity and zero infrastructure costs.

## Phase 2: Authentication Migration

### 2.1 Replace Supabase Auth with PocketBase Auth

**Current**: Mocked auth in `src/hooks/useAuth.tsx`
**Target**: Real PocketBase authentication

**Implementation**:
```typescript
// src/integrations/pocketbase/client.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// src/hooks/useAuth.tsx
export const useAuth = () => {
  const [user, setUser] = useState(pb.authStore.model);
  
  useEffect(() => {
    pb.authStore.onChange((auth) => {
      setUser(auth.model);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    return await pb.collection('users').authWithPassword(email, password);
  };

  const signUp = async (email: string, password: string, data: any) => {
    return await pb.collection('users').create(data);
  };

  const signOut = () => {
    pb.authStore.clear();
  };

  return { user, signIn, signUp, signOut, loading: false };
};
```

### 2.2 Update Auth Components

- `src/components/auth/ProtectedRoute.tsx` → Check `pb.authStore.isValid`
- `src/components/auth/AuthRoute.tsx` → Redirect if authenticated
- `src/pages/AuthPage.tsx` → Use PocketBase auth methods

## Phase 3: Storage Migration

### 3.1 Replace Supabase Storage with PocketBase Attachments

**Current**: Supabase Storage buckets (`lesson-plans`, `organization-lesson-plans`)
**Target**: PocketBase file attachments

**Migration Strategy**:
```typescript
// src/services/pocketbaseLessonPlanService.ts
export const uploadLessonPlan = async (file: File, metadata: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('subject', metadata.subject);
  
  return await pb.collection('lesson_plans').create(formData);
};

export const getLessonPlanFile = async (recordId: string) => {
  const record = await pb.collection('lesson_plans').getOne(recordId);
  return pb.files.getUrl(record, record.file);
};
```

### 3.2 Update Service Layer

- `src/services/individualLessonPlanService.ts` → PocketBase CRUD
- `src/services/organizationLessonPlanService.ts` → PocketBase CRUD
- Update all file upload/download logic

## Phase 4: Edge Functions → LangChain Migration

### 4.1 Free LLM Alternatives

**Option 1: Ollama (Free, Local)**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Run local models
ollama run llama3.2:3b
ollama run gemma2:2b
ollama run mistral:7b
```

**Option 2: Hugging Face Inference API (Free Tier)**
```typescript
// Free tier: 30,000 requests/month
import { HuggingFaceInference } from '@langchain/community/llms/hf';

const llm = new HuggingFaceInference({
  model: "google/flan-t5-base",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});
```

**Option 3: Together AI (Free Tier)**
```typescript
// Free tier: $25 credit/month
import { TogetherAI } from '@langchain/community/llms/together';

const llm = new TogetherAI({
  modelName: "togethercomputer/llama-2-7b",
  apiKey: process.env.TOGETHER_API_KEY,
});
```

**Recommended**: Ollama for development, Hugging Face for production (free tier).

### 4.2 Free Embedding Alternatives

**Option 1: Hugging Face Embeddings (Free)**
```typescript
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "sentence-transformers/all-MiniLM-L6-v2",
});
```

**Option 2: Ollama Embeddings (Free)**
```typescript
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';

const embeddings = new OllamaEmbeddings({
  model: "llama2",
});
```

**Recommended**: Hugging Face embeddings for better quality.

### 4.3 Migrate Edge Functions to LangChain

#### 4.3.1 Replace `analyze-students` Function

**Current**: Supabase Edge Function → Gemini API
**Target**: LangChain + Local/Free LLM

```typescript
// src/services/ai/studentAnalysisService.ts
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export const analyzeStudents = async (students: Student[]) => {
  const llm = new ChatOllama({
    model: "llama3.2:3b",
  });

  const prompt = PromptTemplate.fromTemplate(`
    Analyze the following classroom students and provide insights:
    {students}
    
    Provide a comprehensive classroom summary including:
    1. Overall class dynamics
    2. Learning style distribution
    3. Academic performance patterns
    4. Behavioral considerations
    5. Teaching recommendations
  `);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  
  const result = await chain.invoke({
    students: JSON.stringify(students, null, 2)
  });

  return result;
};
```

#### 4.3.2 Replace `generate-lesson-questions` Function

```typescript
// src/services/ai/lessonQuestionService.ts
export const generateLessonQuestions = async (lessonData: any) => {
  const llm = new ChatOllama({
    model: "llama3.2:3b",
  });

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
    
    Return as JSON array: [{"question": "...", "type": "..."}]
  `);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  
  const result = await chain.invoke(lessonData);
  return JSON.parse(result);
};
```

#### 4.3.3 Replace `process-pdf-knowledge` Function

```typescript
// src/services/ai/pdfProcessingService.ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';

export const processPDFKnowledge = async (text: string, metadata: any) => {
  // Split text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.createDocuments([text], [metadata]);

  // Create embeddings
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "sentence-transformers/all-MiniLM-L6-v2",
  });

  // Store in LanceDB
  const db = await LanceDB.connect('./vectorstore');
  const table = await db.createTable('pdf_knowledge', docs, embeddings);
  
  return { success: true, chunks: docs.length };
};
```

#### 4.3.4 Replace `search-pdf-knowledge` Function

```typescript
// src/services/ai/knowledgeSearchService.ts
export const searchPDFKnowledge = async (query: string, filters?: any) => {
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "sentence-transformers/all-MiniLM-L6-v2",
  });

  const db = await LanceDB.connect('./vectorstore');
  const table = await db.openTable('pdf_knowledge');
  
  const results = await table.search(query)
    .metricType('cosine')
    .limit(5)
    .execute();

  return results;
};
```

#### 4.3.5 Replace `generate-lesson-plan` Function

```typescript
// src/services/ai/lessonPlanGenerationService.ts
import { RetrievalQAChain } from 'langchain/chains';

export const generateLessonPlan = async (lessonData: any, qaAnswers: any) => {
  const llm = new ChatOllama({
    model: "llama3.2:3b",
  });

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
  `;

  const result = await chain.invoke({ query: prompt });
  return result.text;
};
```

## Phase 5: Frontend Integration

### 5.1 Update API Calls

Replace all Supabase function calls with direct service calls:

```typescript
// Before (Edge Functions)
const result = await supabase.functions.invoke('analyze-students');

// After (Direct Service)
import { analyzeStudents } from '@/services/ai/studentAnalysisService';
const result = await analyzeStudents(students);
```

### 5.2 Update Hooks

```typescript
// src/hooks/useLessonPlans.ts
import { pb } from '@/integrations/pocketbase/client';

export const useLessonPlans = () => {
  const fetchLessonPlans = async () => {
    return await pb.collection('lesson_plans').getList(1, 50);
  };

  const createLessonPlan = async (data: any) => {
    return await pb.collection('lesson_plans').create(data);
  };

  // ... other CRUD operations
};
```

### 5.3 Update Components

- Replace Supabase client imports with PocketBase client
- Update file upload/download logic
- Modify authentication flows

## Phase 6: Deployment & Infrastructure

### 6.1 Self-Hosted Setup

**Option 1: VPS (DigitalOcean, Linode, Vultr)**
- $5-10/month for basic VPS
- Run PocketBase, Ollama, LanceDB on same server

**Option 2: Railway/Render (Free Tiers)**
- Free tier available for small projects
- Deploy PocketBase as container

**Option 3: Local Development**
- Run everything locally for development
- Use ngrok for external access if needed

### 6.2 Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb_data
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ./ollama_data:/root/.ollama
    restart: unless-stopped

  lancedb:
    image: lancedb/lance:latest
    ports:
      - "8080:8080"
    volumes:
      - ./lance_data:/data
    restart: unless-stopped
```

## Phase 7: Testing & Validation

### 7.1 Migration Checklist

- [ ] PocketBase installation and configuration
- [ ] Database schema migration
- [ ] Data export/import from Supabase
- [ ] Authentication system migration
- [ ] File storage migration
- [ ] Edge Functions → LangChain conversion
- [ ] Frontend integration updates
- [ ] API endpoint testing
- [ ] Performance validation
- [ ] Security testing

### 7.2 Testing Strategy

1. **Unit Tests**: Test individual LangChain services
2. **Integration Tests**: Test PocketBase + LangChain integration
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Compare response times with Supabase

## Cost Comparison

### Current Supabase Costs (Estimated)
- Database: $25/month (Pro plan)
- Edge Functions: $20/month (compute)
- Storage: $5/month
- **Total: ~$50/month**

### New Setup Costs
- **PocketBase**: Free (self-hosted)
- **Ollama**: Free (local models)
- **Hugging Face**: Free tier (30k requests/month)
- **LanceDB**: Free (embedded)
- **VPS**: $5-10/month (optional)
- **Total: $0-10/month**

## Risk Mitigation

### 1. Data Backup Strategy
- Regular PocketBase backups
- Export data in multiple formats
- Test restore procedures

### 2. Fallback Options
- Keep Supabase as backup during transition
- Implement graceful degradation
- Monitor system health

### 3. Performance Monitoring
- Track response times
- Monitor resource usage
- Set up alerts for failures

## Implementation Timeline

### Week 1-2: Setup & Migration
- Install PocketBase and configure
- Migrate database schema and data
- Set up authentication

### Week 3-4: AI Services Migration
- Install Ollama and models
- Convert Edge Functions to LangChain
- Test AI functionality

### Week 5-6: Frontend Integration
- Update API calls and hooks
- Test all user workflows
- Performance optimization

### Week 7-8: Testing & Deployment
- Comprehensive testing
- Security review
- Production deployment

## Conclusion

This migration will:
- **Reduce costs** by 80-100% (from $50/month to $0-10/month)
- **Improve control** over infrastructure and data
- **Leverage free tools** like Ollama, Hugging Face, and LanceDB
- **Maintain functionality** while improving performance
- **Enable local development** without external dependencies

The transition requires careful planning and testing but will result in a more cost-effective and maintainable system.

