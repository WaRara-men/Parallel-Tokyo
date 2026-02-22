-- Drop old Nebula tables if they exist
drop table if exists items;
drop table if exists clusters;

-- Create profiles table if it doesn't exist
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  status text check (status in ('tired', 'melancholy', 'calm', 'anxious', 'neutral')) default 'neutral',
  color_theme text default '#ffffff',
  last_active_at timestamptz default now()
);

-- Enable RLS for profiles if not already enabled
alter table profiles enable row level security;

-- Policies for profiles (drop existing policies first to avoid conflicts)
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create bonfires table if it doesn't exist
create table if not exists bonfires (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  intensity int default 5,
  message_hash text,
  created_at timestamptz default now()
);

-- Enable RLS for bonfires if not already enabled
alter table bonfires enable row level security;

-- Policies for bonfires
drop policy if exists "Bonfires are viewable by everyone" on bonfires;
create policy "Bonfires are viewable by everyone"
  on bonfires for select
  using (true);

drop policy if exists "Users can create bonfires" on bonfires;
create policy "Users can create bonfires"
  on bonfires for insert
  with check (auth.uid() = user_id);

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, status, color_theme)
  values (new.id, 'neutral', '#ffffff')
  on conflict (id) do nothing; -- Prevent error if profile already exists
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
