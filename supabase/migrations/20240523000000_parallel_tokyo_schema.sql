-- Create profiles table for user state
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  status text check (status in ('tired', 'melancholy', 'calm', 'anxious', 'neutral')) default 'neutral',
  color_theme text default '#ffffff',
  last_active_at timestamptz default now()
);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create bonfires table for ephemeral events
create table bonfires (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  intensity int default 5,
  message_hash text, -- We don't store the actual message content for privacy
  created_at timestamptz default now()
);

-- Enable RLS for bonfires
alter table bonfires enable row level security;

-- Policies for bonfires
create policy "Bonfires are viewable by everyone"
  on bonfires for select
  using (true);

create policy "Users can create bonfires"
  on bonfires for insert
  with check (auth.uid() = user_id);

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, status, color_theme)
  values (new.id, 'neutral', '#ffffff');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
