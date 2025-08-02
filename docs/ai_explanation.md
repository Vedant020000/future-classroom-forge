# AI Functionality and Improvement Plan

This document explains how the AI works in the Future Classroom Forge project and outlines a plan for improving its functionality.

## How the AI Works

The AI functionality is powered by a combination of Supabase Edge Functions, the Google Gemini API, and a Retrieval-Augmented Generation (RAG) pipeline.

### 1. Student Analysis (`analyze-students`)

- **Purpose:** To provide teachers with a high-level overview of their classroom dynamics.
- **Process:**
    1. The edge function fetches all student data from the `students` table.
    2. It then sends this data to the Gemini API with a prompt that asks the AI to act as an educational analyst.
    3. The AI analyzes the data and generates a comprehensive summary of the classroom's academic distribution, behavioral patterns, engagement levels, and learning styles.
    4. This summary is then stored in the `classroom_summaries` table to be displayed on the teacher's dashboard.

### 2. Lesson Plan Generation (`generate-lesson-plan`)

- **Purpose:** To create detailed, research-backed lesson plans.
- **Process:**
    1. This function uses a RAG pipeline, which combines the power of a large language model (Gemini) with the ability to retrieve information from a specific knowledge base.
    2. The knowledge base is created by the `process-pdf-knowledge` function, which splits uploaded PDF documents into smaller chunks and stores them as vectors in the `pdf_knowledge_chunks` table.
    3. When a teacher wants to create a lesson plan, the `generate-lesson-plan` function retrieves the most relevant chunks of information from the knowledge base based on the teacher's input.
    4. This retrieved information is then passed to the Gemini API along with the teacher's input and a detailed prompt.
    5. The AI uses this context to generate a comprehensive lesson plan that is both tailored to the teacher's needs and grounded in educational research.

### 3. Lesson Plan Refinement (`generate-lesson-questions`)

- **Purpose:** To help teachers refine their lesson plans by asking insightful follow-up questions.
- **Process:**
    1. When a teacher provides initial details for a lesson plan, this function sends the information to the Gemini API.
    2. The AI is prompted to generate 10 practical questions that will help the teacher think more deeply about their lesson plan.
    3. These questions are then presented to the teacher, who can use them to provide more specific information and create a more effective lesson plan.

## How to Make it Better

The `docs/backend_todo.md` file contains a comprehensive list of potential improvements. Here are some of the key areas for improvement:

### High Priority

- **Implement comprehensive authentication and authorization:** This is a critical step to ensure that the AI is only used by authorized users and that they can only access their own data.
- **Add robust error handling and logging:** This will make it easier to debug issues with the AI and ensure that it is running smoothly.
- **Write unit and integration tests:** This will help to ensure that the AI is behaving as expected and that it is not introducing any regressions.

### Medium Priority

- **Optimize Gemini API prompts:** The quality of the AI-generated content is highly dependent on the quality of the prompts. By refining the prompts, we can improve the quality and consistency of the AI's output.
- **Implement a background job for student analysis:** This will improve the user experience by ensuring that the classroom summary is always up-to-date without requiring the user to wait for the analysis to complete.
- **Add support for more file types:** This will make the lesson plan generation feature more useful by allowing teachers to upload a wider range of documents.

### Low Priority

- **Add a feedback mechanism:** This will allow us to collect data on the quality of the AI-generated content and use it to further improve the system.
- **Implement a usage tracking system:** This will help us to monitor the health of the system and identify any potential issues.
