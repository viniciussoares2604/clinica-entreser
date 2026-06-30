alter table public.study_group_enrollments
add column if not exists notification_sent_at timestamptz,
add column if not exists notification_error text;
