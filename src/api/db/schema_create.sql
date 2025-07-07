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