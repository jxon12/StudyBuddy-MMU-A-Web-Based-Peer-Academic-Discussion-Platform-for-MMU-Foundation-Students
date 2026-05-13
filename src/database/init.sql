
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null,
  last_name text not null,
  student_id text not null unique,
  student_email text not null unique,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.users
add constraint student_id_format 
check (student_id ~ '^\d{3}[A-Z]{2}\d{3}[A-Z]{2}$');


alter table public.users
add constraint student_email_format 
check (student_email ~ '^[a-zA-Z0-9._%+-]+@mmu\.edu\.my$');


alter table public.users enable row level security;


create policy "Users can view their own data"
  on public.users
  for select
  using (auth.uid() = id);


create policy "Users can update their own data"
  on public.users
  for update
  using (auth.uid() = id);


create policy "Users can insert their own data"
  on public.users
  for insert
  with check (auth.uid() = id);


create index if not exists idx_users_student_id on public.users(student_id);
create index if not exists idx_users_student_email on public.users(student_email);
create index if not exists idx_users_email on public.users(email);


