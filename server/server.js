import jsonServer from "json-server";
import fs from "fs";

const API_URL = "http://localhost:3000";
const usuariosURL = `${API_URL}/usuarios`;
const petsURL = `${API_URL}/pets`;

// Função de login
async function login(email, senha) {
  const res = await fetch(usuariosURL);
  const usuarios = await res.json();
  const user = usuarios.find(u => u.email === email && u.senha === senha);
  if (user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Email ou senha inválidos!");
  }
}

// Função de registro
async function registrar(nome, email, senha) {
  const res = await fetch(usuariosURL);
  const usuarios = await res.json();
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    alert("Email já cadastrado!");
    return;
  }
  const novoUsuario = { nome, email, senha };
  await fetch(usuariosURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario)
  });
  alert("Cadastro realizado com sucesso!");
  window.location.href = "loguin.html";
}

// Logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "loguin.html";
}

// Carregar pets dinamicamente
async function carregarPets() {
  const res = await fetch(petsURL);
  const pets = await res.json();
  const container = document.querySelector("#page-pets");
  container.innerHTML = `<h2 class="section-title"><i class="fa-solid fa-dog"></i> Nossos Pets</h2>`;
  pets.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("pet-card");
    card.innerHTML = `
      <div class="pet-avatar">
        <img src="${p.imagem}" />
      </div>
      <div class="pet-info">
        <div class="pet-name">${p.nome}</div>
        <div class="pet-details">
          <span>${p.tipo}</span> • <span>${p.idade} anos</span>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// Verificar sessão
function verificarSessao() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    if (!window.location.href.includes("loguin") && !window.location.href.includes("registrar")) {
      window.location.href = "loguin.html";
    }
  } else {
    // Preencher dados do perfil
    const nomeEl = document.querySelector(".profile-name");
    const emailEl = document.querySelector(".profile-email");
    if (nomeEl) nomeEl.textContent = usuario.nome;
    if (emailEl) emailEl.textContent = usuario.email;
  }
}

// Executar funções automaticamente no index
if (window.location.href.includes("index.html")) {
  verificarSessao();
  carregarPets();
}

// Executar logout
const logoutBtn = document.querySelector(".fa-right-from-bracket");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// Formulários
const loginForm = document.querySelector("form[action='login']");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const senha = loginForm.querySelector('input[type="password"]').value;
    login(email, senha);
  });
}

const registrarForm = document.querySelector("form[action='registrar']");
if (registrarForm) {
  registrarForm.addEventListener("submit", e => {
    e.preventDefault();
    const nome = registrarForm.querySelector('input[placeholder="Nome"]').value;
    const email = registrarForm.querySelector('input[type="email"]').value;
    const senha = registrarForm.querySelector('input[type="password"]').value;
    registrar(nome, email, senha);
  });
}
