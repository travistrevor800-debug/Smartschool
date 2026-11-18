-- Fee automation: class fee plans, bulk invoices, allocations and printable receipts.
create table if not exists public.fee_schedules (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  term text not null,
  academic_year smallint not null,
  title text not null default 'School fees',
  amount numeric(12,2) not null check (amount > 0),
  due_date date not null,
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique(class_id, term, academic_year)
);
alter table public.fee_schedules enable row level security;
grant select, insert, update, delete on public.fee_schedules to authenticated;
drop policy if exists fee_schedules_admin_all on public.fee_schedules;
create policy fee_schedules_admin_all on public.fee_schedules
for all to authenticated using (private.is_admin()) with check (private.is_admin());

alter table public.fee_invoices
  add column if not exists fee_schedule_id uuid references public.fee_schedules(id) on delete set null,
  add column if not exists due_date date,
  add column if not exists invoice_no text not null default ('KSS-INV-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)));
alter table public.fee_invoices
  add constraint fee_invoices_schedule_student_unique unique(fee_schedule_id, student_id);
alter table public.fee_invoices
  add constraint fee_invoices_id_student_unique unique(id, student_id);

alter table public.fee_payments
  add column if not exists invoice_id uuid,
  add column if not exists term text,
  add column if not exists academic_year smallint,
  add column if not exists receipt_no text not null default ('KSS-RCP-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)));
alter table public.fee_payments
  add constraint fee_payments_invoice_student_fk
  foreign key(invoice_id, student_id) references public.fee_invoices(id, student_id) on delete restrict;

create index if not exists fee_invoices_due_date_idx on public.fee_invoices(due_date);
create index if not exists fee_invoices_student_term_idx on public.fee_invoices(student_id, academic_year, term);
create index if not exists fee_payments_invoice_idx on public.fee_payments(invoice_id);

create or replace function public.generate_class_fee_invoices(p_schedule_id uuid)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_schedule public.fee_schedules%rowtype;
  v_inserted integer := 0;
begin
  if not private.is_admin() then
    raise exception 'Only an administrator can generate fee invoices';
  end if;
  select * into v_schedule from public.fee_schedules
  where id = p_schedule_id and is_active = true for update;
  if not found then raise exception 'Active fee plan not found'; end if;
  insert into public.fee_invoices(student_id, term, academic_year, amount_due, fee_schedule_id, due_date)
  select s.id, v_schedule.term, v_schedule.academic_year, v_schedule.amount,
         v_schedule.id, v_schedule.due_date
  from public.students s where s.class_id = v_schedule.class_id
  on conflict (fee_schedule_id, student_id) do nothing;
  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;
revoke all on function public.generate_class_fee_invoices(uuid) from public, anon;
grant execute on function public.generate_class_fee_invoices(uuid) to authenticated;
