create or replace function public.validate_fee_invoice_payment()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_due numeric(12,2);
  v_paid numeric(12,2);
begin
  if new.invoice_id is null then return new; end if;
  select amount_due into v_due from public.fee_invoices
  where id = new.invoice_id and student_id = new.student_id for update;
  if not found then raise exception 'The selected invoice does not belong to this student'; end if;
  select coalesce(sum(amount),0) into v_paid from public.fee_payments
  where invoice_id = new.invoice_id and id is distinct from new.id;
  if v_paid + new.amount > v_due then
    raise exception 'Payment exceeds the remaining invoice balance of %', (v_due-v_paid);
  end if;
  return new;
end;
$$;
drop trigger if exists fee_payment_validate_invoice on public.fee_payments;
create trigger fee_payment_validate_invoice
before insert or update of invoice_id, student_id, amount on public.fee_payments
for each row execute function public.validate_fee_invoice_payment();
revoke all on public.fee_schedules from anon;
