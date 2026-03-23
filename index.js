const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

const db = new Database('barbearia.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS barbeiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    especialidade TEXT NOT NULL,
    telefone TEXT,
    experiencia_anos INTEGER
  )
`);

const checkData = db.prepare('SELECT COUNT(*) as count FROM barbeiros').get();
if (checkData.count === 0) {
  console.log('Tabela vazia. Populando o banco com 5 exemplos iniciais...');
  
  const insertStmt = db.prepare(`
    INSERT INTO barbeiros (nome, especialidade, telefone, experiencia_anos) 
    VALUES (?, ?, ?, ?)
  `);

  const barbeirosExemplo = [
    { nome: 'Pedro Henrique', especialidade: 'Degradê e Freestyle', telefone: '11977776666', experiencia_anos: 3 },
    { nome: 'João Souza', especialidade: 'Barboterapia', telefone: '11966665555', experiencia_anos: 7 },
    { nome: 'Marcos Silva', especialidade: 'Corte Clássico', telefone: '11988887777', experiencia_anos: 10 },
    { nome: 'Lucas Almeida', especialidade: 'Corte Infantil', telefone: '11955554444', experiencia_anos: 5 },
    { nome: 'Tiago Fernandes', especialidade: 'Colorimetria (Platinado)', telefone: '11944443333', experiencia_anos: 2 }
  ];
  const insertMany = db.transaction((barbeiros) => {
    for (const b of barbeiros) {
      insertStmt.run(b.nome, b.especialidade, b.telefone, b.experiencia_anos);
    }
  });

  insertMany(barbeirosExemplo);
  console.log('Exemplos inseridos com sucesso!');
}

app.get('/barbeiros/filtrar', (req, res) => {
  const { especialidade } = req.query;
  
  if (!especialidade) {
    return res.status(400).json({ erro: 'Forneça a especialidade para filtrar.' });
  }

  const stmt = db.prepare('SELECT * FROM barbeiros WHERE especialidade LIKE ?');
  const barbeiros = stmt.all(`%${especialidade}%`);
  
  res.json(barbeiros);
});

app.get('/barbeiros/ordenar', (req, res) => {
  const campo = req.query.por || 'nome';
  const ordem = (req.query.ordem || 'ASC').toUpperCase();

  const camposPermitidos = ['id', 'nome', 'especialidade', 'experiencia_anos'];
  const ordensPermitidas = ['ASC', 'DESC'];

  if (!camposPermitidos.includes(campo) || !ordensPermitidas.includes(ordem)) {
    return res.status(400).json({ erro: 'Parâmetros de ordenação inválidos.' });
  }

  const stmt = db.prepare(`SELECT * FROM barbeiros ORDER BY ${campo} ${ordem}`);
  const barbeiros = stmt.all();
  
  res.json(barbeiros);
});
app.post('/barbeiros', (req, res) => {
  const { nome, especialidade, telefone, experiencia_anos } = req.body;

  if (!nome || !especialidade) {
    return res.status(400).json({ erro: 'Nome e especialidade são obrigatórios.' });
  }

  const stmt = db.prepare(`
    INSERT INTO barbeiros (nome, especialidade, telefone, experiencia_anos) 
    VALUES (?, ?, ?, ?)
  `);
  
  const info = stmt.run(nome, especialidade, telefone, experiencia_anos);
  res.status(201).json({ id: info.lastInsertRowid, mensagem: 'Barbeiro cadastrado com sucesso!' });
});
app.get('/barbeiros', (req, res) => {
  const stmt = db.prepare('SELECT * FROM barbeiros');
  const barbeiros = stmt.all();
  res.json(barbeiros);
});
app.get('/barbeiros/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM barbeiros WHERE id = ?');
  const barbeiro = stmt.get(req.params.id);

  if (!barbeiro) return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
  
  res.json(barbeiro);
});
app.put('/barbeiros/:id', (req, res) => {
  const { nome, especialidade, telefone, experiencia_anos } = req.body;
  const { id } = req.params;

  const stmt = db.prepare(`
    UPDATE barbeiros 
    SET nome = ?, especialidade = ?, telefone = ?, experiencia_anos = ? 
    WHERE id = ?
  `);
  
  const info = stmt.run(nome, especialidade, telefone, experiencia_anos, id);

  if (info.changes === 0) {
    return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
  }

  res.json({ mensagem: 'Dados atualizados com sucesso!' });
});

app.delete('/barbeiros/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM barbeiros WHERE id = ?');
  const info = stmt.run(req.params.id);

  if (info.changes === 0) {
    return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
  }

  res.json({ mensagem: 'Barbeiro removido com sucesso!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Banco de dados SQLite criado/conectado com sucesso.`);
});