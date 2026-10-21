-- Schema inicial do banco do SeuPreto Platform

create table if not exists funcionarios (
  id serial primary key,
  nome text not null,
  usuario text unique not null,
  senha_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists servicos (
  id serial primary key,
  nome text not null,
  preco numeric not null,
  tempo text not null,
  created_at timestamptz not null default now()
);

create table if not exists agendamentos (
  id serial primary key,
  cliente text not null,
  servico text not null,
  data text not null,
  horario text not null,
  valor numeric not null,
  status text not null default 'pendente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into funcionarios (nome, usuario, senha_hash)
values ('Junio Rodrigues', 'junio', '$2a$10$X6VhRm8r0uB7w4M23b4GqOaBI4nMxUQ24A6Jh7h9O2x8M2PZf2K/6')
on conflict (usuario) do nothing;

insert into servicos (nome, preco, tempo)
values
  ('Corte', 70, '~45 min'),
  ('Corte + Barba', 90, '~1h 15min'),
  ('Barba', 50, '~30 min'),
  ('Freestyle', 30, '~20 min')
on conflict do nothing;
