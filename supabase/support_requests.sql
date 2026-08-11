-- Execute este arquivo no SQL Editor do seu projeto Supabase.
-- Cria uma fila única para feedbacks e pedidos de ajuda.

create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('feedback', 'help')),
  category text not null check (category in ('suggestion', 'bug', 'compliment', 'technical', 'download', 'account', 'other')),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  subject text not null check (char_length(subject) between 3 and 160),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  source text not null default 'flexhub-site' check (char_length(source) <= 100),
  page_url text check (page_url is null or char_length(page_url) <= 1000),
  user_agent text check (user_agent is null or char_length(user_agent) <= 1000),
  admin_notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists support_requests_queue_idx
  on public.support_requests (status, request_type, created_at desc);
create index if not exists support_requests_email_idx
  on public.support_requests (lower(email));

alter table public.support_requests enable row level security;

-- Limita cada e-mail a 2 solicitações em uma janela móvel de 24 horas.
-- A trava por e-mail evita que envios simultâneos ultrapassem o limite.
create or replace function public.enforce_support_request_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent_requests integer;
  normalized_email text;
begin
  normalized_email := lower(trim(new.email));
  new.email := normalized_email;

  perform pg_advisory_xact_lock(hashtextextended(normalized_email, 0));

  select count(*)
    into recent_requests
    from public.support_requests
   where lower(email) = normalized_email
     and created_at >= now() - interval '24 hours';

  if recent_requests >= 2 then
    raise exception using
      errcode = 'P0001',
      message = 'SUPPORT_RATE_LIMIT_EXCEEDED';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_support_request_rate_limit() from public;

drop trigger if exists support_requests_rate_limit on public.support_requests;
create trigger support_requests_rate_limit
  before insert on public.support_requests
  for each row execute function public.enforce_support_request_rate_limit();

-- O site público pode enviar, mas não pode ler, editar ou apagar solicitações.
drop policy if exists "public can submit support requests" on public.support_requests;
create policy "public can submit support requests"
  on public.support_requests for insert to anon, authenticated
  with check (
    status = 'new' and priority = 'normal' and admin_notes is null
    and assigned_to is null and resolved_at is null
  );

-- No outro site, use login Supabase e defina {"role":"admin"} no app_metadata.
drop policy if exists "admins can manage support requests" on public.support_requests;
create policy "admins can manage support requests"
  on public.support_requests for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.set_support_request_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  if new.status = 'resolved' and old.status is distinct from 'resolved' then
    new.resolved_at = now();
  elsif new.status <> 'resolved' then
    new.resolved_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists support_requests_updated_at on public.support_requests;
create trigger support_requests_updated_at
  before update on public.support_requests
  for each row execute function public.set_support_request_updated_at();

comment on table public.support_requests is 'Fila de feedbacks e solicitações de ajuda do FlexHub';

-- Respostas enviadas pela equipe. Uma solicitação pode possuir várias respostas.
create table if not exists public.support_replies (
  id uuid primary key default gen_random_uuid(),
  support_request_id uuid not null references public.support_requests(id) on delete cascade,
  author_id uuid not null default auth.uid() references auth.users(id) on delete restrict,
  author_name text not null check (char_length(author_name) between 1 and 100),
  message text not null check (char_length(message) between 1 and 5000),
  is_internal_note boolean not null default false,
  sent_to_email_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_replies_request_idx
  on public.support_replies (support_request_id, created_at asc);

alter table public.support_replies enable row level security;

-- Somente administradores autenticados podem ler ou alterar respostas.
drop policy if exists "admins can manage support replies" on public.support_replies;
create policy "admins can manage support replies"
  on public.support_replies for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.set_support_reply_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_replies_updated_at on public.support_replies;
create trigger support_replies_updated_at
  before update on public.support_replies
  for each row execute function public.set_support_reply_updated_at();

-- Facilita a listagem no painel administrativo com os dados do destinatário.
create or replace view public.support_reply_details
with (security_invoker = true)
as
select
  reply.id,
  reply.support_request_id,
  request.request_type,
  request.subject,
  request.name as requester_name,
  request.email as requester_email,
  reply.author_id,
  reply.author_name,
  reply.message,
  reply.is_internal_note,
  reply.sent_to_email_at,
  reply.created_at,
  reply.updated_at
from public.support_replies as reply
join public.support_requests as request on request.id = reply.support_request_id;

comment on table public.support_replies is 'Respostas e notas da equipe ligadas às solicitações do FlexHub';
comment on view public.support_reply_details is 'Respostas acompanhadas dos dados da solicitação e do destinatário';

revoke all on public.support_replies from anon;
grant select, insert, update, delete on public.support_replies to authenticated;
revoke all on public.support_reply_details from anon;
grant select on public.support_reply_details to authenticated;
