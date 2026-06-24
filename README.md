# NexusAI

A full-stack AI chat application built with Next.js 16, Supabase, and Google Gemini 2.5 Flash. Built as a portfolio project to demonstrate production-grade full-stack development.

## Live Demo

[nexusai-mode.vercel.app](https://nexusai-mode.vercel.app)

## Features

- **AI Chat** — Real-time streaming responses powered by Google Gemini 2.5 Flash
- **Authentication** — Email/password and Google OAuth via Supabase Auth
- **Chat History** — Conversations persisted to Supabase with full message history
- **Markdown Rendering** — Full markdown support with syntax-highlighted code blocks
- **Responsive Design** — Mobile-first with a slide-in sidebar drawer on small screens
- **Rate Limiting** — Per-user request limiting to prevent API abuse
- **Row Level Security** — Supabase RLS ensures users can only access their own data

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Database & Auth** — Supabase (PostgreSQL + Row Level Security)
- **AI** — Google Gemini 2.5 Flash via `@google/genai`
- **Deployment** — Vercel

## Architecture Decisions

- **App Router** — All routes use Next.js 16 App Router with server components for data fetching and client components only where interactivity is needed
- **Streaming** — AI responses stream via the Web Streams API through a Next.js Route Handler, giving a real-time typing effect
- **Auth Flow** — Supabase SSR client handles session persistence across server and client components using the `@supabase/ssr` package
- **Route Protection** — `proxy.ts` (Next.js 16 middleware replacement) intercepts all requests and redirects unauthenticated users to login
- **RLS Policies** — Every database table has Row Level Security enabled so users cannot read or write each other's data even if they manipulate requests

## Local Development

1. Clone the repository

bash
   git clone https://github.com/YOUR_USERNAME/nexusai.git
   cd nexusai


2. Install dependencies

bash
   npm install


3. Set up environment variables — create `.env.local`:

env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000


4. Run the development server

bash
   npm run dev


5. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

Two main tables beyond the default Supabase auth schema:

**profiles** — Auto-created on signup via database trigger. Stores display name and avatar URL synced from OAuth providers.

**conversations** — Each chat session. Belongs to a user. Title is auto-generated from the first message.

**messages** — Individual messages within a conversation. Role is either `user` or `assistant`. Cascade deletes when conversation is deleted.

## Project Structure

nexusai/

├── app/

│   ├── (auth)/          # Login, signup, OAuth callback

│   ├── (dashboard)/     # Protected chat routes and server actions

│   └── api/chat/        # Gemini streaming API route

├── components/

│   ├── auth/            # Google OAuth button

│   ├── chat/            # Chat window, messages, input, markdown

│   └── layout/          # Sidebar, mobile drawer, chat layout

├── hooks/               # useChat — streaming and state management

├── lib/supabase/        # Browser, server, and middleware Supabase clients

└── types/               # Shared TypeScript interfaces

## What I Learned

- How to implement streaming AI responses using the Web Streams API in a Next.js Route Handler
- How Supabase Row Level Security works and why it matters for multi-user applications
- The difference between server components and client components in Next.js App Router and when to use each
- How OAuth flows work end to end — from the provider to the callback to session persistence
- TypeScript in a real project — interfaces, generics, and how the type system catches bugs before runtime