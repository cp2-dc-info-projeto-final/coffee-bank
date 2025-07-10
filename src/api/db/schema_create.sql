DROP TABLE IF EXISTS usuario;

create table
  "public"."Users" (
    "id" serial not null,
    "DataCriacao" timestamp not null default NOW(),
    "CPF" varchar(255) not null,
    "Nascimento" DATE not null,
    "Nome" varchar(255) not null,
    "Saldo" DECIMAL not null,
    "Imagem" varchar(255) null,
    "Senha5" varchar(255) not null,
    "Senha7" varchar(255) not null,
    "ChavePix" VARCHAR(255) not null,
    constraint "Users_pkey" primary key ("id")
  )

create table
  "public"."Admins" (
    "id" serial not null,
    "DataCriacao" timestamp not null default NOW(),
    "CPF" varchar(255) not null,
    "Nome" varchar(255) not null,
    "Senha12" varchar(255) not null,
    constraint "admins_pkey" primary key ("id")
  )

create table
  "public"."Transfers" (
    "id" serial not null,
    constraint "Emissor" foreign key "Users_fkey" references Users("Users_pkey"),
    constraint "Destinatario" foreign key "Users_fkey" references Users("Users_pkey"),
    "Data" timestamp not null default NOW(),
    "Valor" numeric not null, 
    constraint "Transfers_pkey" primary key ("id")
  )

create table 
  "public"."Emprestimos"(
    "id" serial not null,
    "Inicio" timestamp not null default NOW(),
    "Valor" numeric not null, 
    "Parcelas" integer not null,
    "Fim" timestamp not null default,
    constraint "Transfers_pkey" primary key ("id")
  )

create table
  "public"."automatizacao"(
    constraint "Emissor" foreign key "Users_fkey" references Users("Users_pkey"),
    constraint "Destinatario" foreign key "Users_fkey" references Users("Users_pkey"),
    "Inicio" timestamp not null default NOW(),
    "Intervalo" integer not null,
    constraint "ChavePix" foreign key "Users_fkey" references Users("Users_pkey"),
  )