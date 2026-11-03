begin;

-- Solo el propietario del proyecto puede asignar administradores desde SQL.
create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Read own admin membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  issuer text not null check (length(trim(issuer)) between 1 and 160),
  issued_on date,
  verification_url text check (verification_url is null or verification_url ~ '^https://[^[:space:]]+$'),
  document_path text unique,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.certifications enable row level security;
revoke all on public.certifications from anon, authenticated;
grant select on public.certifications to anon;
grant select, insert, update, delete on public.certifications to authenticated;
create policy "Read published certifications" on public.certifications
  for select to anon, authenticated using (published);
create policy "Admins manage certifications" on public.certifications
  for all to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

-- Privado: los borradores no exponen archivos por URL pública.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certifications', 'certifications', false, 5242880,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
create policy "Admins manage certification documents" on storage.objects
  for all to authenticated
  using (bucket_id = 'certifications' and exists (
    select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (bucket_id = 'certifications' and exists (
    select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Read published certification documents" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'certifications' and exists (
    select 1 from public.certifications where document_path = name and published));

commit;
