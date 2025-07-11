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
  "public"."Transferencias" (
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
    constraint "Emprestimo_pkey" primary key ("id")
  )

create table
  "public"."Automatizacao"(
    "id" serial not null,
    constraint "Emissor" foreign key "Users_fkey" references Users("Users_pkey"),
    constraint "Destinatario" foreign key "Users_fkey" references Users("Users_pkey"),
    "Inicio" timestamp not null default NOW(),
    "Intervalo" integer not null,
    constraint "ChavePix" foreign key "Users_fkey" references Users("Users_pkey"),
    constraint "Automatizacao_pkey" primary key ("id")
  )

create table
  "public"."Investimento"(
    "id" serial not null,
    "Preco" numeric not null, 
    "Tamanho" numeric not null,
    "Numero" integer not null,
    "Porcentagem" numeric not null,
    "Nome"  varchar(255) not null,
    constraint "Emissor" foreign key "Users_fkey" references Users("Users_pkey"),
    "DF" varchar(255) not null,
    constraint "Investimento_pkey" primary key ("id")
  )

create table
  "public"."Carteira"(
    "id" serial not null,
    constraint "Dono" foreign key "Users_fkey" references Users("Users_pkey"),
    "Valor" numeric not null,
    constraint "Carteira_pkey" primary key ("id")
  )

create table 
  "public"."CarteiraInvestimento"(
    "id" serial not null,
    constraint "Dono" foreign key "Investimento_fkey" references Investimento("Investimento_pkey"),
    constraint "Comprador" foreign key "carteira_fkey" references Carteira("Carteira_pkey"),
    "DataCriacao" timestamp not null default NOW(),
    "Quantidade" integer not null,
    constraint "CarteiraInvestimento_pkey" primary key ("Carteira_id","Investimento_id")   
  )

create table 
  "public"."Categoria"(
    "id" serial not null,
    constraint "User" foreign key "User_fkey" references Investimento("User_pkey"),
    "Porcentagem" numeric not null,
    "Nome" varchar(255) not null,
    constraint "Categoria_pkey" primary key ("id")      
  )