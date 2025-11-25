// ============================================
// 🐾 UNIPET - API REST
// ============================================
// Servidor Express.js com endpoints para gerenciar:
// - Usuários (cadastro, login, perfil)
// - Pets (listagem, cadastro, edição, remoção)
// - Adoções (solicitações, aprovações)
// - Doações (registro de doações)
// - Estatísticas do sistema

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ============================================
// MIDDLEWARES
// ============================================

// CORS: Permite requisições de qualquer origem
app.use(cors());

// Body Parser: Processa JSON com limite de 50MB (para imagens base64)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware de tratamento de erro: Captura erros de payload muito grande
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      erro: 'Arquivo muito grande. O tamanho máximo permitido é 50MB.',
      mensagem: 'Por favor, reduza o tamanho da imagem antes de enviar.'
    });
  }
  next(err);
});

// Caminho do banco de dados único (arquivo JSON)
const DB_PATH = path.join(__dirname, "db", "db.json");

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

/**
 * Lê o banco de dados completo
 * @returns {Object} Objeto com usuarios, pets, adocoes, doacoes
 */
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialDB = {
        usuarios: [],
        pets: [],
        adocoes: [],
        doacoes: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), "utf-8");
      return initialDB;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    
    // Se pets não existir no db.json, carrega do pets.json
    if (!db.pets) {
      try {
        const PETS_PATH = path.join(__dirname, "db", "pets.json");
        if (fs.existsSync(PETS_PATH)) {
          const petsData = fs.readFileSync(PETS_PATH, "utf-8");
          const petsObj = JSON.parse(petsData);
          db.pets = petsObj.pets || [];
        } else {
          db.pets = [];
        }
      } catch (err) {
        console.log("Aviso: não foi possível carregar pets.json");
        db.pets = [];
      }
    }
    
    return db;
  } catch (err) {
    console.error("Erro ao ler banco de dados:", err);
    return null;
  }
};

/**
 * Salva o banco de dados completo
 * @param {Object} data - Dados completos do banco
 * @returns {boolean} true se sucesso, false se erro
 */
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Erro ao escrever banco de dados:", err);
    return false;
  }
};

/**
 * Gera um ID sequencial para uma coleção
 * @param {Array} collection - Array da coleção
 * @returns {number} Próximo ID disponível
 */
const generateId = (collection) => {
  if (!collection || collection.length === 0) return 1;
  const maxId = Math.max(...collection.map(item => item.id || 0));
  return maxId + 1;
};

/**
 * Validação de email
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Sanitiza string para evitar injeções
 * @param {string} str
 * @returns {string}
 */
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
};

// ========================================
// MIDDLEWARE DE LOG
// ========================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// ROTAS DE USUÁRIOS
// ========================================

/**
 * POST /login
 * Autenticação de usuário
 */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ 
      error: "Email e senha são obrigatórios.",
      code: "MISSING_CREDENTIALS"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: "Email inválido.",
      code: "INVALID_EMAIL"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const usuario = db.usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  );

  if (usuario) {
    const { senha, ...usuarioSemSenha } = usuario;
    res.json({
      success: true,
      usuario: usuarioSemSenha,
      message: "Login realizado com sucesso"
    });
  } else {
    res.status(401).json({ 
      error: "Email ou senha incorretos.",
      code: "INVALID_CREDENTIALS"
    });
  }
});

/**
 * POST /usuarios
 * Cadastro de novo usuário
 */
app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ 
      error: "Nome, email e senha são obrigatórios.",
      code: "MISSING_FIELDS"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: "Email inválido.",
      code: "INVALID_EMAIL"
    });
  }

  if (senha.length < 8) {
    return res.status(400).json({ 
      error: "Senha deve ter no mínimo 8 caracteres.",
      code: "WEAK_PASSWORD"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const emailExiste = db.usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (emailExiste) {
    return res.status(409).json({ 
      error: "Email já cadastrado.",
      code: "EMAIL_EXISTS"
    });
  }

  const novoUsuario = {
    id: generateId(db.usuarios),
    nome: sanitize(nome),
    email: email.toLowerCase(),
    senha,
    dataCadastro: new Date().toISOString(),
    admin: false
  };

  db.usuarios.push(novoUsuario);

  if (writeDB(db)) {
    const { senha, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({
      success: true,
      usuario: usuarioSemSenha,
      message: "Usuário cadastrado com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao salvar usuário.",
      code: "DB_WRITE_ERROR"
    });
  }
});

/**
 * GET /usuarios
 * Listar todos os usuários
 */
app.get("/usuarios", (req, res) => {
  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const usuariosSemSenha = db.usuarios.map(({ senha, ...usuario }) => usuario);
  res.json({
    success: true,
    total: usuariosSemSenha.length,
    usuarios: usuariosSemSenha
  });
});

/**
 * GET /usuarios/:id
 * Buscar usuário por ID
 */
app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const usuario = db.usuarios.find((u) => u.id === parseInt(id));
  
  if (!usuario) {
    return res.status(404).json({ 
      error: "Usuário não encontrado.",
      code: "USER_NOT_FOUND"
    });
  }

  const { senha, ...usuarioSemSenha } = usuario;
  res.json({
    success: true,
    usuario: usuarioSemSenha
  });
});

/**
 * PUT /usuarios/:id
 * Atualizar usuário
 */
app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.usuarios.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Usuário não encontrado.",
      code: "USER_NOT_FOUND"
    });
  }

  if (nome) db.usuarios[index].nome = sanitize(nome);
  if (email) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Email inválido.",
        code: "INVALID_EMAIL"
      });
    }
    db.usuarios[index].email = email.toLowerCase();
  }
  if (senha) {
    if (senha.length < 8) {
      return res.status(400).json({ 
        error: "Senha deve ter no mínimo 8 caracteres.",
        code: "WEAK_PASSWORD"
      });
    }
    db.usuarios[index].senha = senha;
  }

  db.usuarios[index].dataAtualizacao = new Date().toISOString();

  if (writeDB(db)) {
    const { senha, ...usuarioSemSenha } = db.usuarios[index];
    res.json({
      success: true,
      usuario: usuarioSemSenha,
      message: "Usuário atualizado com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao atualizar usuário.",
      code: "DB_WRITE_ERROR"
    });
  }
});

/**
 * DELETE /usuarios/:id
 * Deletar usuário
 */
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.usuarios.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Usuário não encontrado.",
      code: "USER_NOT_FOUND"
    });
  }

  const usuarioRemovido = db.usuarios.splice(index, 1)[0];

  if (writeDB(db)) {
    res.json({
      success: true,
      message: "Usuário removido com sucesso",
      usuario: usuarioRemovido.nome
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao deletar usuário.",
      code: "DB_WRITE_ERROR"
    });
  }
});

// ========================================
// ROTAS DE PETS
// ========================================

/**
 * GET /pets
 * Listar todos os pets
 */
app.get("/pets", (req, res) => {
  const { tipo, idade, local, disponivel } = req.query;
  
  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  let pets = db.pets || [];

  if (tipo) {
    pets = pets.filter(p => p.tipo.toLowerCase() === tipo.toLowerCase());
  }
  if (idade) {
    pets = pets.filter(p => p.idade === parseInt(idade));
  }
  if (local) {
    pets = pets.filter(p => p.local && p.local.toLowerCase().includes(local.toLowerCase()));
  }
  if (disponivel !== undefined) {
    const isDisponivel = disponivel === 'true';
    pets = pets.filter(p => p.disponivel === isDisponivel);
  }

  res.json(pets);
});

/**
 * GET /pets/:id
 * Buscar pet por ID
 */
app.get("/pets/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const pet = db.pets.find((p) => p.id === parseInt(id));
  
  if (!pet) {
    return res.status(404).json({ 
      error: "Pet não encontrado.",
      code: "PET_NOT_FOUND"
    });
  }

  res.json({
    success: true,
    pet: pet
  });
});

/**
 * POST /pets
 * Adicionar novo pet
 */
app.post("/pets", (req, res) => {
  const { nome, tipo, idade, descricao, raca, local, contato, imagem, usuarioId } = req.body;

  if (!nome || !tipo) {
    return res.status(400).json({ 
      error: "Nome e tipo são obrigatórios.",
      code: "MISSING_FIELDS"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const novoPet = {
    id: generateId(db.pets),
    nome: sanitize(nome),
    tipo: sanitize(tipo),
    idade: idade ? parseInt(idade) : null,
    descricao: sanitize(descricao || ""),
    raca: sanitize(raca || ""),
    local: sanitize(local || ""),
    contato: sanitize(contato || ""),
    imagem: imagem || "",
    usuarioId: usuarioId || null,
    disponivel: true,
    dataCadastro: new Date().toISOString()
  };

  db.pets.push(novoPet);

  if (writeDB(db)) {
    res.status(201).json({
      success: true,
      pet: novoPet,
      message: "Pet cadastrado com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao salvar pet.",
      code: "DB_WRITE_ERROR"
    });
  }
});

/**
 * PUT /pets/:id
 * Atualizar pet
 */
app.put("/pets/:id", (req, res) => {
  const { id } = req.params;
  const { nome, tipo, idade, descricao, raca, local, contato, imagem, disponivel } = req.body;

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.pets.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Pet não encontrado.",
      code: "PET_NOT_FOUND"
    });
  }

  if (nome) db.pets[index].nome = sanitize(nome);
  if (tipo) db.pets[index].tipo = sanitize(tipo);
  if (idade !== undefined) db.pets[index].idade = parseInt(idade);
  if (descricao !== undefined) db.pets[index].descricao = sanitize(descricao);
  if (raca !== undefined) db.pets[index].raca = sanitize(raca);
  if (local !== undefined) db.pets[index].local = sanitize(local);
  if (contato !== undefined) db.pets[index].contato = sanitize(contato);
  if (imagem !== undefined) db.pets[index].imagem = imagem;
  if (disponivel !== undefined) db.pets[index].disponivel = disponivel;
  
  db.pets[index].dataAtualizacao = new Date().toISOString();

  if (writeDB(db)) {
    res.json({
      success: true,
      pet: db.pets[index],
      message: "Pet atualizado com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao atualizar pet.",
      code: "DB_WRITE_ERROR"
    });
  }
});

/**
 * DELETE /pets/:id
 * Deletar pet
 */
app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.pets.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Pet não encontrado.",
      code: "PET_NOT_FOUND"
    });
  }

  const petRemovido = db.pets.splice(index, 1)[0];

  if (writeDB(db)) {
    res.json({
      success: true,
      message: "Pet removido com sucesso",
      pet: petRemovido.nome
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao deletar pet.",
      code: "DB_WRITE_ERROR"
    });
  }
});

// ========================================
// ROTAS DE ADOÇÕES
// ========================================

app.get("/adocoes", (req, res) => {
  const { status, usuarioId, petId } = req.query;
  
  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  let adocoes = db.adocoes || [];

  if (status) {
    adocoes = adocoes.filter(a => a.status === status);
  }
  if (usuarioId) {
    adocoes = adocoes.filter(a => a.usuarioLogado && a.usuarioLogado.id === parseInt(usuarioId));
  }
  if (petId) {
    adocoes = adocoes.filter(a => a.petId === parseInt(petId));
  }

  res.json(adocoes);
});

app.get("/adocoes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const adocao = db.adocoes.find((a) => a.id === parseInt(id));
  
  if (!adocao) {
    return res.status(404).json({ 
      error: "Adoção não encontrada.",
      code: "ADOPTION_NOT_FOUND"
    });
  }

  res.json({
    success: true,
    adocao: adocao
  });
});

app.post("/adocoes", (req, res) => {
  const { petId, petNome, adotante, usuarioLogado } = req.body;

  if (!petId || !adotante) {
    return res.status(400).json({ 
      error: "PetId e dados do adotante são obrigatórios.",
      code: "MISSING_FIELDS"
    });
  }

  if (!adotante.nome || !adotante.email || !adotante.telefone || !adotante.cpf) {
    return res.status(400).json({ 
      error: "Nome, email, telefone e CPF do adotante são obrigatórios.",
      code: "INCOMPLETE_ADOPTER_DATA"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const pet = db.pets.find(p => p.id === parseInt(petId));
  if (!pet) {
    return res.status(404).json({ 
      error: "Pet não encontrado.",
      code: "PET_NOT_FOUND"
    });
  }

  const novaAdocao = {
    id: generateId(db.adocoes),
    petId: parseInt(petId),
    petNome: petNome || pet.nome,
    adotante: {
      nome: sanitize(adotante.nome),
      email: adotante.email,
      telefone: adotante.telefone,
      cpf: adotante.cpf,
      endereco: sanitize(adotante.endereco || ""),
      experiencia: adotante.experiencia || "",
      motivacao: sanitize(adotante.motivacao || "")
    },
    usuarioLogado: usuarioLogado || null,
    datasolicitacao: new Date().toISOString(),
    dataSolicitacaoFormatada: new Date().toLocaleString('pt-BR'),
    status: "pendente"
  };

  db.adocoes.push(novaAdocao);

  if (writeDB(db)) {
    res.status(201).json({
      success: true,
      adocao: novaAdocao,
      message: "Solicitação de adoção registrada com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao salvar adoção.",
      code: "DB_WRITE_ERROR"
    });
  }
});

app.put("/adocoes/:id", (req, res) => {
  const { id } = req.params;
  const { status, observacoes } = req.body;

  if (!status || !['pendente', 'aprovado', 'rejeitado'].includes(status)) {
    return res.status(400).json({ 
      error: "Status inválido. Use: pendente, aprovado ou rejeitado.",
      code: "INVALID_STATUS"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.adocoes.findIndex((a) => a.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Adoção não encontrada.",
      code: "ADOPTION_NOT_FOUND"
    });
  }

  db.adocoes[index].status = status;
  db.adocoes[index].dataAtualizacao = new Date().toISOString();
  if (observacoes) {
    db.adocoes[index].observacoes = sanitize(observacoes);
  }

  if (status === 'aprovado') {
    const petIndex = db.pets.findIndex(p => p.id === db.adocoes[index].petId);
    if (petIndex !== -1) {
      db.pets[petIndex].disponivel = false;
      db.pets[petIndex].dataAdocao = new Date().toISOString();
    }
  }

  if (writeDB(db)) {
    res.json({
      success: true,
      adocao: db.adocoes[index],
      message: `Adoção ${status} com sucesso`
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao atualizar adoção.",
      code: "DB_WRITE_ERROR"
    });
  }
});

app.delete("/adocoes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.adocoes.findIndex((a) => a.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Adoção não encontrada.",
      code: "ADOPTION_NOT_FOUND"
    });
  }

  const adocaoRemovida = db.adocoes.splice(index, 1)[0];

  if (writeDB(db)) {
    res.json({
      success: true,
      message: "Adoção cancelada com sucesso",
      adocao: adocaoRemovida
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao cancelar adoção.",
      code: "DB_WRITE_ERROR"
    });
  }
});

// ========================================
// ROTAS DE DOAÇÕES
// ========================================

app.get("/doacoes", (req, res) => {
  const { tipo } = req.query;
  
  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  let doacoes = db.doacoes || [];

  if (tipo) {
    doacoes = doacoes.filter(d => d.tipo.toLowerCase() === tipo.toLowerCase());
  }

  res.json(doacoes);
});

app.get("/doacoes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const doacao = db.doacoes.find((d) => d.id === parseInt(id));
  
  if (!doacao) {
    return res.status(404).json({ 
      error: "Doação não encontrada.",
      code: "DONATION_NOT_FOUND"
    });
  }

  res.json({
    success: true,
    doacao: doacao
  });
});

app.post("/doacoes", (req, res) => {
  const { tipo, doador, detalhes, observacoes } = req.body;

  if (!tipo || !doador) {
    return res.status(400).json({ 
      error: "Tipo e dados do doador são obrigatórios.",
      code: "MISSING_FIELDS"
    });
  }

  if (!doador.nome || !doador.email || !doador.telefone) {
    return res.status(400).json({ 
      error: "Nome, email e telefone do doador são obrigatórios.",
      code: "INCOMPLETE_DONOR_DATA"
    });
  }

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const novaDoacao = {
    id: generateId(db.doacoes),
    tipo: sanitize(tipo),
    doador: {
      nome: sanitize(doador.nome),
      email: doador.email,
      telefone: doador.telefone
    },
    detalhes: detalhes || {},
    observacoes: sanitize(observacoes || ""),
    data: new Date().toISOString(),
    dataFormatada: new Date().toLocaleString('pt-BR'),
    status: "recebido"
  };

  db.doacoes.push(novaDoacao);

  if (writeDB(db)) {
    res.status(201).json({
      success: true,
      doacao: novaDoacao,
      message: "Doação registrada com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao salvar doação.",
      code: "DB_WRITE_ERROR"
    });
  }
});

app.put("/doacoes/:id", (req, res) => {
  const { id } = req.params;
  const { status, observacoes } = req.body;

  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.doacoes.findIndex((d) => d.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Doação não encontrada.",
      code: "DONATION_NOT_FOUND"
    });
  }

  if (status) db.doacoes[index].status = status;
  if (observacoes) db.doacoes[index].observacoes = sanitize(observacoes);
  db.doacoes[index].dataAtualizacao = new Date().toISOString();

  if (writeDB(db)) {
    res.json({
      success: true,
      doacao: db.doacoes[index],
      message: "Doação atualizada com sucesso"
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao atualizar doação.",
      code: "DB_WRITE_ERROR"
    });
  }
});

app.delete("/doacoes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const index = db.doacoes.findIndex((d) => d.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ 
      error: "Doação não encontrada.",
      code: "DONATION_NOT_FOUND"
    });
  }

  const doacaoRemovida = db.doacoes.splice(index, 1)[0];

  if (writeDB(db)) {
    res.json({
      success: true,
      message: "Doação removida com sucesso",
      doacao: doacaoRemovida
    });
  } else {
    res.status(500).json({ 
      error: "Erro ao deletar doação.",
      code: "DB_WRITE_ERROR"
    });
  }
});

// ========================================
// ROTA DE ESTATÍSTICAS
// ========================================

app.get("/estatisticas", (req, res) => {
  const db = readDB();
  if (!db) {
    return res.status(500).json({ 
      error: "Erro ao acessar banco de dados.",
      code: "DB_ERROR"
    });
  }

  const stats = {
    usuarios: {
      total: db.usuarios.length,
      admins: db.usuarios.filter(u => u.admin).length
    },
    pets: {
      total: db.pets.length,
      disponiveis: db.pets.filter(p => p.disponivel).length,
      adotados: db.pets.filter(p => !p.disponivel).length,
      porTipo: {}
    },
    adocoes: {
      total: db.adocoes.length,
      pendentes: db.adocoes.filter(a => a.status === 'pendente').length,
      aprovadas: db.adocoes.filter(a => a.status === 'aprovado').length,
      rejeitadas: db.adocoes.filter(a => a.status === 'rejeitado').length
    },
    doacoes: {
      total: db.doacoes.length,
      porTipo: {}
    }
  };

  db.pets.forEach(pet => {
    stats.pets.porTipo[pet.tipo] = (stats.pets.porTipo[pet.tipo] || 0) + 1;
  });

  db.doacoes.forEach(doacao => {
    stats.doacoes.porTipo[doacao.tipo] = (stats.doacoes.porTipo[doacao.tipo] || 0) + 1;
  });

  res.json({
    success: true,
    estatisticas: stats,
    dataConsulta: new Date().toISOString()
  });
});

// ========================================
// ROTA DE HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor Unipet rodando",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// ========================================
// ROTA 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    code: "NOT_FOUND",
    path: req.path
  });
});

// ========================================
// TRATAMENTO DE ERROS GLOBAL
// ========================================

app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).json({
    error: "Erro interno do servidor",
    code: "INTERNAL_SERVER_ERROR",
    message: err.message
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log("========================================");
  console.log("🐾 Servidor Unipet API v2.0");
  console.log(`🌐 Rodando em: http://localhost:${PORT}`);
  console.log("========================================");
  console.log("\n📋 Rotas disponíveis:");
  console.log("  - GET    /health");
  console.log("  - GET    /estatisticas");
  console.log("\n👥 Usuários:");
  console.log("  - POST   /login");
  console.log("  - POST   /usuarios");
  console.log("  - GET    /usuarios");
  console.log("  - GET    /usuarios/:id");
  console.log("  - PUT    /usuarios/:id");
  console.log("  - DELETE /usuarios/:id");
  console.log("\n🐾 Pets:");
  console.log("  - GET    /pets");
  console.log("  - GET    /pets/:id");
  console.log("  - POST   /pets");
  console.log("  - PUT    /pets/:id");
  console.log("  - DELETE /pets/:id");
  console.log("\n💚 Adoções:");
  console.log("  - GET    /adocoes");
  console.log("  - GET    /adocoes/:id");
  console.log("  - POST   /adocoes");
  console.log("  - PUT    /adocoes/:id");
  console.log("  - DELETE /adocoes/:id");
  console.log("\n❤️ Doações:");
  console.log("  - GET    /doacoes");
  console.log("  - GET    /doacoes/:id");
  console.log("  - POST   /doacoes");
  console.log("  - PUT    /doacoes/:id");
  console.log("  - DELETE /doacoes/:id");
  console.log("\n========================================\n");
});
