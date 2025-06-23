const { Pool } = require('pg');

// Configuração do banco de dados PostgreSQL
// Utiliza variáveis de ambiente do arquivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Teste de conexão
pool.on('connect', () => {
  console.log('Conectado ao banco PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro na conexão com PostgreSQL:', err);
});

module.exports = pool;
