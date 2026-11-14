# Kirimunge Senior School Portal

Next.js 14 + Supabase (Auth, Postgres, Row Level Security). Built on the CBC Senior School curriculum (Grades 10 to 12). Roles: admin, teacher, class teacher, parent, student.

## Setup
1. Supabase > SQL Editor: run `supabase/schema.sql`, then create the first admin as described at the bottom of that file.
2. `cp .env.example .env.local` and fill in the values (Project Settings > API). The service-role key is server-only: never commit it.
3. `npm install && npm run dev`

## Deploy (Vercel)
Import the GitHub repo and add the four variables from `.env.example`. Deploy.

## How access works
Every query runs as the signed-in user, so Postgres Row Level Security decides what they see: parents see only linked children, students only themselves, class teachers only their class. The service role is used only to create accounts, apply payments and grade exams.

## Not built yet
- M-Pesa: `/api/payments` applies the amount directly. Connect Daraja and apply only on the confirmed callback.
- Video lessons with attendance duration, Gmail notifications, contests, AI video lessons, compiled report cards.
- Sessions last about an hour (Supabase default); raise the JWT expiry in Supabase settings or add refresh-token handling.
- Exams: browsers cannot truly block screenshots or second devices; add proctoring for high-stakes tests.
