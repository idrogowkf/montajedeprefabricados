create extension if not exists pgcrypto;
create sequence if not exists public.rfqs_reference_seq start 1;

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(), reference text not null unique,
  idempotency_key uuid not null unique, company_name text not null, nif text,
  contact_name text not null, email text not null, phone text, delivery_location text,
  notes text, status text not null default 'received' check (status in ('received','reviewing','supplier_pending','information_required','quoted','closed','cancelled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(), rfq_id uuid not null references public.rfqs(id) on delete cascade,
  product_slug text not null, quantity integer not null check (quantity between 1 and 999)
);
create table if not exists public.product_events (
  id bigint generated always as identity primary key, event_type text not null check (event_type in ('product_view','cart_add','rfq_submitted')),
  product_slug text not null, created_at timestamptz not null default now()
);
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.product_events enable row level security;

create or replace function public.create_rfq_request(payload jsonb)
returns table(id uuid, reference text, duplicate boolean)
language plpgsql security definer set search_path = public as $$
declare existing public.rfqs; created public.rfqs; item jsonb; ref text;
begin
  select * into existing from public.rfqs where idempotency_key = (payload->>'idempotencyKey')::uuid;
  if found then return query select existing.id, existing.reference, true; return; end if;
  ref := 'SOL-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('public.rfqs_reference_seq')::text, 5, '0');
  begin
    insert into public.rfqs(reference,idempotency_key,company_name,nif,contact_name,email,phone,delivery_location,notes)
    values(ref,(payload->>'idempotencyKey')::uuid,payload->>'companyName',payload->>'nif',payload->>'contactName',payload->>'email',payload->>'phone',payload->>'deliveryLocation',payload->>'notes') returning * into created;
  exception when unique_violation then
    select * into existing from public.rfqs where idempotency_key = (payload->>'idempotencyKey')::uuid;
    if found then return query select existing.id, existing.reference, true; return; end if;
    raise;
  end;
  for item in select * from jsonb_array_elements(payload->'items') loop
    insert into public.rfq_items(rfq_id,product_slug,quantity) values(created.id,item->>'slug',(item->>'quantity')::integer);
    insert into public.product_events(event_type,product_slug) values('rfq_submitted',item->>'slug');
  end loop;
  return query select created.id, created.reference, false;
end $$;

revoke execute on function public.create_rfq_request(jsonb) from public;
grant execute on function public.create_rfq_request(jsonb) to service_role;
