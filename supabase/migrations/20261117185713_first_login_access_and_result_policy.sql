-- Keep first-login student accounts out of protected school data until password rotation.
CREATE OR REPLACE FUNCTION private.is_account_ready()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'must_change_password')::boolean, false) = false;
$$;

REVOKE ALL ON FUNCTION private.is_account_ready() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_account_ready() TO authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT private.is_account_ready()
    AND COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = (SELECT auth.uid())), false);
$$;

CREATE OR REPLACE FUNCTION private.is_staff()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT private.is_account_ready()
    AND COALESCE((SELECT role IN ('admin','teacher','class_teacher') FROM public.profiles WHERE id = (SELECT auth.uid())), false);
$$;

CREATE OR REPLACE FUNCTION private.my_role()
RETURNS public.user_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT CASE WHEN private.is_account_ready()
    THEN (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid()))
    ELSE NULL::public.user_role END;
$$;

CREATE OR REPLACE FUNCTION private.my_student_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT CASE WHEN private.is_account_ready()
    THEN (SELECT id FROM public.students WHERE profile_id = (SELECT auth.uid()))
    ELSE NULL::uuid END;
$$;

CREATE OR REPLACE FUNCTION private.my_class_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT CASE WHEN private.is_account_ready()
    THEN (SELECT class_id FROM public.students WHERE profile_id = (SELECT auth.uid()))
    ELSE NULL::uuid END;
$$;

CREATE OR REPLACE FUNCTION private.can_see_student(sid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT private.is_account_ready() AND (
    private.is_admin()
    OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = sid AND s.profile_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.student_id = sid AND ps.parent_id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.students s
      JOIN public.classes c ON c.id = s.class_id
      WHERE s.id = sid AND (
        c.class_teacher_id = (SELECT auth.uid())
        OR EXISTS (SELECT 1 FROM public.teacher_assignments ta WHERE ta.class_id = c.id AND ta.teacher_id = (SELECT auth.uid()))
      )
    )
  );
$$;

CREATE OR REPLACE FUNCTION private.teaches_class(cid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT private.is_account_ready() AND (
    private.is_admin()
    OR EXISTS (SELECT 1 FROM public.classes c WHERE c.id = cid AND c.class_teacher_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.teacher_assignments ta WHERE ta.class_id = cid AND ta.teacher_id = (SELECT auth.uid()))
  );
$$;

CREATE OR REPLACE FUNCTION private.in_active_exam(sid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $$
  SELECT private.is_account_ready() AND EXISTS (
    SELECT 1 FROM public.attempts a
    WHERE a.student_id = sid AND a.submitted_at IS NULL AND a.deadline_at > now()
  );
$$;

DROP POLICY IF EXISTS res_teacher_upd ON public.results;
CREATE POLICY res_teacher_upd ON public.results
FOR UPDATE TO authenticated
USING (
  private.is_staff()
  AND EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
    WHERE s.id = results.student_id
      AND ta.teacher_id = (SELECT auth.uid())
      AND ta.subject_id = results.subject_id
  )
)
WITH CHECK (
  private.is_staff()
  AND EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
    WHERE s.id = results.student_id
      AND ta.teacher_id = (SELECT auth.uid())
      AND ta.subject_id = results.subject_id
  )
);
