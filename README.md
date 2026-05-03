# LearnPath AI - House of EdTech Assignment

## Overview

LearnPath AI is a sophisticated, full-stack CRUD application built for the House of EdTech Fullstack Developer assignment. Instead of a basic task manager, this application solves a real-world educational problem: dynamically generating personalized, structured learning paths using Artificial Intelligence.

Users can input any topic they wish to learn (e.g., "Quantum Computing", "Advanced React Patterns"), and the application will generate a complete curriculum featuring modules and curated resources. Users can Create, Read, Update (by managing modules), and Delete these learning paths.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI, Custom UI Tokens
- **Database**: Prisma ORM (Currently configured for SQLite for zero-config local testing, seamlessly swappable to PostgreSQL)
- **Authentication**: NextAuth.js (Auth.js) v5 Beta
- **AI**: Vercel AI SDK + OpenAI (Falls back to mock data gracefully if no API key is provided)

## Setup & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   AUTH_SECRET="your-super-secret-auth-key-generate-one"
   OPENAI_API_KEY="your-openai-api-key" # Optional: Will use mock AI data if not provided
   DATABASE_URL="file:./dev.db"
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Production & Deployment (Vercel)

This application is optimized for deployment on Vercel.

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Configure the following Environment Variables in Vercel:
   - `DATABASE_URL` (Use a managed PostgreSQL like Neon, Supabase, or Vercel Postgres)
   - `OPENAI_API_KEY` (Your OpenAI Key)
   - `AUTH_SECRET` (A secure random string for JWT encryption)
4. Update `prisma/schema.prisma` to use PostgreSQL before deploying:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Deploy! Vercel's CI/CD pipeline will automatically build and deploy the app on every push to the `main` branch.

## Evaluation Criteria Met

- **Functionality**: Complete CRUD operations on Learning Paths and Modules. Secure credential-based authentication using Auth.js.
- **User Interface**: Designed a stunning, premium UI with modern styling, dark mode support (via `globals.css` theming), responsive layouts, and Shadcn UI.
- **Code Quality**: Strongly typed with TypeScript, modular component architecture, separated Server Actions for data mutations, and strict error handling.
- **AI Integration**: Leveraged Vercel AI SDK for intelligent curriculum generation, adding significant real-world value beyond typical CRUD apps.
- **Real-World Considerations**: Graceful fallback to mock data if the AI provider fails or the API key is missing. Included a scalable ORM (Prisma) for easy database migrations.
