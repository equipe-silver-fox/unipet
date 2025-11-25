# 🐾 Unipet - Sistema de Adoção de Pets

Sistema web completo para adoção de animais de estimação com recursos avançados de acessibilidade.

## 📋 Sobre o Projeto

O Unipet é uma plataforma que conecta pets que precisam de um lar com pessoas dispostas a adotar. Focado em acessibilidade e facilidade de uso, o sistema oferece recursos para todos os públicos.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express.js** - Servidor e API REST
- **JSON** - Banco de dados (arquivo db.json)

### Frontend
- **HTML5** + **CSS3** + **JavaScript** puro
- **Font Awesome** - Ícones
- **VLibras** - Tradução para Libras

## 📁 Estrutura do Projeto

```
unipet/
├── server/
│   ├── server.js              # Servidor Express (API REST)
│   └── db/
│       └── db.json            # Banco de dados único
├── src/
│   ├── script.js              # Lógica principal do frontend
│   ├── api.js                 # Cliente da API (comunicação com backend)
│   └── pages/
│       ├── index.html         # Página principal (requer login)
│       ├── login.html         # Login
│       └── registrar.html     # Cadastro
└── public/
    ├── style.css              # Estilos principais
    └── accessibility.css      # Estilos de acessibilidade
```

## 🔧 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm run dev
```

O servidor rodará em `http://localhost:3000`

### 3. Acessar o Sistema
Abra `src/pages/login.html` no navegador ou use a extensão Live Server do VS Code.

## 📚 Principais Funcionalidades

### Para Usuários
- ✅ Cadastro e Login
- ✅ Visualizar pets disponíveis
- ✅ Solicitar adoção
- ✅ Fazer doações (dinheiro, ração, tempo)
- ✅ Compartilhar pets

### Para Administradores
- ✅ Adicionar novos pets
- ✅ Gerenciar solicitações de adoção
- ✅ Visualizar estatísticas

### Acessibilidade
- ✅ Controle de tamanho de fonte (60% - 150%)
- ✅ Alto contraste (preto/branco/amarelo)
- ✅ Modo escuro
- ✅ Leitor de tela (Text-to-Speech)
- ✅ Guia de leitura
- ✅ VLibras (Língua de Sinais)
- ✅ Navegação por teclado
- ✅ Cursor grande
- ✅ Atalhos de teclado

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Alt + A` | Abrir menu de acessibilidade |
| `Alt + W` | Aumentar fonte |
| `Alt + S` | Diminuir fonte |
| `Alt + Q` | Resetar fonte |
| `Alt + B` | Ativar/desativar alto contraste |
| `Alt + L` | Abrir VLibras |

## 🗄️ API Endpoints

### Usuários
- `POST /login` - Login
- `POST /usuarios` - Cadastrar usuário
- `GET /usuarios` - Listar usuários
- `GET /usuarios/:id` - Buscar usuário
- `PUT /usuarios/:id` - Atualizar usuário

### Pets
- `GET /pets` - Listar todos os pets
- `POST /pets` - Adicionar pet
- `GET /pets/:id` - Buscar pet
- `PUT /pets/:id` - Atualizar pet
- `DELETE /pets/:id` - Remover pet

### Adoções
- `GET /adocoes` - Listar adoções
- `POST /adocoes` - Criar solicitação de adoção
- `GET /adocoes/usuario/:usuarioId` - Adoções do usuário
- `PUT /adocoes/:id` - Atualizar status da adoção

### Doações
- `GET /doacoes` - Listar doações
- `POST /doacoes` - Registrar doação
- `PUT /doacoes/:id` - Atualizar doação

### Estatísticas
- `GET /estatisticas` - Dados gerais do sistema

## 📝 Estrutura do Banco de Dados

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "email@example.com",
      "senha": "senha123",
      "admin": false
    }
  ],
  "pets": [
    {
      "id": 1,
      "nome": "Rex",
      "tipo": "cachorro",
      "idade": "2 anos",
      "raca": "Labrador",
      "local": "São Paulo",
      "contato": "(11) 99999-9999",
      "descricao": "Cachorro dócil e brincalhão",
      "imagem": "data:image/base64..."
    }
  ],
  "adocoes": [
    {
      "id": 1,
      "petId": 1,
      "petName": "Rex",
      "adotante": { "nome": "...", "email": "...", ... },
      "status": "pendente",
      "data": "2025-11-25T..."
    }
  ],
  "doacoes": [
    {
      "id": 1,
      "tipo": "dinheiro",
      "doador": { "nome": "...", "email": "...", ... },
      "detalhes": "Doação de R$ 100",
      "status": "concluida",
      "data": "2025-11-25T..."
    }
  ]
}
```

## 🎯 Como o Código Está Organizado

### src/script.js
Dividido em seções claras:
1. **Acessibilidade** - Todos recursos de acessibilidade
2. **Autenticação** - Login/logout/verificação
3. **Pets** - Listar, exibir, adicionar pets
4. **Adoções** - Formulário e processamento
5. **Doações** - Tipos de doação (dinheiro, ração, tempo)
6. **Navegação** - Menu e modais
7. **Inicialização** - Startup da aplicação

### src/api.js
Cliente da API com função auxiliar `fetchAPI` que:
- Valida se resposta é JSON
- Trata erros de conexão
- Retorna mensagens claras de erro

### server/server-v2.js
API REST completa com:
- Validação de dados
- Sanitização de inputs
- Tratamento de erros
- Limite de 50MB para imagens

## 🔒 Usuário Admin Padrão

```
Email: admin@unipet.com
Senha: admin123
```

## 🐛 Resolução de Problemas

### Erro "request entity too large"
- O limite está configurado para 50MB
- Reduza o tamanho da imagem antes de enviar

### Erro "JSON.parse: unexpected character"
- Verifique se o servidor está rodando em `http://localhost:3000`
- Reinicie o servidor com `npm run dev`

### Pets não aparecem
- Verifique se há pets cadastrados no `db.json`
- Confirme que está logado no sistema

## 👥 Contribuindo

Este é um projeto educacional. Sinta-se livre para estudar, modificar e melhorar!

## 📄 Licença

Projeto de código aberto para fins educacionais.

