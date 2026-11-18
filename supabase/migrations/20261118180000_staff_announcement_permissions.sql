-- Allow teachers and class teachers to manage their own school announcements.
-- Administrators retain full access through the existing ann_admin policy.
drop policy if exists ann_read on public.announcements;
create policy ann_read
on public.announcements
for select
to authenticated
using (
  private.my_role() = any (audience)
  or private.my_role() in ('admin', 'teacher', 'class_teacher')
);

drop policy if exists ann_teacher_insert on public.announcements;
create policy ann_teacher_insert
on public.announcements
for insert
to authenticated
with check (
  private.my_role() in ('teacher', 'class_teacher')
  and created_by = (select auth.uid())
);

drop policy if exists ann_teacher_update_own on public.announcements;
create policy ann_teacher_update_own
on public.announcements
for update
to authenticated
using (
  private.my_role() in ('teacher', 'class_teacher')
  and created_by = (select auth.uid())
)
with check (
  private.my_role() in ('teacher', 'class_teacher')
  and created_by = (select auth.uid())
);

drop policy if exists ann_teacher_delete_own on public.announcements;
create policy ann_teacher_delete_own
on public.announcements
for delete
to authenticated
using (
  private.my_role() in ('teacher', 'class_teacher')
  and created_by = (select auth.uid())
);
