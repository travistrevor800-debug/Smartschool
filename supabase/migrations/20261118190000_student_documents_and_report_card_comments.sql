create table if not exists public.student_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  document_type text not null check (document_type in ('passport_photo','kcpe_kjsea_certificate','birth_certificate','parent_id')),
  object_path text not null unique,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 10485760),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists student_documents_student_idx on public.student_documents(student_id, document_type, created_at desc);
alter table public.student_documents enable row level security;
grant select, insert, update, delete on public.student_documents to authenticated;
create policy student_documents_read_visible on public.student_documents for select to authenticated using (private.can_see_student(student_id));
create policy student_documents_staff_insert on public.student_documents for insert to authenticated with check (private.is_staff() and private.can_see_student(student_id) and uploaded_by = (select auth.uid()));
create policy student_documents_staff_update on public.student_documents for update to authenticated using (private.is_staff() and private.can_see_student(student_id)) with check (private.is_staff() and private.can_see_student(student_id) and uploaded_by = (select auth.uid()));
create policy student_documents_staff_delete on public.student_documents for delete to authenticated using (private.is_staff() and private.can_see_student(student_id));

create table if not exists public.report_card_comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  term text not null,
  academic_year smallint not null,
  class_teacher_comment text,
  principal_comment text,
  closing_date date,
  reopening_date date,
  class_teacher_name text,
  principal_name text,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now(),
  unique(student_id, term, academic_year)
);
create index if not exists report_card_comments_student_idx on public.report_card_comments(student_id, academic_year desc, term);
alter table public.report_card_comments enable row level security;
grant select, insert, update, delete on public.report_card_comments to authenticated;
create policy report_card_comments_read_visible on public.report_card_comments for select to authenticated using (private.can_see_student(student_id));
create policy report_card_comments_staff_insert on public.report_card_comments for insert to authenticated with check (private.is_staff() and private.can_see_student(student_id) and updated_by = (select auth.uid()));
create policy report_card_comments_staff_update on public.report_card_comments for update to authenticated using (private.is_staff() and private.can_see_student(student_id)) with check (private.is_staff() and private.can_see_student(student_id) and updated_by = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-documents','student-documents',false,10485760,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp','application/pdf'];
create policy student_documents_storage_read on storage.objects for select to authenticated using (bucket_id='student-documents' and private.can_see_student(((storage.foldername(name))[1])::uuid));
create policy student_documents_storage_insert on storage.objects for insert to authenticated with check (bucket_id='student-documents' and private.is_staff() and private.can_see_student(((storage.foldername(name))[1])::uuid));
create policy student_documents_storage_update on storage.objects for update to authenticated using (bucket_id='student-documents' and private.is_staff() and private.can_see_student(((storage.foldername(name))[1])::uuid)) with check (bucket_id='student-documents' and private.is_staff() and private.can_see_student(((storage.foldername(name))[1])::uuid));
create policy student_documents_storage_delete on storage.objects for delete to authenticated using (bucket_id='student-documents' and private.is_staff() and private.can_see_student(((storage.foldername(name))[1])::uuid));
