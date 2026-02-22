-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the items table
create table items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text check (type in ('text', 'image', 'link')) not null,
  content text not null,
  position_x float not null default 0,
  position_y float not null default 0,
  embedding vector(1536),
  cluster_id uuid,
  created_at timestamptz default now()
);

-- Create the clusters table
create table clusters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  centroid_x float not null,
  centroid_y float not null,
  created_at timestamptz default now()
);

-- Add foreign key reference from items to clusters
alter table items add constraint fk_cluster foreign key (cluster_id) references clusters(id);

-- Enable Row Level Security (RLS)
alter table items enable row level security;
alter table clusters enable row level security;

-- Create policies for items
create policy "Users can view their own items"
  on items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own items"
  on items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own items"
  on items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own items"
  on items for delete
  using (auth.uid() = user_id);

-- Create policies for clusters
create policy "Users can view their own clusters"
  on clusters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own clusters"
  on clusters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own clusters"
  on clusters for update
  using (auth.uid() = user_id);

create policy "Users can delete their own clusters"
  on clusters for delete
  using (auth.uid() = user_id);

-- Create indexes for performance
create index on items (user_id);
create index on clusters (user_id);
-- Index for vector search (ivfflat) - adjusting lists based on expected data size, start small
create index on items using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
