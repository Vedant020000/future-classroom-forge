# RAG System and Gemini API Integration

This document outlines how the application uses a Retrieval-Augmented Generation (RAG) system with the Gemini API to generate educational content.

## RAG System

The RAG system is responsible for processing, storing, and retrieving knowledge from uploaded PDF documents. It consists of three main components:

1.  **`process-pdf-knowledge`:** This function is triggered when a user uploads a PDF. It performs the following steps:
    *   **Chunking:** It splits the PDF content into smaller, meaningful chunks (between 200 and 800 characters). It filters out irrelevant content like page numbers and tables of contents.
    *   **Metadata:** It attaches metadata to each chunk, including the source filename, page number, category, subject, and grade level.
    *   **Embedding Generation:** It calls the `generate-embeddings` function to create a vector embedding for each chunk using the `text-embedding-3-small` model from OpenAI.
    *   **Storage:** It stores the chunks and their corresponding embeddings in the `pdf_knowledge_chunks` table in the Supabase database.

2.  **`generate-embeddings`:** This function is a dedicated service for generating embeddings.
    *   It takes an array of texts as input.
    *   It uses the OpenAI API (`https://api.openai.com/v1/embeddings`) and the `text-embedding-3-small` model to generate the embeddings.
    *   It requires an `OPENAI_API_KEY` to be configured as an environment variable.

3.  **`search-pdf-knowledge`:** This function searches the knowledge base for a given query.
    *   **Hybrid Search:** It uses a hybrid approach that combines semantic search and keyword search to provide more relevant results.
    *   **Semantic Search:** It generates an embedding for the user's query and calculates the cosine similarity between the query embedding and the embeddings of the stored chunks. This accounts for 70% of the final results.
    *   **Keyword Search:** It performs a full-text search on the content of the chunks and scores the results based on keyword matching, proximity, and the presence of educational terms. This accounts for 30% of the final results.
    *   **Filtering:** It allows filtering the search results by `subject` and `gradeLevel`.
    *   **Ranking:** It removes duplicates and ranks the final results by relevance score.

## Gemini API Integration

The Gemini API is used to generate various types of educational content, often enhanced by the information retrieved from the RAG system.

1.  **`generate-lesson-plan`:** This function generates a detailed lesson plan.
    *   **RAG Integration:** It uses the `search-pdf-knowledge` function to find relevant information from the knowledge base. It then includes this information in the prompt for the Gemini API.
    *   **Gemini API:** It uses the `gemini-1.5-flash` model to generate a comprehensive, research-backed lesson plan. The prompt includes the lesson requirements, teacher input, and the retrieved knowledge chunks.

2.  **`generate-lesson-questions`:** This function generates a set of questions to help a teacher create a more detailed lesson plan.
    *   **Gemini API:** It uses the `gemini-1.5-flash-latest` model to generate 10 insightful questions based on the provided lesson data.

3.  **`analyze-students`:** This function analyzes student data and generates a classroom summary.
    *   **Gemini API:** It uses the `gemini-1.5-flash-latest` model to generate a summary of the classroom's academic distribution, behavioral patterns, engagement levels, and learning styles. The prompt includes all student data from the `students` table.
    *   **Data Storage:** It stores the generated summary in the `classroom_summaries` table.
