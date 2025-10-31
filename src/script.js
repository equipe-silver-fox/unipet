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
