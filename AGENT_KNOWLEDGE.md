# AGENT KNOWLEDGE BASE - SCP-OOGIRI (Cosmic Aphelion)

> **CRITICAL INSTRUCTION**: This file is the **Source of Truth** for the AI Agent working on this project.
> **ALWAYS READ THIS FILE** at the start of a new session or when encountering unknown errors.
> **UPDATE THIS FILE** whenever new specifications, library quirks, or recurring bugs are discovered.

## 1. Project Architecture & Specifications

### Data Structures
- **Reports (Supabase)**:
  - Table: `reports`
  - Column `content`: Stored as a **JSON Object** (JSONB), NOT a string.
  - **Structure**:
    ```json
    {
      "containmentProcedures": "...",
      "descriptionEarly": "...",
      "descriptionLate": "...",
      "conclusion": "...",
      "constraint": { ... },
      "selectedKeywords": [...]
    }
    ```
  - **Handling**: When fetching for the Game Page (D-Class), the `content` object MUST be **stringified** (`JSON.stringify`) before being passed to the AI System Prompt. Failing to do so results in `[object Object]` in the prompt or client-side crashes.

### Game Phases
- **Result Phase**: Uses in-memory `GameState` where report fields are flattened (e.g., `report.descriptionEarly`).
- **D-Class Mode**: Fetches directly from DB, so it receives the nested `content` object.

## 2. External Libraries & Tools

### AI Models (Google Gemini)
- **Latest Model**: `gemini-2.5-flash-lite` (As of July 2025).
- **Deprecated/Invalid**: `gemini-2.5-flash-lite-preview`, `gemini-1.5-flash` (older).
- **Configuration**: `client/src/app/api/chat/route.ts`

### Vercel AI SDK (`@ai-sdk/react`)
- **Known Issues**:
  - `useChat` hook can cause `TypeError: f is not a function` during `append` or `handleSubmit` in some environments/versions.
  - `input` state from `useChat` may be `undefined` initially, causing `.trim()` crashes.
- **Best Practice**: Use **Manual Fetch Implementation** for chat interfaces instead of `useChat` to ensure stability and control.
  - Manage `messages` and `inputValue` with local `useState`.
  - Use `fetch('/api/chat', ...)` and handle the stream manually with `TextDecoder`.

### Deployment (Vercel/Render)
- **Environment Variables**:
  - `GOOGLE_GENERATIVE_AI_API_KEY`: Required for the Chat API to function. Must be set in the **Server/Deployment Settings** (not just local `.env`).
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Required for client-side DB access.

### Security
- **CVE-2025-55182 (React Server Components)**:
  - Critical vulnerability allowing RCE.
  - **Patched Versions**: Next.js >= 16.0.7, React >= 19.2.1.
  - **Status**: Project is currently using patched versions (Next.js 16.0.7, React 19.2.1).

## 3. Known Issues & Fixes (History)

### D-Class Game Page Crash (Solved)
- **Symptoms**: "Application error", `TypeError: Cannot read properties of undefined (reading 'trim')`, `[object Object]` in AI response.
- **Causes**:
  1. `report.content` from DB is an Object, but code expected String.
  2. `useChat` input state was unstable.
  3. Missing API Key.
  4. Incorrect AI Model Name.
- **Solution**:
  1. `JSON.stringify(data.content)` before setting state.
  2. Switch to Manual Fetch for chat.
  3. Set `GOOGLE_GENERATIVE_AI_API_KEY`.
  4. Use `gemini-2.5-flash-lite`.

### Middleware Route Protection
- **Issue**: New routes (e.g., `/d-class/mock`) redirect to `/login` if not explicitly excluded.
- **Fix**: Update `client/src/middleware.ts` to add new public paths to the exclusion list.

## 4. Tech Stack & Key Files

### Core Technologies
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Real-time**: Socket.IO (Server: `server/`, Client: `client/`)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API via Vercel AI SDK (or manual fetch)

### Key File Locations
- **Game Manager (Server)**: `server/src/gameManager.ts` (Core game logic, state management)
- **Socket Handler (Server)**: `server/index.ts` (Event listeners)
- **Game Pages (Client)**:
  - Lobby: `client/src/components/Lobby.tsx`
  - Result: `client/src/components/Result.tsx`
  - D-Class Mode: `client/src/app/d-class/game/page.tsx`
- **Types**: `client/src/types.ts` (Shared interfaces)

## 5. Game Flow Overview
1.  **Lobby**: Users join, Host starts game.
2.  **Suggestion**: Players suggest keywords.
3.  **Choice**: Players vote on keywords.
4.  **Scripting (Phases 1-4)**: Players write report sections (Procedures, Description, etc.) in a round-robin format.
5.  **Presentation**: Players present their reports.
6.  **Voting**: Players vote on the best report.
7.  **Result**: Winner is announced.
8.  **D-Class Mode (Async)**: Players can later "play" the reports as a text adventure.

## 6. Future Development Guidelines
- **Aesthetics**: Use "SCP Terminal" aesthetic (Black background, Green/Red text, Monospace fonts, CRT effects).
- **Error Handling**: Always implement **Error Boundaries** (`error.tsx`) for new page routes to catch production errors gracefully.
- **Verification**: When adding new AI features, **verify the Model Name** and **API Key presence** immediately.
