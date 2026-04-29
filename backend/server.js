const express = require('express');
const serveStatic = require('serve-static');
const jsonServer = require('json-server');
const cors = require('cors');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'https://srcaio.com', // O domínio que faz as requisições
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para permitir requisições OPTIONS (Preflight Request)
app.options('*', cors());

// Serve arquivos estáticos
app.use(serveStatic('app-cadastro-usuario/'));

// Configuração do json-server
const router = jsonServer.router('db.json');  // Defina o caminho correto para o db.json
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use('/api', router);

// Inicia o servidor
const PORT = process.env.PORT || 3000; // Usando a variável de ambiente para a porta
app.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
