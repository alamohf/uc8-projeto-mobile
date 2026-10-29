-- Esquema do Kanban no Supabase. Cole inteiro no SQL Editor do projeto e execute uma vez.
-- Projeto já criado antes do contador de dias: rode só `alter table public.cards add column concluido_em timestamptz;`
create table public.colunas (
  id bigint generated always as identity primary key,
  titulo text not null,
  posicao integer not null
);

create table public.cards (
  id bigint generated always as identity primary key,
  coluna_id bigint not null references public.colunas (id),
  titulo text not null,
  descricao text,
  posicao integer not null,
  criado_em timestamptz not null default now(),
  concluido_em timestamptz
);

alter table public.colunas enable row level security;
alter table public.cards enable row level security;

create policy "leitura anonima" on public.colunas for select to anon using (true);
create policy "leitura anonima" on public.cards for select to anon using (true);
create policy "inclusao anonima" on public.cards for insert to anon with check (true);
create policy "atualizacao anonima" on public.cards for update to anon using (true) with check (true);

grant usage on schema public to anon;
grant select on public.colunas to anon;
grant select, insert, update on public.cards to anon;
grant usage, select on sequence public.cards_id_seq to anon;

-- O Supabase concede todos os privilégios ao papel anon por padrão; o RLS barra as linhas,
-- mas o privilégio fica. Tira o que o app não usa: cards só lê, inclui e atualiza (mover);
-- colunas só lê. DELETE com a chave publicável passa a responder 401 (42501).
revoke delete on public.cards from anon;
revoke insert, update, delete on public.colunas from anon;

insert into public.colunas (titulo, posicao) values
  ('A fazer', 1),
  ('Fazendo', 2),
  ('Feito', 3);

insert into public.cards (coluna_id, titulo, descricao, posicao, concluido_em) values
  (1, 'Desenhar tela do quadro', 'Colunas e cards lado a lado', 1, null),
  (2, 'Tipar entidades', null, 1, null),
  (3, 'Escrever README', 'Recorte, telas e o que fica de fora', 1, now());
