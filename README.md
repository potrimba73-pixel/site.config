# 🤖 Discord Bot Panel

Painel de configuração web para bots Discord, inspirado no ProBot. Permite configurar todas as funcionalidades do bot através de uma interface visual intuitiva.

![Preview](https://i.imgur.com/preview.png)

## ✨ Funcionalidades

- **Dashboard** - Visão geral com estatísticas do bot
- **Bot & Tokens** - Configuração de credenciais e opções gerais
- **Boas-vindas & Adeus** - Mensagens personalizadas com variáveis e imagens
- **Moderação** - Auto-mod, cargos de staff, sistema de warns
- **Logs** - Canais de log e eventos monitorizados
- **Cargos Auto** - Auto-role e reaction roles
- **Tickets** - Sistema de suporte com transcripts
- **Níveis & XP** - Sistema de progressão com recompensas
- **Embed Builder** - Criador de embeds com preview em tempo real
- **Comandos** - Gestão de comandos personalizados

## 🚀 Deploy no Render

### 1. Criar repositório no GitHub

```bash
# Cria uma nova pasta
mkdir discord-bot-panel
cd discord-bot-panel

# Inicializa o git
git init

# Adiciona os ficheiros
git add .
git commit -m "Initial commit"

# Cria o repo no GitHub e faz push
git remote add origin https://github.com/TEU-USERNAME/discord-bot-panel.git
git branch -M main
git push -u origin main
```

### 2. Deploy no Render

1. Vai a [render.com](https://render.com) e faz login
2. Clica em **"New +"** → **"Static Site"**
3. Conecta a tua conta GitHub e seleciona o repositório
4. Configura:
   - **Name:** `discord-bot-panel` (ou o nome que quiseres)
   - **Branch:** `main`
   - **Build Command:** *(deixa vazio)*
   - **Publish Directory:** `./`
5. Clica em **"Create Static Site"**

O site ficará disponível em `https://discord-bot-panel.onrender.com`

### 3. Configurar o Bot

1. Abre o painel no browser
2. Vai a **"Bot & Tokens"**
3. Insere:
   - **Bot Token** - O token do teu bot (Discord Developer Portal)
   - **Client ID** - ID da aplicação
   - **Guild ID** - ID do servidor (opcional)
4. Configura as restantes secções
5. Clica em **"Aplicar Configurações"** para descarregar o `config.json`

## 📁 Estrutura do Projeto

```
discord-bot-panel/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── app.js          # Lógica JavaScript
└── README.md           # Este ficheiro
```

## 🔧 Variáveis Disponíveis

### Boas-vindas / Adeus
| Variável | Descrição |
|----------|-----------|
| `[user]` | Menciona o membro |
| `[userName]` | Nome do membro sem mencionar |
| `[memberCount]` | Quantidade de membros |
| `[server]` | Nome do servidor |
| `[inviter]` | Menciona o convidante |

## 📝 Licença

MIT License - Faz o que quiseres com isto!
