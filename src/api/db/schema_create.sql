-- DROP TABLES
-- Primeiro caem as tabelas que dependem de outras
DROP TABLE IF EXISTS "public"."Categoria";
DROP TABLE IF EXISTS "public"."CarteiraInvestimento";
DROP TABLE IF EXISTS "public"."Carteira";
DROP TABLE IF EXISTS "public"."Automatizacao";
DROP TABLE IF EXISTS "public"."Transferencias";
DROP TABLE IF EXISTS "public"."Emprestimos";
DROP TABLE IF EXISTS "investimento_sem_emissor";
-- Depois as que não têm dependência direta
DROP TABLE IF EXISTS "public"."Admins";
DROP TABLE IF EXISTS "public"."Investimento";
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
  "id" SERIAL PRIMARY KEY,
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "CPF" VARCHAR(255) NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Saldo" INTEGER NOT NULL,
  "Imagem" VARCHAR(255),
  "Senha5" VARCHAR(255) NOT NULL,
  "Senha7" VARCHAR(255) NOT NULL,
  "ChavePix" VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."Admins" (
  "id" SERIAL PRIMARY KEY,
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "CPF" VARCHAR(255) NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Senha12" VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."Transferencias" (
  "id" SERIAL PRIMARY KEY,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Destinatario" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Data" TIMESTAMP NOT NULL DEFAULT NOW(),
  "VALORr" Integer NOT NULL
);

CREATE TABLE "public"."Emprestimos" (
  "id" SERIAL PRIMARY KEY,
  "Inicio" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Valor" NUMERIC NOT NULL,
  "Parcelas" INTEGER NOT NULL,
  "Fim" TIMESTAMP NOT NULL
);

CREATE TABLE "public"."Automatizacao" (
  "id" SERIAL PRIMARY KEY,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Destinatario" INTEGER NOT NULL REFERENCES "Users"("id"),
  "ChavePix" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Inicio" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Intervalo" INTEGER NOT NULL
);

CREATE TABLE "public"."Investimento" (
  "id" SERIAL PRIMARY KEY,
  "Compra" INTEGER NOT NULL,
  "Preco" INTEGER,
  "AreaTotal" NUMERIC NOT NULL,
  "Numero" INTEGER NOT NULL,
  "AreaVendida" NUMERIC NOT NULL,
  "Porcentagem" NUMERIC NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "DF" VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."Carteira" (
  "id" SERIAL PRIMARY KEY,
  "Dono" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Valor" NUMERIC NOT NULL
);

CREATE TABLE "public"."CarteiraInvestimento" (
  "id" SERIAL PRIMARY KEY,
  "Investimento_id" INTEGER NOT NULL REFERENCES "Investimento"("id") ON DELETE CASCADE,
  "Carteira_id" INTEGER NOT NULL REFERENCES "Carteira"("id"),
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Area" Numeric NOT NULL
);

CREATE TABLE "public"."Categoria" (
  "id" SERIAL PRIMARY KEY,
  "Investimento_id" INTEGER NOT NULL REFERENCES "Investimento"("id") ON DELETE CASCADE,
  "Porcentagem" NUMERIC NOT NULL,
  "Nome" VARCHAR(255) NOT NULL
);