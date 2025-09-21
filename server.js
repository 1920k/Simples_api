import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(express.json());

// abrir banco de dados SQLite
const db = await open({
  filename: "./database.sqlite",
  driver: sqlite3.Database
});

// criar tabela se não existir
await db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE
)`);

// rota para listar todos
app.get("/usuarios", async (req, res) => {
  const rows = await db.all("SELECT * FROM usuarios");
  res.json(rows);
});

// rota para adicionar
app.post("/usuarios", async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await db.run("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email]);
    res.json({ id: result.lastID, nome, email });
  } catch (err) {
    res.status(400).json({ erro: "Email já existe" });
  }
});

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
