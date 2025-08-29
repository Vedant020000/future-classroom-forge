# Implementation Plan

[Overview]
This document outlines the plan to migrate the Future Classroom Forge application from a Supabase-centric architecture to a self-hosted stack using PocketBase, LangChain, and Ollama, with a primary focus on minimizing operational costs.

The current implementation relies on Supabase for database, authentication, storage, and serverless functions, incurring monthly costs. The migration will replace these services with free, open-source, and self-hosted alternatives. PocketBase will serve as the backend-in-a-box, handling database, auth, and file storage. All AI and RAG functionalities, previously in Supabase Edge Functions, will be re-implemented as services within the frontend application using LangChain.js, powered by a locally-run Ollama instance for LLM inference and Hugging Face sentence-transformers for embeddings. This shift will eliminate vendor lock-in and reduce hosting costs to near-zero, while maintaining the core functionality of the application.

[Types]
This migration will introduce new TypeScript types for PocketBase collections and update existing types to reflect the new schema.

```typescript
// src/integrations/pocketbase/types.ts

export interface PocketBaseUser {
  id: string;
  collectionId: string;
  collectionName: 'users';
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: string;
  created: string;
  updated: string;
  name: string;
  avatar: string;
  user_type: 'individual' | 'organization';
  organization_id?: string;
  gemini_api_key?: string; // This will be deprecated but kept for now
}

export interface PocketBaseStudent {
  id: string;
  collectionId: string;
  collectionName: 'students';
  name: string;
  grade: string;
  academic_level: 'Advanced' | 'Grade Level' | 'Below Grade';
  behavior: 'Excellent' | 'Good' | 'Needs Support';
  engagement: 'High' | 'Medium' | 'Low';
  learning_style: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading/Writing';
  notes?: string;
  subjects?: string[];
  avatar?: string;
  teacher_id: string; // Foreign key to users collection
  created: string;
  updated: string;
}

export interface PocketBaseLessonPlan {
  id: string;
  collectionId: string;
  collectionName: 'lesson_plans';
  title: string;
  subject: string;
  grade_level: string;
  description?: string;
  duration?: number;
  file: string; // file attachment
  status: 'draft' | 'active' | 'completed' | 'archived';
  teacher_id: string; // Foreign key to users collection
  organization_id?: string; // Foreign key to organizations collection
  created: string;
  updated: string;
}

export interface PocketBaseOrganization {
    id: string;
    collectionId: string;
    collectionName: 'organizations';
    name: string;
    subscription_status: 'active' | 'inactive' | 'trial';
    created: string;
    updated: string;
}

export interface PocketBaseClassroomSummary {
    id: string;
    collectionId: string;
    collectionName: 'classroom_summaries';
    summary: string;
    student_count: number;
    generated_at: string;
    teacher_id: string; // Foreign key to users collection
    created: string;
    updated: string;
}

export interface PocketBasePdfKnowledgeChunk {
    id: string;
    collectionId: string;
    collectionName: 'pdf_knowledge_chunks';
    content: string;
    metadata: {
        filename: string;
        subject?: string;
        grade_level?: string;
        page?: number;
    };
    teacher_id: string; // Foreign key to users collection
    created: string;
}
```

[Files]
This migration involves creating new files for PocketBase integration and AI services, modifying existing hooks and components to use the new services, and removing Supabase-related files.

**New Files:**
- `src/integrations/pocketbase/client.ts`: To initialize and export the PocketBase client instance.
- `src/integrations/pocketbase/types.ts`: To define the TypeScript types for the PocketBase collections.
- `src/services/ai/baseService.ts`: To configure and export instances of the local LLM (Ollama) and embedding models.
- `src/services/ai/studentAnalysisService.ts`: To replace the `analyze-students` edge function.
- `src/services/ai/lessonQuestionService.ts`: To replace the `generate-lesson-questions` edge function.
- `src/services/ai/pdfProcessingService.ts`: To replace the `process-pdf-knowledge` edge function.
- `src/services/ai/knowledgeSearchService.ts`: To replace the `search-pdf-knowledge` edge function.
- `src/services/ai/lessonPlanGenerationService.ts`: To replace the `generate-lesson-plan` edge function.
- `src/services/pocketbase/lessonPlanService.ts`: New service for CRUD operations on lesson plans in PocketBase.
- `src/services/pocketbase/studentService.ts`: New service for CRUD operations on students in PocketBase.
- `src/services/pocketbase/classroomSummaryService.ts`: New service for classroom summaries in PocketBase.
- `docker-compose.yml`: To manage PocketBase and Ollama services for local development.
- `scripts/migrate-data.ts`: A one-time script to migrate data from Supabase to PocketBase.

**Modified Files:**
- `src/hooks/useAuth.tsx`: To be completely rewritten to use PocketBase authentication.
- `src/hooks/useLessonPlans.ts`: To use `src/services/pocketbase/lessonPlanService.ts`.
- `src/hooks/useStudents.ts`: To use `src/services/pocketbase/studentService.ts`.
- `src/hooks/useClassroomSummary.ts`: To use `src/services/pocketbase/classroomSummaryService.ts` and the new AI service.
- `src/pages/CreateLessonPlanPage.tsx`: To call the new LangChain-based AI services directly instead of Supabase functions.
- `src/components/pdf-knowledge/PDFUploadDialog.tsx`: To use the new `pdfProcessingService`.
- `package.json`: To add new dependencies (`pocketbase`, `langchain`, `@langchain/community`, `lancedb`, `pdf-parse`) and scripts for running PocketBase and Ollama.

**Deleted Files:**
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `src/services/individualLessonPlanService.ts`
- `src/services/organizationLessonPlanService.ts`
- The entire `supabase/` directory.

[Functions]
This migration will replace all Supabase Edge Functions with client-side service functions using LangChain.js.

**New Functions:**
- `createLLM()` in `src/services/ai/baseService.ts`: Returns a `ChatOllama` instance for interacting with the local LLM.
- `createEmbeddings()` in `src/services/ai/baseService.ts`: Returns a `HuggingFaceTransformersEmbeddings` instance for generating text embeddings.
- `analyzeStudents(students: PocketBaseStudent[]): Promise<string>` in `src/services/ai/studentAnalysisService.ts`: Takes student data, generates a summary using the local LLM.
- `generateLessonQuestions(lessonData: any): Promise<any[]>` in `src/services/ai/lessonQuestionService.ts`: Generates follow-up questions for a lesson plan.
- `processPDFKnowledge(text: string, metadata: any): Promise<any>` in `src/services/ai/pdfProcessingService.ts`: Splits text, creates embeddings, and stores them in a local LanceDB vector store.
- `searchPDFKnowledge(query: string, filters?: any): Promise<any[]>` in `src/services/ai/knowledgeSearchService.ts`: Searches the local LanceDB vector store.
- `generateLessonPlan(lessonData: any, qaAnswers: any): Promise<string>` in `src/services/ai/lessonPlanGenerationService.ts`: Generates a lesson plan using a RAG pipeline with local data.

**Removed Functions:**
- `analyze-students` (Supabase Edge Function)
- `generate-lesson-plan` (Supabase Edge Function)
- `generate-lesson-questions` (Supabase Edge Function)
- `process-pdf-knowledge` (Supabase Edge Function)
- `search-pdf-knowledge` (Supabase Edge Function)

[Classes]
No new classes will be introduced. The migration focuses on functional components and services.

[Dependencies]
This migration will add new dependencies for PocketBase, LangChain, and related tools, and remove Supabase dependencies.

**New Dependencies:**
- `pocketbase`: The JavaScript client for PocketBase.
- `langchain`: The core LangChain.js library.
- `@langchain/community`: For community-contributed integrations like Ollama and Hugging Face.
- `lancedb`: For the embedded vector database.
- `pdf-parse`: For extracting text from PDF files on the client-side.
- `sentence-transformers`: For local embedding models.

**Removed Dependencies:**
- `@supabase/supabase-js`

[Testing]
The testing strategy will focus on ensuring the new services and hooks function correctly and that the application's behavior remains consistent after the migration.

- **Unit Tests**: Write unit tests for the new AI services (`studentAnalysisService`, `lessonPlanGenerationService`, etc.) to verify prompt construction and data handling. Mock the LLM and embedding model responses.
- **Integration Tests**: Test the integration between the React components, hooks, and the PocketBase client. Ensure data is fetched and updated correctly.
- **End-to-End Tests**: Manually test the full user flows: authentication, student management, lesson plan creation (including PDF upload and RAG), and viewing classroom summaries.

[Implementation Order]
The implementation will be done in a phased approach to minimize disruption and allow for testing at each stage.

1.  **Setup PocketBase and Ollama**: Create the `docker-compose.yml` file and start the PocketBase and Ollama services. Manually create the collections in the PocketBase admin UI to match the new schema.
2.  **Migrate Authentication**: Create the PocketBase client and types. Rewrite the `useAuth` hook and update all related components to use PocketBase for authentication.
3.  **Migrate Data**: Implement and run the `scripts/migrate-data.ts` script to move existing data from Supabase to PocketBase.
4.  **Implement AI Services**: Create the new AI services using LangChain.js, Ollama, and LanceDB.
5.  **Migrate Core Features**: One by one, migrate the hooks and components for students, lesson plans, and classroom summaries to use the new PocketBase services and AI services.
6.  **Update Frontend**: Replace all remaining instances of the Supabase client and remove the old Supabase files.
7.  **Final Testing**: Perform thorough end-to-end testing of the entire application.
