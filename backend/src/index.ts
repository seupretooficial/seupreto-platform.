import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Esta é a sua primeira "Rota". Quando alguém acessar seu servidor, verá isto:
app.get('/', (req, res) => {
  res.send('💈 SeuPreto Platform API Online!');
});

// Rota de status para verificar se o sistema está operando
app.get('/status', (req, res) => {
  res.json({ 
    status: 'operacional', 
    sistema: 'SeuPreto Platform',
    versao: '1.0.0' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});