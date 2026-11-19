create or replace function public.submit_attempt(p_attempt uuid,p_answers jsonb,p_reason text default 'manual')
returns public.attempts language plpgsql security definer set search_path=''
as $$
declare att public.attempts; effective_answers jsonb; total numeric; final_reason text;
begin
 if p_reason not in ('manual','tab_hidden','page_exit','time_expired') then raise exception 'invalid submission reason'; end if;
 select * into att from public.attempts where id=p_attempt and student_id=private.my_student_id() for update;
 if not found then raise exception 'attempt not found'; end if;
 if att.submitted_at is not null then return att; end if;
 if p_reason='time_expired' and now()<=att.deadline_at then raise exception 'exam deadline has not expired'; end if;
 effective_answers:=att.answers;
 if p_answers is not null and now()<=att.deadline_at then
  if jsonb_typeof(p_answers)<>'object' then raise exception 'answers must be a JSON object'; end if;
  if exists(select 1 from jsonb_object_keys(p_answers) as answer_key where not exists(
   select 1 from public.questions q where q.id::text=answer_key and q.assessment_id=att.assessment_id
  )) then raise exception 'answers contain an unknown question'; end if;
  effective_answers:=p_answers;
 end if;
 select coalesce(sum(q.marks),0) into total from public.questions q
 where q.assessment_id=att.assessment_id and q.correct_answer is not null
 and (effective_answers->>q.id::text) is not distinct from q.correct_answer;
 final_reason:=case when now()>att.deadline_at then 'time_expired' else p_reason end;
 update public.attempts set answers=effective_answers,submitted_at=now(),
 auto_submitted=(final_reason<>'manual'),submitted_reason=final_reason,score=total
 where id=p_attempt returning * into att;
 return att;
end;
$$;
revoke all on function public.submit_attempt(uuid,jsonb,text) from public,anon;
grant execute on function public.submit_attempt(uuid,jsonb,text) to authenticated;
