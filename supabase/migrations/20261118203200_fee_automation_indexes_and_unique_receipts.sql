create index if not exists fee_schedules_created_by_idx on public.fee_schedules(created_by);
create index if not exists fee_payments_recorded_by_idx on public.fee_payments(recorded_by);
create index if not exists fee_payments_invoice_student_idx on public.fee_payments(invoice_id, student_id);
create unique index if not exists fee_invoices_invoice_no_uidx on public.fee_invoices(invoice_no);
create unique index if not exists fee_payments_receipt_no_uidx on public.fee_payments(receipt_no);
