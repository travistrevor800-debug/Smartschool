# Smartschool

Professional school management system for Kirimunge Senior School.

## Current application
- Static HTML/CSS/JavaScript frontend.
- Supabase Auth for sign-in.
- Supabase Postgres with Row Level Security for school records.
- Supabase Edge Functions for privileged account provisioning and student first-login password changes.

## Student login
- Student selects **Student** and signs in using their admission number.
- The admission number is the initial password.
- Student accounts must change that initial password to a new password of at least 10 characters before the app opens.
- The frontend login ID is mapped to the same deterministic synthetic email used by the `create-user` Edge Function.
- Parent and staff accounts continue to use email and password.

## Supabase deployment
The Edge Function source is versioned under `supabase/functions`.
Deploy with the Supabase CLI from the repository root after authenticating and linking the project:

```bash
supabase functions deploy create-user
supabase functions deploy complete-first-login
```

Never place a Supabase service-role key in frontend code. Configure it only in the Supabase Edge Function environment.

## Database migrations
SQL migrations are stored in `supabase/migrations`. Apply them through the Supabase CLI or your reviewed database deployment workflow.

## Security notes
- RLS remains the enforcement boundary; frontend role visibility is not authorization.
- Pending student accounts are denied student-specific access through the database helper functions until their first password change is completed.
- Fee-balance view uses `security_invoker = true`.
- Teacher result updates are scoped to the teacher's assigned class and subject.
