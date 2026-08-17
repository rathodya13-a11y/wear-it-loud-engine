-- ROLES
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  city text,
  pin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins read profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  if lower(new.email) = 'pandurahodr53@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- SITE SETTINGS
create table public.site_settings (
  id integer primary key default 1,
  brand_name text not null default 'Gor Fashion House',
  tagline text not null default 'Wear it loud',
  logo_url text,
  sale_ends_at timestamptz not null default (now() + interval '14 days'),
  free_shipping_threshold integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
grant select on public.site_settings to anon, authenticated;
grant update, insert on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Settings are public" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins insert settings" on public.site_settings for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
insert into public.site_settings (id, sale_ends_at) values (1, '2026-08-31T18:30:00Z');

-- BANNERS
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.banners to anon;
grant select, insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy "Active banners are public" on public.banners for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage banners" on public.banners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger banners_updated_at before update on public.banners for each row execute function public.set_updated_at();
insert into public.banners (message, sort_order) values
  ('🔥 Flash sale — 40% off, ends soon', 1),
  ('Free shipping over ₹999', 2),
  ('New drop just landed', 3);

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'Graphic',
  price integer not null,
  mrp integer not null,
  image_url text not null,
  hover_image_url text,
  rating numeric not null default 4.8,
  reviews integer not null default 0,
  bestseller boolean not null default false,
  fabric text not null default '',
  fit text not null default '',
  print text not null default '',
  care text not null default '',
  blurb text not null default '',
  stock jsonb not null default '{"S":10,"M":10,"L":10,"XL":10,"XXL":10}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Active products are public" on public.products for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();

-- ADMIN ACCESS TO EXISTING TABLES
grant select, update on public.orders to authenticated;
create policy "Admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

grant select, insert, update, delete on public.promo_codes to authenticated;
create policy "Admins manage promos" on public.promo_codes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

grant select, insert, update, delete on public.inventory to authenticated;
create policy "Admins manage inventory" on public.inventory for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- REALTIME
alter publication supabase_realtime add table public.banners;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.site_settings;

-- STORAGE POLICIES (bucket created via storage tool)
create policy "Signed-in can read product images" on storage.objects for select to authenticated using (bucket_id = 'product-images');
create policy "Anon can read product images" on storage.objects for select to anon using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "Admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));