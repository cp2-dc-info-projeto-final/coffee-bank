import express from "express"
import path from "path"
import cors from "cors"
import http from "http"
import ImagesRoutes from './Routes/images.routes.js';
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/images', ImagesRoutes);

const PORT = 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});