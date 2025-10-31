import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

const dbPath = path.join(process.cwd(), "server", "db");

const lerJSON = (arquivo) => {
  const caminho = path.join(dbPath, arquivo);
  return JSON.parse(fs.readFileSync(caminho, "utf-8"));
};

const escreverJSON = (arquivo, data) => {
  const caminho = path.join(dbPath, arquivo);
  fs.writeFileSync(caminho, JSON.stringify(data, null, 2), "utf-8");
};

// --------------------- USUÁRIOS ---------------------

app.get("/usuarios", (req, res) => {
  const usuarios = lerJSON("usuarios.json").usuarios;
  res.json(usuarios);
});

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  const db = lerJSON("usuarios.json");

  if (db.usuarios.find(u => u.email === email)) {
    return res.status(400).json({ erro: "Email já cadastrado" });
  }

  const novoUsuario = { id: Date.now(), nome, email, senha };
  db.usuarios.push(novoUsuario);
  escreverJSON("usuarios.json", db);
  res.status(201).json(novoUsuario);
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuarios = lerJSON("usuarios.json").usuarios;
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) return res.status(401).json({ erro: "Email ou senha inválidos" });
  res.json(user);
});

app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = lerJSON("usuarios.json");
  const index = db.usuarios.findIndex(u => u.id === id);

  if (index === -1) return res.status(404).json({ erro: "Usuário não encontrado" });

  db.usuarios[index] = { ...db.usuarios[index], ...req.body };
  escreverJSON("usuarios.json", db);

  res.json(db.usuarios[index]);
});

// --------------------- PETS ---------------------

app.get("/pets", (req, res) => {
  const pets = lerJSON("pets.json").pets;
  res.json(pets);
});

app.post("/pets", (req, res) => {
  const { nome, tipo, idade, imagem } = req.body;
  const db = lerJSON("pets.json");
  const novoPet = { id: Date.now(), nome, tipo, idade, imagem };
  db.pets.push(novoPet);
  escreverJSON("pets.json", db);
  res.status(201).json(novoPet);
});

// --------------------- SERVIDOR ---------------------

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
