## Future Classroom Forge — Project Summary

### What this application is

- **Purpose**: A teacher-focused platform to generate, organize, and use research-backed lesson plans; manage students; and run a virtual classroom. AI features use Gemini (for generation/analysis) and a RAG pipeline over teacher-uploaded PDFs stored as embeddings in Supabase.
- **Core pillars**:
  - **Lesson plans**: Upload, generate (AI + RAG), preview, store, and manage lesson plans.
  - **Knowledge base (RAG)**: Upload PDFs; content is chunked, embedded, and stored in Supabase for retrieval during lesson generation.
  - **Students**: CRUD for student profiles and an AI-generated classroom summary.
  - **Virtual classroom**: A presentational UI for running a class with basic controls and participant layout.

### Tech stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6, TanStack Query, Tailwind CSS, shadcn-ui, lucide-react, pdfjs-dist
- **Backend (serverless)**: Supabase Edge Functions (Deno), LangChain, Google Gemini, OpenAI Embeddings, Supabase Vector store
- **Database**: Supabase Postgres with `vector` extension; tables for students, profiles, lesson plans, organization lesson plans, classroom summaries, and `pdf_knowledge_chunks`

### How the app is structured

- `src/main.tsx` → mounts React app
- `src/App.tsx` → providers, routing, and main layout shell
- `src/pages/*` → route screens
- `src/components/*` → UI building blocks and feature components
- `src/hooks/*` → React Query data hooks and auth/context hooks
- `src/services/*` → service layer for lesson plan CRUD and file storage
- `src/integrations/supabase/*` → typed Supabase client and DB types
- `supabase/functions/*` → Edge Functions implementing AI, RAG, and PDF processing
- `docs/*` → design notes, DB schema dumps, and plans

### Routing and primary screens

Defined in `src/App.tsx`:
- `/dashboard` → `DashboardPage`: stats and recent activity, derived from lesson plans and students
- `/lesson-plans` → `LessonPlanPage`: search, preview, delete, and upload lesson plans
- `/create-lesson-plan` → `CreateLessonPlanPage`: multi-step AI flow to generate a RAG-enhanced plan; integrates PDF knowledge; saves plan to storage + DB
- `/students` → `StudentsPage`: list, add/edit/delete students; trigger AI classroom summary
- `/virtual-classroom` → `VirtualClassroomPage`: staged video/participants layout with basic controls
- `/settings` → `SettingsPage`: store Gemini API key (front-end context only for now)
- `/admin` → `AdminDashboardPage` (placeholder)
- fallback `*` → `NotFound`

### Layouts and navigation

- `src/components/layout/MainLayout.tsx` → global shell with `Sidebar` for most routes
- `src/components/layout/Sidebar.tsx` → sidebar nav (Dashboard, Lesson Plans, Create, Virtual Classroom, Students, Settings)
- `src/components/layout/VirtualClassroomLayout.tsx` → dedicated layout for the classroom view

### Authentication

- `src/hooks/useAuth.tsx` → currently a mocked auth provider returning a static user and profile. Exposes:
  - `user`, `session`, `profile`, `loading` and methods `signIn`, `signUp`, `signInWithGoogle`, `signInWithOrganization`, `signOut`, `updateProfile` (no-op stubs)
- `src/components/auth/ProtectedRoute.tsx` / `AuthRoute.tsx` → wrappers that read `useAuth()` and gate routes
- `src/pages/AuthPage.tsx` + `components/auth/*` → organization login flow UI (demo credentials in the UI); wired to `useAuth` stubs

Important: Real Supabase Auth is not yet wired. See docs “Backend To-Do” for planned auth and RLS work.

### Lesson plans (frontend)

- Hook: `src/hooks/useLessonPlans.ts`
  - Resolves user type (organization vs individual) based on id heuristic
  - Fetches plans via corresponding service; manages uploads/deletes; exposes `getFileUrl`
- Services:
  - `src/services/individualLessonPlanService.ts` → CRUD on `lesson_plans` and storage bucket `lesson-plans`
  - `src/services/organizationLessonPlanService.ts` → CRUD on `organization_lesson_plans` and storage bucket `organization-lesson-plans`
- UI:
  - `LessonPlanHeader`, `LessonPlanSearch`, `LessonPlanGrid`, `LessonPlanCard`, `PreviewLessonPlanDialog`, `UploadLessonPlanDialog`
  - `PreviewLessonPlanDialog` fetches signed URL via `getFileUrl` and renders inline PDF or download/open actions

### Create Lesson Plan flow (AI + RAG)

- `src/pages/CreateLessonPlanPage.tsx` implements a 4-step flow:
  1) Collect lesson meta (title, subject, grade, duration, objectives, outline, student needs)
  2) Generate 10 AI questions via `supabase.functions.invoke('generate-lesson-questions')`
  3) Generate RAG-enhanced plan via `supabase.functions.invoke('generate-lesson-plan')`
  4) Save plan as `.md` (stored via upload hook) and optionally send to Virtual Classroom
- PDF knowledge upload: `src/components/pdf-knowledge/PDFUploadDialog.tsx`
  - Client-side text extraction via `pdfjs-dist`
  - Invokes `process-pdf-knowledge` edge function with text + metadata to chunk + embed + store in `pdf_knowledge_chunks`

### Students and AI classroom summary

- Hook: `src/hooks/useStudents.ts` → CRUD on `students` table
- Components: `AddStudentDialog`, `StudentCard`
- Classroom summary:
  - Hook: `src/hooks/useClassroomSummary.ts` reads cached summary from `classroom_summaries` and can trigger regeneration
  - Component: `ClassroomSummary` shows summary and metadata; invokes `analyze-students` edge function

### Virtual classroom

- `src/pages/VirtualClassroomPage.tsx` + `VirtualClassroomLayout`
- Presentational UI: teacher tile + participant grid, simple chat panel, and controls (mic/video/screen share toggles)
- Receives lesson plan context via `localStorage` when sent from Create flow

### Supabase Edge Functions (serverless)

- `supabase/functions/analyze-students/index.ts`
  - Fetches all students; crafts a prompt; calls Gemini `gemini-1.5-flash-latest`; upserts summary into `classroom_summaries`
  - Requires env: `GOOGLE_AI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `supabase/functions/generate-lesson-questions/index.ts`
  - Crafts a prompt from initial lesson data; calls Gemini; extracts a JSON array of 10 questions (with fallback)
  - Env: `GOOGLE_AI_API_KEY`
- `supabase/functions/process-pdf-knowledge/index.ts`
  - Splits text with LangChain `RecursiveCharacterTextSplitter`; embeds with `OpenAIEmbeddings`; stores in Supabase via `SupabaseVectorStore`
  - Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`
- `supabase/functions/search-pdf-knowledge/index.ts`
  - Retrieves relevant documents via Supabase Vector store with optional filters (`subject`, `gradeLevel`)
  - Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`
- `supabase/functions/generate-lesson-plan/index.ts`
  - Builds a LangChain Retrieval chain: Supabase retriever → `PromptTemplate` → `ChatGoogleGenerativeAI` (Gemini) → `StringOutputParser`
  - Includes teacher Q&A answers in prompt; returns the plan text
  - Env: `GOOGLE_AI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`

### Database schema (key tables)

See `docs/tables.json` for full definitions; notable tables:
- `students`: student profile attributes, with controlled vocab for academic level, behavior, engagement, learning style
- `lesson_plans`: individual teacher plans with file metadata and status
- `organization_lesson_plans`: org-scoped plans linked to `organization_id` and `teacher_id`
- `classroom_summaries`: cached AI summary (id currently fixed to `main-classroom`)
- `pdf_knowledge_chunks`: text chunks + metadata + `vector` embedding column
- `profiles`: user metadata including `user_type`, org linkage, and potential `gemini_api_key` (frontend references this field)
- `organizations`, `organization_credentials`: org constructs and credential records

Extensions (from `docs/extensions.json`): includes `vector` (installed), plus many optional extensions available; project primarily relies on `vector` for RAG.

Migrations: SQL files present in `supabase/migrations/` define the schema and constraints referenced above.

### Supabase client (frontend)

- `src/integrations/supabase/client.ts` sets up a typed Supabase client using `@supabase/supabase-js` and local generated types in `src/integrations/supabase/types.ts`.
- Note: A concrete project URL and anon key are embedded for development. For production, rotate and store securely.

### UI component library

- `src/components/ui/*` are shadcn-ui components and wrappers used throughout the app (accordion, alert-dialog, button, card, dialog, select, table, etc.).

### Build and configuration

- `vite.config.ts`: dev server on port 8080, alias `@` → `./src`, React SWC plugin, and `lovable-tagger` in dev
- `tailwind.config.ts`: standard shadcn config with dark mode and custom `sidebar` palette
- `index.html`: mounts the app; loads `src/main.tsx`
- `package.json` scripts: `dev`, `build`, `build:dev`, `preview`, `lint`

### Docs and internal plans

- `docs/ai_explanation.md`: overview of AI flows and suggested improvements/priorities
- `docs/backend_todo.md`: done/to-do items for backend, including auth/RLS/logging/tests
- `docs/rag_and_gemini_integration.md`: RAG components, Gemini usage, and ranking/filtering strategy
- `docs/individual_api_key_plan.md`: plan to use per-teacher Gemini keys from `profiles`
- `docs/tables.json`, `docs/extensions.json`: exported DB schema and installed extensions
- `docs/migrations.json`, `docs/edge_functions.json`: currently empty placeholders

### Developer workflows

Local development:
- Prereqs: Node.js, npm
- Commands:
  - `npm i`
  - `npm run dev` → Vite dev server at port 8080

Supabase Edge Functions env configuration (configure in Supabase project):
- `GOOGLE_AI_API_KEY`
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (where required)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; DO NOT expose in client)

Storage buckets used:
- `lesson-plans` → individual plans
- `organization-lesson-plans` → org plans

### Security and data considerations

- Auth is mocked on the frontend; backend functions rely on keys and do not yet enforce user-level access. Implement Supabase Auth, RLS, and auth checks for all tables and functions as planned in `docs/backend_todo.md`.
- Anon key is present in the client for development; ensure appropriate RLS policies before going live.
- Edge functions call external AI providers with student and lesson content. Ensure privacy/compliance (e.g., redact PII, obtain consent, and follow applicable policies like FERPA/GDPR as relevant).

### Known gaps and next steps (from project + docs)

- Implement real authentication + authorization; wire `useAuth` to Supabase Auth and profiles
- Enforce RLS on data tables and protect Edge Functions
- Centralize error handling/logging and add unit/integration tests
- Parameterize prompts and improve quality controls
- Background job for classroom summary regeneration
- Support more file types for knowledge ingestion (docx/pptx) beyond PDF text extraction

### File-by-folder quick index (selected)

- `src/pages/DashboardPage.tsx`: stats from hooks, progress meters, recent plans
- `src/pages/LessonPlanPage.tsx`: list/search/preview/delete lesson plans
- `src/pages/CreateLessonPlanPage.tsx`: 4-step AI plan generation; PDF upload dialog; save/download/send-to-classroom
- `src/pages/StudentsPage.tsx`: student list, `ClassroomSummary`, `AddStudentDialog`
- `src/pages/VirtualClassroomPage.tsx`: classroom surface and side panels
- `src/pages/SettingsPage.tsx`: API key capture (front-end only at present)
- `src/services/*`: individual/organization plan services using Supabase DB + Storage
- `src/hooks/*`: data fetching/mutations for lesson plans, students, classroom summary; mocked auth context
- `src/components/lesson-plans/*`: header/search/grid/card/upload/preview
- `src/components/students/*`: student card, add dialog, classroom summary panel
- `src/components/pdf-knowledge/PDFUploadDialog.tsx`: client extract → edge function for chunk/embeddings
- `supabase/functions/*`: all AI and RAG server logic

### Quick start for contributors

1) Run the app with `npm run dev`
2) Use `Create Lesson Plan` to try AI generation; optionally upload PDFs to enrich RAG
3) Add a few `Students` and generate `Classroom AI Summary`
4) Explore `Lesson Plans` to preview and manage uploads
5) Review `docs/backend_todo.md` and `docs/ai_explanation.md` before making backend changes


