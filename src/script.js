// Acessibilidade
const btnAcessibilidade = document.getElementById("btnAcessibilidade");
const menuAcessibilidade = document.getElementById("menuAcessibilidade");
const btnAumentar = document.getElementById("aumentarFonte");
const btnDiminuir = document.getElementById("diminuirFonte");
const btnContraste = document.getElementById("altoContraste");
const btnReset = document.getElementById("resetarAcessibilidade");
// Navigation
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");



// Add pets
const btnAddPet = document.getElementById("btnAddPet");
const modalAddPet = document.getElementById("modalAddPet");
const closeModal = document.getElementById("closeModal");
const formAddPet = document.getElementById("formAddPet");


navItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all items
    navItems.forEach((nav) => nav.classList.remove("active"));

    // Add active class to clicked item
    this.classList.add("active");

    // Hide all pages
    pages.forEach((page) => page.classList.add("hidden"));

    // Show selected page
    const pageName = this.getAttribute("data-page");
    document.getElementById(`page-${pageName}`).classList.remove("hidden");
  });
});

let tamanhoFonte = 100;

// Exibe/oculta menu
btnAcessibilidade.addEventListener("click", () => {
  menuAcessibilidade.classList.toggle("hidden");
});

// Aumentar fonte
btnAumentar.addEventListener("click", () => {
  tamanhoFonte += 10;
  document.body.style.fontSize = tamanhoFonte + "%";
});

// Diminuir fonte
btnDiminuir.addEventListener("click", () => {
  if (tamanhoFonte > 60) {
    tamanhoFonte -= 10;
    document.body.style.fontSize = tamanhoFonte + "%";
  }
});

// Alternar alto contraste
btnContraste.addEventListener("click", () => {
  document.body.classList.toggle("alto-contraste");
});

// Resetar configurações
btnReset.addEventListener("click", () => {
  tamanhoFonte = 100;
  document.body.style.fontSize = "100%";
  document.body.classList.remove("alto-contraste");
});


// Abrir modal
btnAddPet.addEventListener("click", () => modalAddPet.classList.remove("hidden"));

// Fechar modal
closeModal.addEventListener("click", () => modalAddPet.classList.add("hidden"));

// Adicionar pet
formAddPet.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = formAddPet.querySelector('input[placeholder="Nome"]').value;
  const tipo = formAddPet.querySelector('input[placeholder="Tipo"]').value;
  const idade = formAddPet.querySelector('input[placeholder="Idade"]').value;
  const imagem = formAddPet.querySelector('input[placeholder="URL da Imagem"]').value;

  try {
    const res = await fetch(`${API_URL}/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, tipo, idade, imagem }),
    });

    if (!res.ok) throw new Error("Erro ao adicionar pet");
    const pet = await res.json();

    // Atualiza lista de pets sem recarregar página
    const container = document.getElementById("page-pets");
    const card = document.createElement("div");
    card.className = "pet-card";
    card.innerHTML = `
      <div class="pet-avatar"><img src="${pet.imagem}" /></div>
      <div class="pet-info">
        <div class="pet-name">${pet.nome}</div>
        <div class="pet-details"><span>${pet.tipo}</span> • <span>${pet.idade || "?"} anos</span></div>
      </div>`;
    container.appendChild(card);

    modalAddPet.classList.add("hidden"); // fecha modal
    formAddPet.reset(); // limpa formulário
    alert("Pet adicionado com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar pet.");
  }
});
