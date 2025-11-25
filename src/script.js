// ============================================
// 🐾 UNIPET - Sistema de Adoção de Pets
// ============================================
// Este arquivo contém toda a lógica do frontend
// Organizado em seções para fácil navegação

// ============================================
// 📊 VARIÁVEIS GLOBAIS
// ============================================
let tamanhoFonte = 100; // Tamanho atual da fonte (%)
let acessibilidadeAtiva = {
  altoContraste: false,
  modoEscuro: false,
  guiaLeitura: false,
  destacarLinks: false,
  cursorGrande: false,
  navegacaoTeclado: false,
  leitorTela: false
};

// ============================================
// 🎨 ACESSIBILIDADE
// ============================================

/**
 * Inicializa todos os recursos de acessibilidade
 * - Controle de fonte
 * - Modos de contraste
 * - Recursos de leitura
 * - Navegação por teclado
 */
function inicializarAcessibilidade() {
  const btnAcessibilidade = document.getElementById("btnAcessibilidade");
  if (!btnAcessibilidade) return;

  const menuAcessibilidade = document.getElementById("menuAcessibilidade");
  const closeAcessibilidade = document.getElementById("closeAcessibilidade");

  // Carregar preferências salvas do localStorage
  carregarPreferenciasAcessibilidade();

  // Abrir/Fechar menu de acessibilidade
  btnAcessibilidade.addEventListener("click", () => {
    menuAcessibilidade.classList.toggle("hidden");
  });

  closeAcessibilidade?.addEventListener("click", () => {
    menuAcessibilidade.classList.add("hidden");
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!menuAcessibilidade.contains(e.target) && !btnAcessibilidade.contains(e.target)) {
      menuAcessibilidade.classList.add("hidden");
    }
  });

  // Configurar botões de tamanho de fonte
  configurarControlesFonte();
  
  // Configurar modos de contraste
  configurarModosContraste();
  
  // Configurar recursos de leitura
  configurarRecursosLeitura();
  
  // Configurar navegação e atalhos
  configurarNavegacao();
}

/**
 * Configura controles de tamanho de fonte (60% - 150%)
 */
function configurarControlesFonte() {
  const btnAumentar = document.getElementById("aumentarFonte");
  const btnDiminuir = document.getElementById("diminuirFonte");
  const btnReset = document.getElementById("resetarFonte");
  const fontSizeValue = document.getElementById("fontSizeValue");

  btnAumentar?.addEventListener("click", () => {
    if (tamanhoFonte < 150) {
      tamanhoFonte += 10;
      aplicarTamanhoFonte();
    }
  });

  btnDiminuir?.addEventListener("click", () => {
    if (tamanhoFonte > 60) {
      tamanhoFonte -= 10;
      aplicarTamanhoFonte();
    }
  });

  btnReset?.addEventListener("click", () => {
    tamanhoFonte = 100;
    aplicarTamanhoFonte();
  });

  function aplicarTamanhoFonte() {
    document.documentElement.style.fontSize = tamanhoFonte + "%";
    if (fontSizeValue) fontSizeValue.textContent = tamanhoFonte + "%";
    salvarPreferencia('fontSize', tamanhoFonte);
  }
}

/**
 * Configura modos de alto contraste e modo escuro
 * Os modos são mutuamente exclusivos
 */
function configurarModosContraste() {
  const btnContraste = document.getElementById("altoContraste");
  const btnEscuro = document.getElementById("contrasteEscuro");

  // Alto Contraste (preto/branco/amarelo)
  btnContraste?.addEventListener("click", () => {
    acessibilidadeAtiva.altoContraste = !acessibilidadeAtiva.altoContraste;
    document.body.classList.toggle("alto-contraste", acessibilidadeAtiva.altoContraste);
    btnContraste.classList.toggle("active", acessibilidadeAtiva.altoContraste);
    
    // Desativar modo escuro se ativo
    if (acessibilidadeAtiva.altoContraste && acessibilidadeAtiva.modoEscuro) {
      acessibilidadeAtiva.modoEscuro = false;
      document.body.classList.remove("modo-escuro");
      btnEscuro?.classList.remove("active");
    }
    
    salvarPreferencia('altoContraste', acessibilidadeAtiva.altoContraste);
  });

  // Modo Escuro
  btnEscuro?.addEventListener("click", () => {
    acessibilidadeAtiva.modoEscuro = !acessibilidadeAtiva.modoEscuro;
    document.body.classList.toggle("modo-escuro", acessibilidadeAtiva.modoEscuro);
    btnEscuro.classList.toggle("active", acessibilidadeAtiva.modoEscuro);
    
    // Desativar alto contraste se ativo
    if (acessibilidadeAtiva.modoEscuro && acessibilidadeAtiva.altoContraste) {
      acessibilidadeAtiva.altoContraste = false;
      document.body.classList.remove("alto-contraste");
      btnContraste?.classList.remove("active");
    }
    
    salvarPreferencia('modoEscuro', acessibilidadeAtiva.modoEscuro);
  });
}

/**
 * Configura recursos de leitura (leitor de tela, guia, destaque de links)
 */
function configurarRecursosLeitura() {
  const btnLeitor = document.getElementById("leitorTela");
  const btnGuia = document.getElementById("guiaLeitura");
  const btnLinks = document.getElementById("destacarLinks");

  // Leitor de Tela (Text-to-Speech)
  btnLeitor?.addEventListener("click", () => {
    acessibilidadeAtiva.leitorTela = !acessibilidadeAtiva.leitorTela;
    btnLeitor.classList.toggle("active", acessibilidadeAtiva.leitorTela);
    
    if (acessibilidadeAtiva.leitorTela) {
      ativarLeitorTela();
    } else {
      desativarLeitorTela();
    }
    
    salvarPreferencia('leitorTela', acessibilidadeAtiva.leitorTela);
  });

  // Guia de Leitura (linha horizontal)
  btnGuia?.addEventListener("click", () => {
    acessibilidadeAtiva.guiaLeitura = !acessibilidadeAtiva.guiaLeitura;
    btnGuia.classList.toggle("active", acessibilidadeAtiva.guiaLeitura);
    
    const guiaLine = document.getElementById('guiaLeituraLine');
    if (acessibilidadeAtiva.guiaLeitura) {
      guiaLine?.classList.remove('hidden');
      ativarGuiaLeitura();
    } else {
      guiaLine?.classList.add('hidden');
      desativarGuiaLeitura();
    }
    
    salvarPreferencia('guiaLeitura', acessibilidadeAtiva.guiaLeitura);
  });

  // Destacar Links
  btnLinks?.addEventListener("click", () => {
    acessibilidadeAtiva.destacarLinks = !acessibilidadeAtiva.destacarLinks;
    document.body.classList.toggle("destacar-links", acessibilidadeAtiva.destacarLinks);
    btnLinks.classList.toggle("active", acessibilidadeAtiva.destacarLinks);
    salvarPreferencia('destacarLinks', acessibilidadeAtiva.destacarLinks);
  });
}

/**
 * Configura navegação especial, VLibras e atalhos de teclado
 */
function configurarNavegacao() {
  const btnVlibras = document.getElementById("vlibras");
  const btnAtalhos = document.getElementById("atalhosTeclado");
  const btnCursor = document.getElementById("cursorGrande");
  const btnNavTeclado = document.getElementById("navegacaoTeclado");
  const btnResetAll = document.getElementById("resetarAcessibilidade");

  // VLibras (Libras/Língua de Sinais)
  btnVlibras?.addEventListener("click", () => {
    const vlibrasWidget = document.querySelector('[vw-access-button]');
    if (vlibrasWidget) vlibrasWidget.click();
  });

  // Modal de Atalhos de Teclado
  btnAtalhos?.addEventListener("click", () => {
    document.getElementById('modalAtalhos')?.classList.remove('hidden');
    document.getElementById('menuAcessibilidade')?.classList.add('hidden');
  });

  document.getElementById('closeAtalhos')?.addEventListener("click", () => {
    document.getElementById('modalAtalhos')?.classList.add('hidden');
  });

  // Cursor Grande
  btnCursor?.addEventListener("click", () => {
    acessibilidadeAtiva.cursorGrande = !acessibilidadeAtiva.cursorGrande;
    document.body.classList.toggle("cursor-grande", acessibilidadeAtiva.cursorGrande);
    btnCursor.classList.toggle("active", acessibilidadeAtiva.cursorGrande);
    salvarPreferencia('cursorGrande', acessibilidadeAtiva.cursorGrande);
  });

  // Navegação por Teclado (destaque de foco)
  btnNavTeclado?.addEventListener("click", () => {
    acessibilidadeAtiva.navegacaoTeclado = !acessibilidadeAtiva.navegacaoTeclado;
    document.body.classList.toggle("navegacao-teclado", acessibilidadeAtiva.navegacaoTeclado);
    btnNavTeclado.classList.toggle("active", acessibilidadeAtiva.navegacaoTeclado);
    salvarPreferencia('navegacaoTeclado', acessibilidadeAtiva.navegacaoTeclado);
  });

  // Reset de todas configurações
  btnResetAll?.addEventListener("click", () => {
    if (confirm('Deseja restaurar todas as configurações de acessibilidade para o padrão?')) {
      resetarTodasConfiguracoes();
    }
  });

  // Atalhos de Teclado Globais
  inicializarAtalhosTeclado();
}

// Funções auxiliares de acessibilidade

/**
 * Ativa leitor de tela (Text-to-Speech)
 * Lê texto ao passar mouse ou focar em elementos
 */
function ativarLeitorTela() {
  document.querySelectorAll('h1, h2, h3, p, button, a').forEach(el => {
    el.addEventListener('mouseenter', lerTexto);
    el.addEventListener('focus', lerTexto);
  });
  alert('Leitor de tela ativado! Passe o mouse sobre os elementos para ouvi-los.');
}

function desativarLeitorTela() {
  document.querySelectorAll('h1, h2, h3, p, button, a').forEach(el => {
    el.removeEventListener('mouseenter', lerTexto);
    el.removeEventListener('focus', lerTexto);
  });
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function lerTexto(e) {
  const texto = e.target.textContent || e.target.alt || e.target.title;
  if (!texto || !('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * Guia de leitura: linha horizontal que segue o mouse
 */
let guiaMovimentoListener;
function ativarGuiaLeitura() {
  const guiaLine = document.getElementById('guiaLeituraLine');
  guiaMovimentoListener = (e) => {
    if (guiaLine) guiaLine.style.top = e.clientY + 'px';
  };
  document.addEventListener('mousemove', guiaMovimentoListener);
}

function desativarGuiaLeitura() {
  if (guiaMovimentoListener) {
    document.removeEventListener('mousemove', guiaMovimentoListener);
  }
}

/**
 * Configura atalhos de teclado globais
 * Alt + A: Menu acessibilidade
 * Alt + W/S: Aumentar/Diminuir fonte
 * Alt + Q: Resetar fonte
 * Alt + B: Alto contraste
 * Alt + L: VLibras
 */
function inicializarAtalhosTeclado() {
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;
    
    const atalhos = {
      'a': () => document.getElementById('btnAcessibilidade')?.click(),
      'w': () => document.getElementById('aumentarFonte')?.click(),
      's': () => document.getElementById('diminuirFonte')?.click(),
      'q': () => document.getElementById('resetarFonte')?.click(),
      'b': () => document.getElementById('altoContraste')?.click(),
      'l': () => document.getElementById('vlibras')?.click(),
      'c': () => document.querySelector('.footer-nav')?.focus(),
      'n': () => document.querySelector('.content')?.focus()
    };
    
    if (atalhos[e.key]) {
      e.preventDefault();
      atalhos[e.key]();
    }
  });
}

/**
 * Salva preferência no localStorage
 */
function salvarPreferencia(chave, valor) {
  localStorage.setItem(`acessibilidade_${chave}`, JSON.stringify(valor));
}

/**
 * Carrega preferências salvas do localStorage
 */
function carregarPreferenciasAcessibilidade() {
  // Carregar tamanho de fonte
  const fontSize = localStorage.getItem('acessibilidade_fontSize');
  if (fontSize) {
    tamanhoFonte = JSON.parse(fontSize);
    document.documentElement.style.fontSize = tamanhoFonte + "%";
    const fontSizeValue = document.getElementById("fontSizeValue");
    if (fontSizeValue) fontSizeValue.textContent = tamanhoFonte + "%";
  }
  
  // Carregar outras preferências
  const preferencias = ['altoContraste', 'modoEscuro', 'destacarLinks', 'cursorGrande', 'navegacaoTeclado'];
  
  preferencias.forEach(pref => {
    const valor = localStorage.getItem(`acessibilidade_${pref}`);
    if (valor === 'true') {
      acessibilidadeAtiva[pref] = true;
      const className = pref.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.body.classList.add(className);
      const btnId = pref.replace(/([A-Z])/g, '-$1').toLowerCase();
      const btn = document.getElementById(btnId);
      if (btn) btn.classList.add('active');
    }
  });
}

/**
 * Reseta todas configurações de acessibilidade
 */
function resetarTodasConfiguracoes() {
  // Resetar fonte
  tamanhoFonte = 100;
  document.documentElement.style.fontSize = "100%";
  const fontSizeValue = document.getElementById("fontSizeValue");
  if (fontSizeValue) fontSizeValue.textContent = "100%";
  
  // Remover classes
  document.body.className = '';
  
  // Resetar estado
  Object.keys(acessibilidadeAtiva).forEach(key => {
    acessibilidadeAtiva[key] = false;
  });
  
  // Desativar recursos ativos
  document.querySelectorAll('.btn-accessibility.active').forEach(btn => btn.classList.remove('active'));
  desativarGuiaLeitura();
  document.getElementById('guiaLeituraLine')?.classList.add('hidden');
  desativarLeitorTela();
  
  // Limpar localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('acessibilidade_')) {
      localStorage.removeItem(key);
    }
  });
  
  alert('Configurações restauradas!');
}

// ============================================
// 🔐 AUTENTICAÇÃO
// ============================================

/**
 * Verifica se usuário está logado
 * Redireciona para login se não estiver
 */
function verificarAutenticacao() {
  console.log('🔐 Verificando autenticação...');
  if (!estaLogado()) {
    console.log('❌ Usuário não está logado, redirecionando para login');
    window.location.href = 'login.html';
  } else {
    console.log('✅ Usuário autenticado');
  }
}

/**
 * Carrega e exibe informações do perfil do usuário
 */
async function carregarPerfil() {
  console.log('🔄 INICIANDO carregarPerfil()');
  
  try {
    let usuario = obterUsuarioLogado();
    console.log('📍 Usuario do localStorage:', usuario);
    
    // Se não houver usuário no localStorage, buscar do servidor
    if (!usuario || !usuario.nome) {
      console.log('⚠️ Dados incompletos no localStorage, buscando do servidor...');
      
      if (!usuario || !usuario.id) {
        console.log('❌ Nenhum usuário logado - sem ID');
        window.location.href = 'login.html';
        return;
      }
      
      try {
        // Buscar o usuário ESPECÍFICO pelo ID
        const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
        if (!response.ok) {
          throw new Error('Usuário não encontrado no servidor');
        }
        usuario = await response.json();
        console.log('✅ Usuário obtido do servidor:', usuario);
        
        // Atualizar localStorage com dados completos
        const sessao = {
          ...usuario,
          timestamp: Date.now(),
          expiresIn: 24 * 60 * 60 * 1000
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(sessao));
        console.log('💾 Dados salvos no localStorage');
      } catch (erro) {
        console.error('❌ Erro ao buscar usuário do servidor:', erro);
        window.location.href = 'login.html';
        return;
      }
    }
    
    if (!usuario) {
      console.log('❌ Nenhum usuário logado');
      window.location.href = 'login.html';
      return;
    }

    console.log('✅ Usuário logado:', {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      admin: usuario.admin,
      dataCadastro: usuario.dataCadastro
    });

    // Atualizar elementos do cabeçalho do perfil
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    
    console.log('🔍 Elementos do cabeçalho:', {
      profileName: profileName ? 'encontrado' : 'NÃO encontrado',
      profileEmail: profileEmail ? 'encontrado' : 'NÃO encontrado',
      profileAvatar: profileAvatar ? 'encontrado' : 'NÃO encontrado'
    });
    
    if (profileName) {
      profileName.textContent = usuario.nome || 'Usuário';
      console.log('✅ profileName atualizado para:', usuario.nome);
    }
    
    if (profileEmail) {
      profileEmail.textContent = usuario.email || 'Email não informado';
      console.log('✅ profileEmail atualizado para:', usuario.email);
    }

    // Adicionar inicial do nome no avatar
    if (profileAvatar) {
      const inicial = (usuario.nome || 'U').charAt(0).toUpperCase();
      profileAvatar.innerHTML = `<div style="font-size: 2.5rem; font-weight: 700; color: white;">${inicial}</div>`;
      console.log('✅ Avatar atualizado com inicial:', inicial);
    }

    // Atualizar card de informações do perfil
    const infoNome = document.getElementById('profileInfoNome');
    const infoEmail = document.getElementById('profileInfoEmail');
    const infoData = document.getElementById('profileInfoData');
    const infoTipo = document.getElementById('profileInfoTipo');
    
    console.log('🔍 Elementos de info encontrados:', {
      infoNome: infoNome ? 'encontrado' : 'NÃO encontrado',
      infoEmail: infoEmail ? 'encontrado' : 'NÃO encontrado',
      infoData: infoData ? 'encontrado' : 'NÃO encontrado',
      infoTipo: infoTipo ? 'encontrado' : 'NÃO encontrado'
    });
    
    // Atualizar nome
    if (infoNome) {
      infoNome.textContent = usuario.nome || 'Não informado';
      console.log('✅ Nome atualizado:', usuario.nome);
    }
    
    // Atualizar email
    if (infoEmail) {
      infoEmail.textContent = usuario.email || 'Não informado';
      console.log('✅ Email atualizado:', usuario.email);
    }
    
    // Atualizar data de cadastro
    if (infoData && usuario.dataCadastro) {
      const data = new Date(usuario.dataCadastro);
      const dataFormatada = data.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      infoData.textContent = dataFormatada;
      console.log('✅ Data atualizada:', dataFormatada);
    } else if (infoData) {
      infoData.textContent = 'Não informado';
    }
    
    // Atualizar tipo de conta
    if (infoTipo) {
      const tipoTexto = usuario.admin ? '👑 Administrador' : '👤 Usuário';
      infoTipo.textContent = tipoTexto;
      if (usuario.admin) {
        infoTipo.style.color = '#667eea';
        infoTipo.style.fontWeight = '600';
      }
      console.log('✅ Tipo de conta atualizado:', tipoTexto);
    }

    // Mostrar opções de admin se for administrador
    if (usuario.admin) {
      const btnAdmin = document.getElementById('btnPainelAdmin');
      if (btnAdmin) {
        btnAdmin.style.display = 'flex';
        console.log('✅ Painel admin visível');
      }
    }
    
    console.log('✅✅✅ PERFIL CARREGADO COM SUCESSO ✅✅✅');
  } catch (error) {
    console.error('❌ ERRO ao carregar perfil:', error);
    console.error('Stack:', error.stack);
  }
}

/**
 * Inicializa eventos do perfil
 */
function inicializarPerfil() {
  // Botão painel administrativo
  const btnPainelAdmin = document.getElementById('btnPainelAdmin');
  if (btnPainelAdmin) {
    btnPainelAdmin.addEventListener('click', () => {
      const usuario = obterUsuarioLogado();
      
      // Verificar se é admin
      if (!usuario || !usuario.admin) {
        console.log('❌ Acesso negado: usuário não é admin');
        alert('❌ Acesso negado! Apenas administradores podem acessar o painel.');
        return;
      }
      
      // Permitir acesso ao painel admin
      console.log('✅ Acessando painel administrativo...');
      window.location.href = 'admin.html';
    });
  }
  
  // Botão sair
  const btnSair = document.querySelector('[data-action="sair"]');
  btnSair?.addEventListener('click', () => {
    if (confirm('Deseja realmente sair?')) {
      fazerLogout();
    }
  });
  
  // Botão editar perfil (primeiro menu-item sem data-action)
  const menuItems = document.querySelectorAll('.menu-item');
  if (menuItems.length > 0) {
    const btnEditar = menuItems[0];
    btnEditar.addEventListener('click', () => {
      alert('Funcionalidade de editar perfil em desenvolvimento!');
    });
  }
}

/**
 * Faz logout do usuário
 */
function fazerLogout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

// ============================================
// 🐕 PETS
// ============================================

/**
 * Carrega e exibe lista de pets disponíveis
 */
async function carregarPets() {
  try {
    const pets = await listarPets();
    const container = document.getElementById('listaPets');
    
    if (!container) return;
    
    if (!pets || pets.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #6b7280;">Nenhum pet disponível no momento.</p>';
      return;
    }

    container.innerHTML = pets.map(pet => criarCardPet(pet)).join('');
    
    // Adicionar eventos de clique
    document.querySelectorAll('.pet-card.clickable').forEach(card => {
      card.addEventListener('click', () => {
        const petId = parseInt(card.dataset.petId);
        const pet = pets.find(p => p.id === petId);
        if (pet) mostrarDetalhesPet(pet);
      });
    });
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    const container = document.getElementById('listaPets');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #ef4444;">Erro ao carregar pets. Tente novamente.</p>';
    }
  }
}

/**
 * Cria HTML de um card de pet
 */
function criarCardPet(pet) {
  const tipo = pet.tipo?.toLowerCase() || '';
  const icone = tipo === 'cachorro' ? '🐶' : tipo === 'gato' ? '🐱' : '🐾';
  const imagemHtml = pet.imagem 
    ? `<img src="${pet.imagem}" alt="${pet.nome}">`
    : icone;

  return `
    <div class="pet-card clickable" data-pet-id="${pet.id}">
      <div class="pet-avatar">${imagemHtml}</div>
      <div class="pet-info">
        <div class="pet-name">${pet.nome}</div>
        <div class="pet-details">
          <span> ${pet.local || 'Não informado'}</span>
          <span>- ${pet.idade || 'Não informado'} Anos</span>
        </div>
        <span class="pet-badge">${pet.tipo}</span>
      </div>
      <div class="pet-arrow">›</div>
    </div>
  `;
}

/**
 * Mostra modal com detalhes completos do pet
 */
function mostrarDetalhesPet(pet) {
  const modal = document.getElementById('modalPetDetails');
  if (!modal) return;

  const tipo = pet.tipo?.toLowerCase() || '';
  const icone = tipo === 'cachorro' ? '🐶' : tipo === 'gato' ? '🐱' : '🐾';
  const content = document.getElementById('petDetailsContent');
  
  content.innerHTML = `
      <div class="pet-details-header">
        ${pet.imagem ? `<img src="${pet.imagem}" alt="${pet.nome}" class="pet-details-image">` : `<div style="font-size: 100px;">${icone}</div>`}
        <h2>${pet.nome}</h2>
        <span class="pet-details-badge">Disponível para adoção</span>
      </div>
      
      <div class="pet-details-info">
        <div class="info-item">
          <i class="fas fa-paw"></i>
          <div><strong>Tipo</strong><span>${pet.tipo}</span></div>
        </div>
        <div class="info-item">
          <i class="fas fa-birthday-cake"></i>
          <div><strong>Idade</strong><span>${pet.idade || 'Não informado'}</span></div>
        </div>
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <div><strong>Local</strong><span>${pet.local || 'Não informado'}</span></div>
        </div>
        ${pet.raca ? `<div class="info-item"><i class="fas fa-dog"></i><div><strong>Raça</strong><span>${pet.raca}</span></div></div>` : ''}
        ${pet.contato ? `<div class="info-item"><i class="fas fa-phone"></i><div><strong>Contato</strong><span>${pet.contato}</span></div></div>` : ''}
      </div>

      ${pet.descricao ? `
        <div class="pet-details-description">
          <h4><i class="fas fa-info-circle"></i> Sobre ${pet.nome}</h4>
          <p>${pet.descricao}</p>
        </div>
      ` : ''}

      <div class="pet-details-actions">
        <button class="btn-adopt" onclick="iniciarAdocao(${pet.id}, '${pet.nome}')">
          <i class="fas fa-heart"></i> Adotar
        </button>
        <button class="btn-share" onclick="compartilharPet('${pet.nome}')">
          <i class="fas fa-share-alt"></i> Compartilhar
        </button>
      </div>
  `;
  
  modal.classList.remove('hidden');
}

/**
 * Inicia processo de adoção de um pet
 */
function iniciarAdocao(petId, petNome) {
  fecharModal('modalPetDetails');
  
  const modal = document.getElementById('modalAdoption');
  if (!modal) return;
  
  document.getElementById('adoptionPetName').value = petNome;
  document.getElementById('adoptionPetId').value = petId;
  modal.classList.remove('hidden');
}

/**
 * Compartilha informações do pet
 */
function compartilharPet(nomePet) {
  if (navigator.share) {
    navigator.share({
      title: `Adote ${nomePet}`,
      text: `Conheça ${nomePet}, disponível para adoção na Unipet!`,
      url: window.location.href
    }).catch(() => {});
  } else {
    alert(`Compartilhe: Adote ${nomePet} na Unipet!`);
  }
}

// ============================================
// ➕ ADICIONAR PET (Admin)
// ============================================

/**
 * Inicializa formulário de adicionar pet
 */
function inicializarFormularioPet() {
  const form = document.getElementById('formAddPetProfile');
  if (!form) return;

  // Preview de imagem
  const inputImagem = document.getElementById('petImage');
  const preview = document.getElementById('imagePreview');
  
  inputImagem?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      nome: document.getElementById('petTag').value.trim(),
      tipo: document.getElementById('petTipo').value,
      idade: document.getElementById('petIdade')?.value.trim() || null,
      raca: document.getElementById('petRaca')?.value.trim() || null,
      local: document.getElementById('petLocal')?.value.trim() || null,
      contato: document.getElementById('petContato')?.value.trim() || null,
      descricao: document.getElementById('petDescricao')?.value.trim() || null,
      imagem: null
    };

    // Converter imagem para base64 se houver
    const file = inputImagem?.files[0];
    if (file) {
      formData.imagem = await converterImagemParaBase64(file);
    }

    try {
      await adicionarPet(formData);
      alert('Pet adicionado com sucesso!');
      form.reset();
      preview.innerHTML = '';
      fecharModal('modalAddPetProfile');
      carregarPets(); // Recarregar lista
    } catch (error) {
      alert('Erro ao adicionar pet: ' + error.message);
    }
  });
}

/**
 * Converte arquivo de imagem para base64
 */
function converterImagemParaBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// ❤️ ADOÇÕES
// ============================================

/**
 * Inicializa formulário de adoção
 */
function inicializarFormularioAdocao() {
  const form = document.getElementById('formAdocao');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const termos = document.getElementById('aceitoTermos');
    if (!termos.checked) {
      alert('Você precisa aceitar os termos de adoção.');
      return;
    }

    const adocao = {
      petId: parseInt(document.getElementById('adocaoPetId').value),
      petName: document.getElementById('adocaoPetNome').value,
      adotante: {
        nome: document.getElementById('adotanteNome').value.trim(),
        email: document.getElementById('adotanteEmail').value.trim(),
        telefone: document.getElementById('adotanteTelefone').value.trim(),
        endereco: document.getElementById('adotanteEndereco').value.trim(),
        motivacao: document.getElementById('adotanteMotivacao').value.trim()
      }
    };

    try {
      await criarAdocao(adocao);
      alert('Solicitação de adoção enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
      fecharModal('modalFormularioAdocao');
    } catch (error) {
      alert('Erro ao enviar solicitação: ' + error.message);
    }
  });
}

// ============================================
// 💰 DOAÇÕES
// ============================================

/**
 * Inicializa botões de doação
 * Captura cliques nos botões "Doar Agora" e abre modal com formulário
 */
/**
 * Carrega e exibe lista de doações realizadas
 */
async function carregarDoacoes() {
  try {
    const doacoes = await listarDoacoes();
    const container = document.getElementById('listaDoacoes');
    
    if (!container) return;
    
    if (!doacoes || doacoes.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Nenhuma doação registrada ainda. Seja o primeiro a doar!</p>';
      return;
    }

    container.innerHTML = doacoes.map(doacao => criarCardDoacao(doacao)).join('');
  } catch (error) {
    console.error('Erro ao carregar doações:', error);
    const container = document.getElementById('listaDoacoes');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #ef4444;">Erro ao carregar doações. Tente novamente.</p>';
    }
  }
}

/**
 * Cria HTML de um card de doação
 */
function criarCardDoacao(doacao) {
  const icones = {
    'racao': 'fa-bowl-food',
    'remedio': 'fa-pills',
    'acessorios': 'fa-paw',
    'dinheiro': 'fa-dollar-sign'
  };
  
  const icone = icones[doacao.tipo?.toLowerCase()] || 'fa-gift';
  const tipoLabel = doacao.tipo?.charAt(0).toUpperCase() + doacao.tipo?.slice(1) || 'Doação';
  
  // Extrair quantidade em kg se houver
  let quantidadeInfo = '';
  if (doacao.quantidade) {
    quantidadeInfo = `<div class="donation-quantity">🎯 ${doacao.quantidade}</div>`;
  }
  
  // Nome do doador
  const nomeDoador = doacao.doador?.nome || doacao.nome || 'Anônimo';
  
  // Data da doação
  const data = doacao.dataCadastro ? new Date(doacao.dataCadastro).toLocaleDateString('pt-BR') : '';
  
  return `
    <div class="donation-item">
      <div class="donation-item-icon">
        <i class="fa-solid ${icone}"></i>
      </div>
      <div class="donation-item-info">
        <div class="donation-item-header">
          <strong>${nomeDoador}</strong>
          <span class="donation-item-type">${tipoLabel}</span>
        </div>
        ${quantidadeInfo}
        ${doacao.marca ? `<div class="donation-detail">🏷️ ${doacao.marca}</div>` : ''}
        ${doacao.animalTipo ? `<div class="donation-detail">🐾 Para: ${doacao.animalTipo}</div>` : ''}
        ${data ? `<div class="donation-date">📅 ${data}</div>` : ''}
      </div>
    </div>
  `;
}

function inicializarDoacoes() {
  document.querySelectorAll('.btn-donate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.donation-card');
      const tipo = card?.dataset.type || 'dinheiro';
      abrirFormularioDoacao(tipo);
    });
  });
}

/**
 * Abre formulário de doação com tipo específico
 */
function abrirFormularioDoacao(tipo) {
  const modal = document.getElementById('modalDonation');
  if (!modal) return;

  const tipoInput = document.getElementById('donationType');
  if (tipoInput) {
    const tipos = {
      'racao': 'Ração',
      'remedio': 'Remédio',
      'acessorios': 'Acessórios',
      'dinheiro': 'Doação Financeira'
    };
    tipoInput.value = tipos[tipo] || tipo;
  }
  
  // Esconder todos campos específicos
  document.querySelectorAll('.campos-especificos').forEach(campo => {
    campo.classList.add('hidden');
  });
  
  // Mostrar campos específicos do tipo selecionado
  const campoEspecifico = document.getElementById(`campos${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
  if (campoEspecifico) {
    campoEspecifico.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
}

/**
 * Inicializa formulário de doação
 */
function inicializarFormularioDoacao() {
  const form = document.getElementById('formDonation');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tipoInput = document.getElementById('donationType')?.value || '';
    const tipoMap = {
      'Ração': 'racao',
      'Remédio': 'remedio',
      'Acessórios': 'acessorios',
      'Doação Financeira': 'dinheiro'
    };
    const tipo = tipoMap[tipoInput] || tipoInput.toLowerCase();

    // Dados base da doação
    const doacao = {
      tipo: tipo,
      nome: document.getElementById('doadorNome')?.value.trim() || 'Anônimo',
      doador: {
        nome: document.getElementById('doadorNome')?.value.trim() || 'Anônimo',
        email: document.getElementById('doadorEmail')?.value.trim() || '',
        telefone: document.getElementById('doadorTelefone')?.value.trim() || ''
      }
    };

    // Adicionar campos específicos baseado no tipo
    if (tipo === 'racao') {
      doacao.marca = document.getElementById('racaoNome')?.value.trim() || '';
      doacao.animalTipo = document.getElementById('racaoTipo')?.value || '';
      doacao.quantidade = document.getElementById('racaoQuantidade')?.value.trim() || '';
      doacao.validade = document.getElementById('racaoValidade')?.value || '';
    } else if (tipo === 'remedio') {
      doacao.marca = document.getElementById('remedioNome')?.value.trim() || '';
      doacao.tipoRemedio = document.getElementById('remedioTipo')?.value.trim() || '';
      doacao.quantidade = document.getElementById('remedioQuantidade')?.value.trim() || '';
      doacao.validade = document.getElementById('remedioValidade')?.value || '';
    } else if (tipo === 'acessorios') {
      doacao.tipoAcessorio = document.getElementById('acessorioTipo')?.value || '';
      doacao.descricao = document.getElementById('acessorioDescricao')?.value.trim() || '';
      doacao.quantidade = document.getElementById('acessorioQuantidade')?.value.trim() || '';
      doacao.condicao = document.getElementById('acessorioCondicao')?.value || '';
    } else if (tipo === 'dinheiro') {
      doacao.valor = document.getElementById('dinheiroValor')?.value.trim() || '';
      doacao.quantidade = document.getElementById('dinheiroValor')?.value.trim() || '';
      doacao.formaPagamento = document.getElementById('dinheiroPagamento')?.value || '';
    }

    try {
      await criarDoacao(doacao);
      alert('❤️ Doação registrada com sucesso! Obrigado pela sua generosidade!');
      form.reset();
      document.getElementById('modalDonation')?.classList.add('hidden');
      carregarDoacoes(); // Recarregar lista
    } catch (error) {
      alert('Erro ao registrar doação: ' + error.message);
    }
  });
}

// ============================================
// 🔧 NAVEGAÇÃO E MODAIS
// ============================================

/**
 * Inicializa navegação do menu inferior
 * Gerencia a troca entre as páginas: home, pets, donations, profile
 */
function inicializarNavegacao() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pagina = item.dataset.page;
      if (pagina) {
        mostrarPagina(pagina);
      }
    });
  });
}

/**
 * Mostra/esconde páginas dentro do index.html
 * Atualiza a classe active no menu de navegação
 */
function mostrarPagina(nomePagina) {
  console.log(`📝 Mostrando página: ${nomePagina}`);
  
  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
  
  // Mostrar a página selecionada
  const paginaSelecionada = document.getElementById(`page-${nomePagina}`);
  if (paginaSelecionada) {
    paginaSelecionada.classList.remove('hidden');
    console.log(`✅ Página ${nomePagina} exibida`);
  } else {
    console.error(`❌ Página page-${nomePagina} não encontrada no DOM`);
  }
  
  // Atualizar menu ativo
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  const navAtivo = document.querySelector(`[data-page="${nomePagina}"]`);
  if (navAtivo) {
    navAtivo.classList.add('active');
  }
  
  // Carregar conteúdo específico da página
  if (nomePagina === 'pets') {
    console.log('🐾 Carregando pets...');
    carregarPets();
  } else if (nomePagina === 'profile') {
    console.log('👤 Carregando perfil...');
    // Pequeno delay para garantir que os elementos DOM estejam prontos
    setTimeout(() => {
      console.log('⏳ Executando carregarPerfil após delay...');
      carregarPerfil();
    }, 100);
  } else if (nomePagina === 'donations') {
    console.log('💝 Carregando doações...');
    carregarDoacoes();
  }
}

/**
 * Fecha modal pelo ID
 */
function fecharModal(modalId) {
  document.getElementById(modalId)?.classList.add('hidden');
}

/**
 * Configura todos os botões de fechar modal
 */
function inicializarModais() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal')?.classList.add('hidden');
    });
  });

  // Fechar ao clicar fora do modal
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
  
  // Botão adicionar pet na página de pets
  const btnAddPet = document.getElementById('btnAddPet');
  btnAddPet?.addEventListener('click', () => {
    document.getElementById('modalAddPetProfile')?.classList.remove('hidden');
  });
  
  // Botão adicionar pet no perfil
  const btnAddPetProfile = document.getElementById('btnAddPetProfile');
  btnAddPetProfile?.addEventListener('click', () => {
    document.getElementById('modalAddPetProfile')?.classList.remove('hidden');
  });
}

// ============================================
// 🚀 INICIALIZAÇÃO
// ============================================

/**
 * Inicializa aplicação quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🐾 Unipet inicializado');
  
  // Inicializar acessibilidade em todas as páginas
  inicializarAcessibilidade();
  
  // Detectar página atual
  const paginaAtual = window.location.pathname;
  
  // Página index.html (principal)
  if (paginaAtual.includes('index.html') || paginaAtual.endsWith('/') || paginaAtual.includes('/pages/')) {
    verificarAutenticacao();
    inicializarNavegacao();
    inicializarModais();
    inicializarPerfil();
    inicializarFormularioPet();
    inicializarFormularioAdocao();
    inicializarDoacoes();
    inicializarFormularioDoacao();
    
    // NÃO carregar perfil aqui - será carregado quando o usuário clicar na aba Perfil
    
    // Mostrar página inicial (home)
    mostrarPagina('home');
  }
});
