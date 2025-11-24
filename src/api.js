// 🐾 Unipet API Client - Comunicação com Backend Express.js
// Base URL da API
const API_URL = 'http://localhost:3000';

// ============================================
// 👥 ROTAS DE USUÁRIOS
// ============================================

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário autenticado
 */
async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }

        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

/**
 * Cadastra novo usuário
 * @param {Object} usuario - Dados do usuário (nome, email, senha)
 * @returns {Promise<Object>} Usuário cadastrado
 */
async function cadastrarUsuario(usuario) {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao cadastrar usuário');
        }

        return data;
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
    }
}

/**
 * Lista todos os usuários
 * @returns {Promise<Array>} Lista de usuários
 */
async function listarUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao listar usuários');
        }

        return data.usuarios;
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}

/**
 * Busca usuário por ID
 * @param {number} id - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
async function buscarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar usuário');
        }

        return data.usuario;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

/**
 * Atualiza dados do usuário
 * @param {number} id - ID do usuário
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Usuário atualizado
 */
async function atualizarUsuario(id, dados) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar usuário');
        }

        return data.usuario;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

/**
 * Deleta usuário
 * @param {number} id - ID do usuário
 * @returns {Promise<Object>} Confirmação da exclusão
 */
async function deletarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao deletar usuário');
        }

        return data;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
}

// ============================================
// 🐾 ROTAS DE PETS
// ============================================

/**
 * Lista todos os pets (com filtros opcionais)
 * @param {Object} filtros - Filtros opcionais (tipo, idade, local, disponivel)
 * @returns {Promise<Array>} Lista de pets
 */
async function listarPets(filtros = {}) {
    try {
        const params = new URLSearchParams();
        
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        if (filtros.idade) params.append('idade', filtros.idade);
        if (filtros.local) params.append('local', filtros.local);
        if (filtros.disponivel !== undefined) params.append('disponivel', filtros.disponivel);

        const url = `${API_URL}/pets${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao listar pets');
        }

        return data;
    } catch (error) {
        console.error('Erro ao listar pets:', error);
        throw error;
    }
}

/**
 * Busca pet por ID
 * @param {number} id - ID do pet
 * @returns {Promise<Object>} Dados do pet
 */
async function buscarPet(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar pet');
        }

        return data.pet;
    } catch (error) {
        console.error('Erro ao buscar pet:', error);
        throw error;
    }
}

/**
 * Adiciona novo pet
 * @param {Object} pet - Dados do pet
 * @returns {Promise<Object>} Pet cadastrado
 */
async function adicionarPet(pet) {
    try {
        const response = await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao adicionar pet');
        }

        return data.pet;
    } catch (error) {
        console.error('Erro ao adicionar pet:', error);
        throw error;
    }
}

/**
 * Atualiza dados do pet
 * @param {number} id - ID do pet
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Pet atualizado
 */
async function atualizarPet(id, dados) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar pet');
        }

        return data.pet;
    } catch (error) {
        console.error('Erro ao atualizar pet:', error);
        throw error;
    }
}

/**
 * Deleta pet
 * @param {number} id - ID do pet
 * @returns {Promise<Object>} Confirmação da exclusão
 */
async function deletarPet(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao deletar pet');
        }

        return data;
    } catch (error) {
        console.error('Erro ao deletar pet:', error);
        throw error;
    }
}

// ============================================
// 💚 ROTAS DE ADOÇÕES
// ============================================

/**
 * Lista adoções (com filtros opcionais)
 * @param {Object} filtros - Filtros opcionais (status, usuarioId, petId)
 * @returns {Promise<Array>} Lista de adoções
 */
async function listarAdocoes(filtros = {}) {
    try {
        const params = new URLSearchParams();
        
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
        if (filtros.petId) params.append('petId', filtros.petId);

        const url = `${API_URL}/adocoes${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao listar adoções');
        }

        return data;
    } catch (error) {
        console.error('Erro ao listar adoções:', error);
        throw error;
    }
}

/**
 * Busca adoção por ID
 * @param {number} id - ID da adoção
 * @returns {Promise<Object>} Dados da adoção
 */
async function buscarAdocao(id) {
    try {
        const response = await fetch(`${API_URL}/adocoes/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar adoção');
        }

        return data.adocao;
    } catch (error) {
        console.error('Erro ao buscar adoção:', error);
        throw error;
    }
}

/**
 * Cria solicitação de adoção
 * @param {Object} adocao - Dados da adoção
 * @returns {Promise<Object>} Adoção criada
 */
async function criarAdocao(adocao) {
    try {
        const response = await fetch(`${API_URL}/adocoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adocao)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar adoção');
        }

        return data.adocao;
    } catch (error) {
        console.error('Erro ao criar adoção:', error);
        throw error;
    }
}

/**
 * Atualiza status da adoção (aprovar/rejeitar)
 * @param {number} id - ID da adoção
 * @param {Object} dados - Dados a atualizar (status, observacoes)
 * @returns {Promise<Object>} Adoção atualizada
 */
async function atualizarAdocao(id, dados) {
    try {
        const response = await fetch(`${API_URL}/adocoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar adoção');
        }

        return data.adocao;
    } catch (error) {
        console.error('Erro ao atualizar adoção:', error);
        throw error;
    }
}

/**
 * Cancela/deleta adoção
 * @param {number} id - ID da adoção
 * @returns {Promise<Object>} Confirmação da exclusão
 */
async function deletarAdocao(id) {
    try {
        const response = await fetch(`${API_URL}/adocoes/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao deletar adoção');
        }

        return data;
    } catch (error) {
        console.error('Erro ao deletar adoção:', error);
        throw error;
    }
}

// ============================================
// ❤️ ROTAS DE DOAÇÕES
// ============================================

/**
 * Lista doações (com filtro opcional)
 * @param {Object} filtros - Filtros opcionais (tipo)
 * @returns {Promise<Array>} Lista de doações
 */
async function listarDoacoes(filtros = {}) {
    try {
        const params = new URLSearchParams();
        
        if (filtros.tipo) params.append('tipo', filtros.tipo);

        const url = `${API_URL}/doacoes${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao listar doações');
        }

        return data;
    } catch (error) {
        console.error('Erro ao listar doações:', error);
        throw error;
    }
}

/**
 * Busca doação por ID
 * @param {number} id - ID da doação
 * @returns {Promise<Object>} Dados da doação
 */
async function buscarDoacao(id) {
    try {
        const response = await fetch(`${API_URL}/doacoes/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar doação');
        }

        return data.doacao;
    } catch (error) {
        console.error('Erro ao buscar doação:', error);
        throw error;
    }
}

/**
 * Registra nova doação
 * @param {Object} doacao - Dados da doação
 * @returns {Promise<Object>} Doação criada
 */
async function criarDoacao(doacao) {
    try {
        const response = await fetch(`${API_URL}/doacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doacao)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar doação');
        }

        return data.doacao;
    } catch (error) {
        console.error('Erro ao criar doação:', error);
        throw error;
    }
}

/**
 * Atualiza doação
 * @param {number} id - ID da doação
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Doação atualizada
 */
async function atualizarDoacao(id, dados) {
    try {
        const response = await fetch(`${API_URL}/doacoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao atualizar doação');
        }

        return data.doacao;
    } catch (error) {
        console.error('Erro ao atualizar doação:', error);
        throw error;
    }
}

/**
 * Deleta doação
 * @param {number} id - ID da doação
 * @returns {Promise<Object>} Confirmação da exclusão
 */
async function deletarDoacao(id) {
    try {
        const response = await fetch(`${API_URL}/doacoes/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao deletar doação');
        }

        return data;
    } catch (error) {
        console.error('Erro ao deletar doação:', error);
        throw error;
    }
}

// ============================================
// 📊 ROTAS UTILITÁRIAS
// ============================================

/**
 * Retorna estatísticas gerais do sistema
 * @returns {Promise<Object>} Estatísticas
 */
async function obterEstatisticas() {
    try {
        const response = await fetch(`${API_URL}/estatisticas`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao obter estatísticas');
        }

        return data.estatisticas;
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        throw error;
    }
}

/**
 * Verifica status do servidor (health check)
 * @returns {Promise<Object>} Status do servidor
 */
async function verificarServidor() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao verificar servidor');
        }

        return data;
    } catch (error) {
        console.error('Erro ao verificar servidor:', error);
        throw error;
    }
}

// ============================================
// 🔧 FUNÇÕES AUXILIARES
// ============================================

/**
 * Salva usuário no localStorage
 * @param {Object} usuario - Dados do usuário
 */
function salvarUsuarioLogado(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

/**
 * Obtém usuário do localStorage
 * @returns {Object|null} Usuário logado ou null
 */
function obterUsuarioLogado() {
    const usuario = localStorage.getItem('usuarioLogado');
    return usuario ? JSON.parse(usuario) : null;
}

/**
 * Remove usuário do localStorage (logout)
 */
function removerUsuarioLogado() {
    localStorage.removeItem('usuarioLogado');
}

/**
 * Verifica se usuário está logado
 * @returns {boolean} True se logado
 */
function estaLogado() {
    return obterUsuarioLogado() !== null;
}

/**
 * Verifica se usuário é admin
 * @returns {boolean} True se admin
 */
function eAdmin() {
    const usuario = obterUsuarioLogado();
    return usuario && usuario.admin === true;
}

/**
 * Redireciona para login se não estiver logado
 */
function requerLogin() {
    if (!estaLogado()) {
        window.location.href = 'login.html';
    }
}

/**
 * Redireciona para login se não for admin
 */
function requerAdmin() {
    if (!eAdmin()) {
        alert('Acesso negado! Apenas administradores podem acessar esta página.');
        window.location.href = 'index.html';
    }
}

/**
 * Formata data para padrão brasileiro
 * @param {string} data - Data ISO
 * @returns {string} Data formatada
 */
function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
}

/**
 * Formata valor monetário
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado
 */
function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// ============================================
// 🌐 EXPORTAR FUNÇÕES
// ============================================

// Para uso em módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Usuários
        login,
        cadastrarUsuario,
        listarUsuarios,
        buscarUsuario,
        atualizarUsuario,
        deletarUsuario,
        
        // Pets
        listarPets,
        buscarPet,
        adicionarPet,
        atualizarPet,
        deletarPet,
        
        // Adoções
        listarAdocoes,
        buscarAdocao,
        criarAdocao,
        atualizarAdocao,
        deletarAdocao,
        
        // Doações
        listarDoacoes,
        buscarDoacao,
        criarDoacao,
        atualizarDoacao,
        deletarDoacao,
        
        // Utilitários
        obterEstatisticas,
        verificarServidor,
        
        // Helpers
        salvarUsuarioLogado,
        obterUsuarioLogado,
        removerUsuarioLogado,
        estaLogado,
        eAdmin,
        requerLogin,
        requerAdmin,
        formatarData,
        formatarValor
    };
}
