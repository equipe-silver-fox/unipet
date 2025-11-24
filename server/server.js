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
  
  // Validações de entrada
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }
  
  // Validar formato do email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erro: "Email inválido" });
  }
  
  // Validar nome
  if (nome.length < 3 || nome.length > 50) {
    return res.status(400).json({ erro: "Nome deve ter entre 3 e 50 caracteres" });
  }
  
  // Validar senha
  if (senha.length < 8) {
    return res.status(400).json({ erro: "Senha deve ter no mínimo 8 caracteres" });
  }
  
  const db = lerJSON("usuarios.json");

  // Verificar email duplicado
  if (db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ erro: "Email já cadastrado" });
  }

  const novoUsuario = { 
    id: Date.now(), 
    nome: nome.trim(), 
    email: email.toLowerCase().trim(), 
    senha // Em produção, usar bcrypt para hash
  };
  
  db.usuarios.push(novoUsuario);
  escreverJSON("usuarios.json", db);
  
  // Não retornar a senha
  const { senha: _, ...usuarioSemSenha } = novoUsuario;
  res.status(201).json(usuarioSemSenha);
});

// Rota de login com email
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }
  
  const usuarios = lerJSON("usuarios.json").usuarios;
  
  // Comparar email em lowercase e senha
  const user = usuarios.find(u => 
    u.email.toLowerCase() === email.toLowerCase().trim() && 
    u.senha === senha
  );
  
  if (!user) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }
  
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
  const { nome, tipo, idade, imagem, raca, local, contato, descricao } = req.body;
  const db = lerJSON("pets.json");
  const novoPet = { 
    id: Date.now(), 
    nome, 
    tipo, 
    idade, 
    imagem,
    raca: raca || null,
    local: local || null,
    contato: contato || null,
    descricao: descricao || null
  };
  db.pets.push(novoPet);
  escreverJSON("pets.json", db);
  res.status(201).json(novoPet);
});

// --------------------- DOAÇÕES ---------------------

app.get("/doacoes", (req, res) => {
  const doacoes = lerJSON("doacoes.json").doacoes;
  res.json(doacoes);
});

app.post("/doacoes", (req, res) => {
  const { tipo, doador, detalhes } = req.body;
  const db = lerJSON("doacoes.json");
  const novaDoacao = {
    id: Date.now(),
    tipo,
    doador,
    detalhes,
    data: new Date().toISOString(),
    status: "pendente"
  };
  db.doacoes.push(novaDoacao);
  escreverJSON("doacoes.json", db);
  res.status(201).json(novaDoacao);
});

// --------------------- ADOÇÕES ---------------------

app.get("/adocoes", (req, res) => {
  const adocoes = lerJSON("adocoes.json").adocoes;
  res.json(adocoes);
});

app.post("/adocoes", (req, res) => {
  const { petId, petName, adotante } = req.body;
  const db = lerJSON("adocoes.json");
  const novaAdocao = {
    id: Date.now(),
    petId,
    petName,
    adotante,
    data: new Date().toISOString(),
    status: "pendente"
  };
  db.adocoes.push(novaAdocao);
  escreverJSON("adocoes.json", db);
  res.status(201).json(novaAdocao);
});

// --------------------- SERVIDOR ---------------------

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
