# Configurando e rodando o backend

## Inicialização do Projeto

Projeto inicializado com o [Express Generator](https://expressjs.com/en/starter/generator.html).

```
npx express-generator
```

O Express Generetor cria uma estrutura de pastas com algumas configurações e importações básicas para aplicaçcoes web. O projeto por padrão é criado para aplicação completa com backend e um frontend utilizando Jade. Aqui removemos as pastas `public` e `views` porque usaremos o Express.js apenas para o backend. No app.js as diretivas de importaçao destas pastas também são removidas. Na pasta routing temos os arquivos correspondendo a cada uma das rotas para inserção das chamadas REST. 

O banco de dados a ser utilizado é o [PostgreSQL](https://www.postgresql.org/), opção mais robusta para bancos de dados relacionais de código aberto. Para instalar o postgresql no Ubuntu (seja WSL ou convencional) precisamos atualizar a árvore do `apt`.

```bash
sudo apt update
```

Feito isso podemos instalar o banco de dados, que roda por padrão apenas na linha de comando, sendo acessível por uma IDE ou aplicação. 

```bash
sudo apt install postgresql postgresql-contrib
```

Verifique se está tudo certo checando a versão do `psql`.

```bash
psql --version
```

Para checar se o serviço do PosgreSQL está rodando utilize o comando de `status`. Você pode utilizar de forma análoga os comandos `start`, `stop` e `restart`.

```bash
sudo service postgresql status
```

Agora vamos criar uma senha de root para o postgresql, utilize `labcaxias`.

```bash
sudo passwd postgres
```

Agora utilizaremos o próprio terminal para acessar o banco de dados, no dia a dia podemos utilizar outras opções de interface, como complementos do próprio VSCode. A partir desse comando você sai do terminal do WSL/Ubuntu e entra no terminal do PostgreSQL, com sintaxe compatível com outros SGBDs.

```bash
sudo -u postgres psql
```

Crie um banco de dados com o nome do seu projeto, lembre de utilizar um nome sem espaços ou caracteres especiais. Aqui vamos chamas nosso banco de `elefantinho`.

```sql
CREATE DATABASE elefantinho;
```

Para conectar ao seu banco de dados basta digitar o comando abaixo (trocando o nome correspondente).

```sql
\c elefantinho;
```

Agora crie um usuário apra sua aplicação, é comum em ambientes de desenvolvimento utilizar o mesmo nome do banco de dados tanto no login quanto na senha. Após a criação do usuário precisamos dar permissão total de acesso ao banco de dados, certifique-se de que está no banco de dados correto.

```sql
CREATE USER elefantinho WITH ENCRYPTED PASSWORD 'elefantinho';
GRANT ALL ON SCHEMA public TO elefantinho;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO elefantinho;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO elefantinho;
```

Para desconectar do terminal do PostgreSQL basta digitar o comando `exit` ou o atalho `CTRL`+`D`. Com seu banco criado para acessar ele diretamente basta utilizar o comando abaixo. Agora é possível logar diretamente no seu banco de dados `elefantinho` no servidor `localhost` utilizando o usuário `elefantinho` diretamente da linha de comando fornecendo a senha.

```bash
psql -h localhost  -d elefantinho -U elefantinho -W
```

Com o banco de dados configurado é possível trabalhar com SQL normalmente, criando tabelas e executando consultas. Nesse projeto recomendamos um script de criação do banco de dados `schema_create.sql` armazenado na pasta `db`. Esse script deve ser utilizado para criar ou recriar as tabelas e inserir registros iniciais, então deve ser feito considerando que as tabelas podem já existir, removendo e criando novamente. Para executar o script dentro do banco de dados e não precisar copiar o colar o conteúdo (que também é possível) basta utilizar o comando abaixo. Verifique em que pasta do projeto você está, pode ser necessário alterar o caminho, aqui estamos dentro da pasta do projeto backend `src/api/`.

```bash
 psql -h localhost  -d elefantinho -U elefantinho -W -f db/schema_create.sql
```

Para navegar no banco de dados sugiro o a extensão PostgreSQL oficial da Microsoft, repare que há várias extensões com mesmo nome de outro fabricantes. Qualquer outra extensão de sua preferência pode ser utilizada.


## Endpoints da API

Aqui uma breve documentação dos endpoints da API de usuários. Para executar o serviço de backend se certifique que o serviço do postgres está online e execute o comando abaixo. Lembre-se de acessar a porta 3000 para testar.

```bash
npm start
```

O `nodemon` permite reiniciar automaticamente o servidor Node.js quando arquivos são alterados, sem precisar encerrar o processo e inicar novamente a cada alteração. Para executar utilizando o `nodemon` utilize o comando abaixo.

```bash
npm run dev
```

### GET /users
Retorna todos os usuários
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "login": "hermenegildo",
      "email": "hermenegildo@email.com"
    },
    {
      "id": 2,
      "login": "zoroastra",
      "email": "zoroastra@email.com"
    }
  ]
}
```

### GET /users/:id
Retorna um usuário específico
```json
{
  "success": true,
  "data": {
    "id": 1,
    "login": "hermenegildo",
    "email": "hermenegildo@email.com"
  }
}
```

### POST /users
Cria um novo usuário
**Body:**
```json
{
  "login": "anaxarmandro",
  "email": "anaxarmandro@email.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": 2,
    "login": "anaxarmandro",
    "email": "anaxarmandro@email.com"
  }
}
```

### PUT /users/:id
Atualiza um usuário existente
**Body:**
```json
{
  "login": "hermenegilda",
  "email": "hermenegilda@email.com"
}
```

### DELETE /users/:id
Remove um usuário
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

## Exemplo de Uso com curl

O `curl` é um comando do linux que permite realizar requisições REST passando uma URL e dados. Abaixo alguns exemplos de como fazer.

```bash
# Listar todos os usuários
curl http://localhost:3000/users

# Buscar usuário por ID
curl http://localhost:3000/users/1

# Criar novo usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"login":"anaxarmandro","email":"anaxarmandro@email.com"}'

# Atualizar usuário
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"login":"hermenegilda","email":"hermenegilda@email.com"}'

# Deletar usuário
curl -X DELETE http://localhost:3000/users/3
```





