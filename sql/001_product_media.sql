-- Add media columns to products table
alter table products
  add column if not exists image_url text,
  add column if not exists video_url text,
  add column if not exists screenshots text[],
  add column if not exists code_snippet text,
  add column if not exists code_language text,
  add column if not exists audio_preview_url text;

-- Create a public storage bucket for product media (if not already created)
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

-- Allow public read access to files in this bucket
create policy "Public read access for product-media"
on storage.objects for select
using ( bucket_id = 'product-media' );

-- Allow uploads (admin panel uses publishable key, so keep this open;
-- tighten later with auth check if needed)
create policy "Allow uploads to product-media"
on storage.objects for insert
with check ( bucket_id = 'product-media' );

-- Allow updates/overwrites
create policy "Allow updates to product-media"
on storage.objects for update
using ( bucket_id = 'product-media' );

-- Allow delete (for replacing old files)
create policy "Allow delete from product-media"
on storage.objects for delete
using ( bucket_id = 'product-media' );
