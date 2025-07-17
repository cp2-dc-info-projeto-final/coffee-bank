import axios from 'axios';

// Cria uma instância global do axios para API backend na porta 3000
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Útil para CORS com cookies/sessão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;