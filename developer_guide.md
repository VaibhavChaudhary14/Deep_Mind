# Deep Mind Developer Guide

Welcome to the **Deep Mind** developer guide! This document outlines the architecture, directory structure, state management, and conventions used in the project to help new developers onboard quickly.

## Architecture Overview

Deep Mind is a **local-first, AI-powered career accelerator** built with the following core stack:
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion (for animations and interactions)
- **Storage Strategy**: Local-First with Background Sync
  - **Local Database**: IndexedDB managed via Dexie.js
  - **Cloud/Remote Database**: PostgreSQL on Supabase
- **State Management**: Zustand (local state & gamification) + Dexie Hooks (persistent data state)
- **AI Integrations**: Vercel AI SDK + Google Gemini Pro
- **Authentication**: Supabase Auth

## Directory Structure

The repository is structured around Next.js App Router conventions, with domain-driven component organization:

```text
Deep_Mind/
├── app/                  # Next.js App Router pages, layouts, and API routes
├── components/           # Reusable React components
│   ├── dashboard/        # Dashboard layout components
│   ├── features/         # Domain-specific components (e.g., TodoBoard, RoadmapView)
│   ├── layout/           # Shared layout components (Shell, Sidebar, etc.)
│   ├── providers/        # Context Providers (e.g., AuthProvider, LayoutProvider)
│   ├── saas/             # Product landing, pricing, and onboarding UI
│   └── ui/               # Base reusable UI elements (Buttons, Cards, Modals)
├── hooks/                # Custom React Hooks
├── lib/                  # Shared utilities and core logic
│   ├── ai.ts             # AI service wrappers and Google Gemini Pro integration
│   ├── db.ts             # Dexie.js local database initialization
│   ├── gamification.ts   # Core logic for XP, levels, and streak calculation
│   ├── supabase.ts       # Supabase client instances
│   ├── sync.ts           # Background sync logic between Dexie and Supabase
│   └── utils.ts          # Helper functions (e.g., Tailwind class merging via clsx/twMerge)
├── store/                # Global state stores via Zustand
│   └── use-xp.ts         # Global store for Experience Points & Gamification progression
├── public/               # Static assets (images, icons)
├── supabase_schema.sql   # SQL file defining the Supabase cloud tables and RLS policies
└── task.md               # The project roadmap and active task tracker
```

## Key Systems & Workflows

### 1. Data Flow (Local-First Architecture)
The application fundamentally treats the **local Dexie database as the source of truth** for blazing-fast interactions and offline availability.

**Reading Data:**
- Use `useLiveQuery` from `dexie-react-hooks` in components to directly query `lib/db.ts`.

**Writing Data:**
- Perform transactions directly against the local Dexie DB.
- A background process (`lib/sync.ts`) listens to local mutations or runs on an interval to sync these changes upward to Supabase. This ensures zero latency on the frontend while providing cross-device continuity.

### 2. Gamification System
Deep Mind features a RPG-like gamification layer for professional tasks.
- **Engine Logic:** `lib/gamification.ts` handles how points are distributed for events like task completions, deep work sessions, and roadmap planning.
- **Global State:** `store/use-xp.ts` stores the user's current level, XP, and streak, allowing seamless updates across the UI (e.g., Header, Sidebar, and Profile) when tasks are done.

### 3. AI Agents (Neural Link)
AI functionalities like the *Resume Architect*, *Cold Email Generator*, and *Insights* utilize Google Gemini Pro.
- Implementations are largely abstracted in `lib/ai.ts`.
- Requests should route through Next.js API Routes (`app/api/...`) using the edge runtime, where Vercel AI SDK streams chunks back to the client.

### 4. Theming and Styling
Deep Mind utilizes a *Neo-brutalist / Fintech Puzzle* aesthetic:
- **Colors & Geometry:** Defined centrally in `globals.css` and extended inside `tailwind.config.ts` (or PostCSS inline configurations depending on setup). Expect strong contrasts, solid black borders (`border-2 border-black`), and harsh drop shadows (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`).
- Classes are safely combined using the utility function `cn()` found in `lib/utils.ts`.

## Development Guidelines

1. **Check `task.md` First:** The current sprint backlog and actively developed features are tracked directly in `task.md`.
2. **Local Over Remote:** Always write changes to `lib/db.ts` (Dexie) first. Remote pushes should happen asynchronously.
3. **Use the `cn()` Utility:** Whenever building a component with dynamic Tailwind classes, wrap the strings in the `cn()` (clsx + tailwind-merge) utility derived in `lib/utils.ts` to prevent class collision errors.
4. **Environment Constraints:** Remember that some Supabase / Google API interactions will fail abruptly if your `.env.local` keys are missing. Verify these are configured when onboarding.

## Getting Started

If you haven't yet, clone the repo, install dependencies via `npm install`, populate your `.env.local` according to the `README.md`, and boot the service using `npm run dev`.

*Query the impossible.*
