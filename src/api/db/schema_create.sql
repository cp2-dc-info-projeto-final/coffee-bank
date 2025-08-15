-- DROP TABLES
DROP TABLE IF EXISTS "public"."Categoria";
DROP TABLE IF EXISTS "public"."CarteiraInvestimento";
DROP TABLE IF EXISTS "public"."Carteira";
DROP TABLE IF EXISTS "public"."Investimento";
DROP TABLE IF EXISTS "public"."Automatizacao";
DROP TABLE IF EXISTS "public"."Emprestimos";
DROP TABLE IF EXISTS "public"."Transferencias";
DROP TABLE IF EXISTS "public"."Admins";
DROP TABLE IF EXISTS "public"."Users";

-- USERS
CREATE TABLE "public"."Users" (
  "id" SERIAL PRIMARY KEY,
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "CPF" VARCHAR(255) NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Saldo" DECIMAL NOT NULL,
  "Imagem" VARCHAR(255),
  "Senha5" VARCHAR(255) NOT NULL,
  "Senha7" VARCHAR(255) NOT NULL,
  "ChavePix" VARCHAR(255) NOT NULL,
  "Sex" BOOLEAN NOT NULL
);

-- ADMINS
CREATE TABLE "public"."Admins" (
  "id" SERIAL PRIMARY KEY,
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "CPF" VARCHAR(255) NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Senha12" VARCHAR(255) NOT NULL
);

-- TRANSFERENCIAS
CREATE TABLE "public"."Transferencias" (
  "id" SERIAL PRIMARY KEY,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Destinatario" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Data" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Valor" NUMERIC NOT NULL
);

-- EMPRESTIMOS
CREATE TABLE "public"."Emprestimos" (
  "id" SERIAL PRIMARY KEY,
  "Inicio" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Valor" NUMERIC NOT NULL,
  "Parcelas" INTEGER NOT NULL,
  "Fim" TIMESTAMP NOT NULL
);

-- AUTOMATIZACAO
CREATE TABLE "public"."Automatizacao" (
  "id" SERIAL PRIMARY KEY,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Destinatario" INTEGER NOT NULL REFERENCES "Users"("id"),
  "ChavePix" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Inicio" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Intervalo" INTEGER NOT NULL
);

-- INVESTIMENTO
CREATE TABLE "public"."Investimento" (
  "id" SERIAL PRIMARY KEY,
  "Preco" NUMERIC NOT NULL,
  "Tamanho" NUMERIC NOT NULL,
  "Numero" INTEGER NOT NULL,
  "Porcentagem" NUMERIC NOT NULL,
  "Nome" VARCHAR(255) NOT NULL,
  "Emissor" INTEGER NOT NULL REFERENCES "Users"("id"),
  "DF" VARCHAR(255) NOT NULL
);

-- CARTEIRA
CREATE TABLE "public"."Carteira" (
  "id" SERIAL PRIMARY KEY,
  "Dono" INTEGER NOT NULL REFERENCES "Users"("id"),
  "Valor" NUMERIC NOT NULL
);

-- CARTEIRA INVESTIMENTO
CREATE TABLE "public"."CarteiraInvestimento" (
  "id" SERIAL PRIMARY KEY,
  "Investimento_id" INTEGER NOT NULL REFERENCES "Investimento"("id"),
  "Carteira_id" INTEGER NOT NULL REFERENCES "Carteira"("id"),
  "DataCriacao" TIMESTAMP NOT NULL DEFAULT NOW(),
  "Quantidade" INTEGER NOT NULL
);

-- CATEGORIA
CREATE TABLE "public"."Categoria" (
  "id" SERIAL PRIMARY KEY,
  "Investimento_id" INTEGER NOT NULL REFERENCES "Investimento"("id"),
  "Porcentagem" NUMERIC NOT NULL,
  "Nome" VARCHAR(255) NOT NULL
);
