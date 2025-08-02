# Backend To-Do and Completion List

This document outlines the current status and future tasks for the backend of the Future Classroom Forge project.

## Completed Items

### Database Schema
- **[x] `students` table:** Stores detailed information about each student, including academic level, behavior, engagement, and learning style.
- **[x] `organizations` table:** Manages organizations, including their subscription status.
- **[x] `organization_credentials` table:** Securely stores credentials for organization members.
- **[x] `profiles` table:** Manages user profiles, distinguishing between individual and organization users.
- **[x] `lesson_plans` table:** Stores lesson plans created by individual teachers.
- **[x] `organization_lesson_plans` table:** Stores lesson plans specific to organizations.
- **[x] `classroom_summaries` table:** Caches AI-generated summaries of classroom data to improve performance and track changes.
- **[x] `pdf_knowledge_chunks` table:** Stores vectorized chunks of uploaded PDF documents for RAG-based lesson plan generation.

### Edge Functions
- **[x] `analyze-students`:**
    - Fetches all student data.
    - Uses the Gemini API to generate a comprehensive classroom summary.
    - Stores the summary in the `classroom_summaries` table.
- **[x] `generate-lesson-plan`:**
    - Implements a RAG pipeline using LangChain.
    - Retrieves relevant educational research from the `pdf_knowledge_chunks` vector store.
    - Uses the Gemini API to generate a detailed, research-backed lesson plan based on user input and retrieved context.
- **[x] `generate-lesson-questions`:**
    - Takes initial lesson plan details as input.
    - Uses the Gemini API to generate 10 insightful follow-up questions to help refine the lesson plan.
- **[x] `process-pdf-knowledge`:**
    - Receives PDF content and metadata.
    - Splits the text into manageable chunks.
    - Generates embeddings using OpenAI.
    - Stores the vectorized chunks in the `pdf_knowledge_chunks` table.
- **[x] `search-pdf-knowledge`:**
    - Provides a simple interface to search the `pdf_knowledge_chunks` vector store.
    - Filters results by subject and grade level.

## To-Do Items

### High Priority
- **[ ] Implement comprehensive authentication and authorization:**
    - Secure all edge functions with proper Supabase auth checks.
    - Refine RLS policies to ensure users can only access their own data.
- **[ ] Add robust error handling and logging:**
    - Implement a centralized logging solution for all edge functions.
    - Provide more informative error messages to the frontend.
- **[ ] Unit and integration tests:**
    - Write tests for all edge functions to ensure they behave as expected.
    - Create integration tests for the entire backend workflow.
- **[ ] Finalize the `organization_credentials` and `profiles` relationship:**
    - Ensure that the relationship between `organization_credentials` and `profiles` is correctly implemented and that organization users are properly associated with their organizations.

### Medium Priority
- **[ ] Optimize Gemini API prompts:**
    - Refine the prompts used in all edge functions to improve the quality and consistency of the AI-generated content.
- **[ ] Implement a background job for student analysis:**
    - Instead of running the analysis on-demand, trigger it as a background job whenever student data changes.
- **[ ] Add support for more file types:**
    - Extend the `process-pdf-knowledge` function to handle other file types like `.docx` and `.pptx`.
- **[ ] Implement a more sophisticated classroom summary strategy:**
    - Instead of a single summary, generate summaries based on different criteria (e.g., by subject, by grade level).

### Low Priority
- **[ ] Add a feedback mechanism:**
    - Allow users to provide feedback on the quality of the AI-generated content.
- **[ ] Implement a usage tracking system:**
    - Track API usage and other metrics to monitor the health of the system.
