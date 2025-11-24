const API_URL = "http://localhost:3000";
const usuariosURL = `${API_URL}/usuarios`;
const petsURL = `${API_URL}/pets`;

// --------------------- LOGIN ---------------------
async function login(email, senha) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    alert("Email ou senha inválidos!");
    return;
  }

  const user = await res.json();
  localStorage.setItem("usuarioLogado", JSON.stringify(user));
  window.location.href = "index.html";
}

// --------------------- REGISTRO ---------------------
async function registrar(nome, email, senha) {
  try {
    const res = await fetch(`${usuariosURL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.erro || "Erro ao registrar");
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
}

// --------------------- SESSÃO ---------------------
function verificarSessao() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    if (!window.location.href.includes("login") && !window.location.href.includes("registrar")) {
      window.location.href = "login.html";
    }
  } else {
    const nomeEl = document.querySelector(".profile-name");
    const emailEl = document.querySelector(".profile-email");
    if (nomeEl) nomeEl.textContent = usuario.nome;
    if (emailEl) emailEl.textContent = usuario.email;
  }
}

// --------------------- LOGOUT ---------------------
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

// --------------------- EDITAR PERFIL ---------------------
const editarPerfilBtn = document.querySelector(".menu-item:nth-child(1)");
editarPerfilBtn?.addEventListener("click", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  const novoNome = prompt("Digite seu novo nome:", usuario.nome);
  const novoEmail = prompt("Digite seu novo email:", usuario.email);
  if (!novoNome || !novoEmail) return alert("Nome e email são obrigatórios!");

  usuario.nome = novoNome;
  usuario.email = novoEmail;
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  document.querySelector(".profile-name").textContent = usuario.nome;
  document.querySelector(".profile-email").textContent = usuario.email;

  try {
    const res = await fetch(`${usuariosURL}/${usuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!res.ok) throw new Error("Erro ao atualizar usuário");
    alert("Perfil atualizado com sucesso!");
  } catch (err) {
    alert("Não foi possível atualizar o perfil no servidor.");
  }
});

// --------------------- CARREGAR PETS ---------------------
async function carregarPets() {
  const res = await fetch(petsURL);
  const pets = await res.json();
  const container = document.querySelector("#page-pets");
  container.innerHTML = `<h2 class="section-title"><i class="fa-solid fa-dog"></i> Nossos Pets</h2>`;

  pets.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("pet-card");
    card.innerHTML = `
      <div class="pet-avatar"><img src="${p.imagem}" /></div>
      <div class="pet-info">
        <div class="pet-name">${p.nome}</div>
        <div class="pet-details"><span>${p.tipo}</span> • <span>${p.idade || "?"} anos</span></div>
      </div>`;
    container.appendChild(card);
  });
}

// --------------------- MENU INFERIOR ---------------------
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove("active"));
    this.classList.add("active");

    pages.forEach(page => page.classList.add("hidden"));
    const pageName = this.getAttribute("data-page");
    document.getElementById(`page-${pageName}`).classList.remove("hidden");
  });
});

// --------------------- ACESSIBILIDADE ---------------------
let tamanhoFonte = 100;
const btnAcessibilidade = document.getElementById("btnAcessibilidade");
const menuAcessibilidade = document.getElementById("menuAcessibilidade");
const btnAumentar = document.getElementById("aumentarFonte");
const btnDiminuir = document.getElementById("diminuirFonte");
const btnContraste = document.getElementById("altoContraste");
const btnReset = document.getElementById("resetarAcessibilidade");

btnAcessibilidade?.addEventListener("click", () => menuAcessibilidade.classList.toggle("hidden"));
btnAumentar?.addEventListener("click", () => { tamanhoFonte += 10; document.body.style.fontSize = tamanhoFonte + "%"; });
btnDiminuir?.addEventListener("click", () => { if (tamanhoFonte > 60) { tamanhoFonte -= 10; document.body.style.fontSize = tamanhoFonte + "%"; } });
btnContraste?.addEventListener("click", () => document.body.classList.toggle("alto-contraste"));
btnReset?.addEventListener("click", () => { tamanhoFonte = 100; document.body.style.fontSize = "100%"; document.body.classList.remove("alto-contraste"); });

const sairBtn = document.querySelector('.menu-item[data-action="sair"]');
sairBtn?.addEventListener("click", logout);

// --------------------- MODAL ADICIONAR PET ---------------------
const btnAddPetProfile = document.getElementById("btnAddPetProfile");
const modalAddPetProfile = document.getElementById("modalAddPetProfile");
const btnCancelPetProfile = document.getElementById("btnCancelPetProfile");
const closeModalAddPetProfile = document.getElementById("closeModalAddPetProfile");

btnAddPetProfile?.addEventListener("click", () => {
  modalAddPetProfile.classList.remove("hidden");
});

btnCancelPetProfile?.addEventListener("click", () => {
  modalAddPetProfile.classList.add("hidden");
});

closeModalAddPetProfile?.addEventListener("click", () => {
  modalAddPetProfile.classList.add("hidden");
});

// --------------------- EXECUTAR AO CARREGAR ---------------------
window.addEventListener("DOMContentLoaded", () => {
  verificarSessao();
  if (document.querySelector("#page-pets")) carregarPets();
});