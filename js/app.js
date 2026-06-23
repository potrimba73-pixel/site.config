// ===== CONFIGURAÇÃO INICIAL =====
const config = {
    bot: {
        token: '',
        clientId: '',
        guildId: '',
        statusType: 'online',
        statusText: '',
        prefix: '!',
        slashCommands: true,
        dmCommands: false,
        debug: false
    },
    welcome: {
        enabled: false,
        sendType: 'channel',
        channelId: '',
        message: 'Entrou um novo membro, [user]! Diverte-te connosco, mas segue as regras! Agora há [memberCount] membros! 👍',
        imageEnabled: false,
        imageUrl: 'https://probot.media/muc2fw4ibY.png'
    },
    goodbye: {
        enabled: false,
        channelId: '',
        message: 'Oh, o [userName] saiu do servidor 😢, faz boa viagem! Ainda restam [memberCount] membros.'
    },
    moderation: {
        antiSpam: false,
        antiLink: false,
        antiMassMention: false,
        profanityFilter: false,
        muteRole: '',
        modRole: '',
        adminRole: '',
        warnLimit: 3,
        warnAction: 'mute'
    },
    logs: {
        generalChannel: '',
        modChannel: '',
        joinChannel: '',
        events: {
            messageDelete: true,
            messageEdit: true,
            memberJoin: true,
            memberLeave: true,
            roleChange: false,
            channelChange: false,
            voiceChange: false,
            banUnban: false
        }
    },
    roles: {
        autoRole: ''
    },
    tickets: {
        enabled: false,
        categoryId: '',
        supportRole: '',
        panelMessage: 'Clica no botão abaixo para abrir um ticket de suporte!',
        buttonEmoji: '🎫',
        saveTranscript: true,
        transcriptChannel: ''
    },
    levels: {
        enabled: false,
        xpMultiplier: 1,
        cooldown: 60,
        announceChannel: '',
        rewards: {
            5: '',
            10: '',
            25: ''
        }
    }
};

// ===== DOM ELEMENTS =====
const sidebarItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const toastContainer = document.getElementById('toast-container');

// ===== NAVEGAÇÃO =====
sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;

        sidebarItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        contentSections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        updatePageTitle(section);
    });
});

function updatePageTitle(section) {
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Visão geral do teu bot' },
        'bot-config': { title: 'Bot & Tokens', subtitle: 'Configura as credenciais do bot' },
        welcome: { title: 'Boas-vindas & Adeus', subtitle: 'Configura mensagens de entrada e saída' },
        moderation: { title: 'Moderação', subtitle: 'Ferramentas de moderação automática' },
        logs: { title: 'Logs', subtitle: 'Configura canais e eventos de log' },
        roles: { title: 'Cargos Auto', subtitle: 'Cargos automáticos e reaction roles' },
        tickets: { title: 'Tickets', subtitle: 'Sistema de suporte por tickets' },
        levels: { title: 'Níveis & XP', subtitle: 'Sistema de progressão de membros' },
        'embed-builder': { title: 'Embed Builder', subtitle: 'Cria embeds personalizados' },
        commands: { title: 'Comandos', subtitle: 'Gerencia comandos personalizados' }
    };

    const t = titles[section] || titles.dashboard;
    document.getElementById('page-title').textContent = t.title;
    document.getElementById('page-subtitle').textContent = t.subtitle;
}

// ===== TOGGLE PASSWORD VISIBILITY =====
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ===== TOGGLE SECTIONS (Welcome/Goodbye/Tickets/Levels) =====
function toggleSection(checkboxId, contentId) {
    const checkbox = document.getElementById(checkboxId);
    const content = document.getElementById(contentId);
    if (!checkbox || !content) return;

    checkbox.addEventListener('change', () => {
        content.style.opacity = checkbox.checked ? '1' : '0.5';
        content.style.pointerEvents = checkbox.checked ? 'auto' : 'none';
        updateConfigFromInput(checkbox);
        updateJSONPreview();
        updateStatusBadges();
    });

    if (!checkbox.checked) {
        content.style.opacity = '0.5';
        content.style.pointerEvents = 'none';
    }
}

toggleSection('welcome-enabled', 'welcome-content');
toggleSection('goodbye-enabled', 'goodbye-content');
toggleSection('tickets-enabled', 'tickets-content');
toggleSection('levels-enabled', 'levels-content');

// ===== WELCOME IMAGE TOGGLE =====
const welcomeImageCheckbox = document.getElementById('welcome-image-enabled');
const welcomeImageConfig = document.getElementById('welcome-image-config');
if (welcomeImageCheckbox && welcomeImageConfig) {
    welcomeImageCheckbox.addEventListener('change', () => {
        welcomeImageConfig.style.display = welcomeImageCheckbox.checked ? 'block' : 'none';
        updateConfigFromInput(welcomeImageCheckbox);
        updateJSONPreview();
    });
    welcomeImageConfig.style.display = welcomeImageCheckbox.checked ? 'block' : 'none';
}

// ===== WELCOME IMAGE TABS =====
const imageTabs = document.querySelectorAll('.image-tabs .tab-btn');

imageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        imageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateWelcomeImagePreview(tab.textContent.trim());
    });
});

function updateWelcomeImagePreview(activeTab) {
    const previewBox = document.querySelector('.image-preview-box');
    const imageUrl = document.getElementById('welcome-image-url')?.value || '';

    if (!previewBox) return;

    previewBox.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageUrl || 'https://probot.media/muc2fw4ibY.png';
    img.alt = 'Preview';
    img.id = 'welcome-image-preview';
    img.onerror = function() {
        this.src = 'https://probot.media/muc2fw4ibY.png';
    };
    previewBox.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    switch(activeTab) {
        case 'Imagem de fundo':
            overlay.innerHTML = `
                <span class="preview-text">ProBot</span>
                <span class="preview-subtext">Bem-Vindo a Portugal Alfa Community</span>
            `;
            break;
        case 'Avatar':
            overlay.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;">
                    <img src="https://cdn.discordapp.com/embed/avatars/0.png"
                         style="width:64px;height:64px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);">
                    <div style="display:flex;flex-direction:column;">
                        <span class="preview-text" style="font-size:1.4rem;">Utilizador</span>
                        <span class="preview-subtext">Bem-vindo ao servidor!</span>
                    </div>
                </div>
            `;
            break;
        case 'Nome do Utilizador':
            overlay.innerHTML = `
                <span class="preview-text" style="font-size:1.6rem;">@Utilizador</span>
                <span class="preview-subtext">Acabou de entrar no servidor</span>
            `;
            break;
        case 'Texto':
            overlay.innerHTML = `
                <span class="preview-text" style="font-size:1.8rem;color:#F0E130;">BEM-VINDO!</span>
                <span class="preview-subtext" style="color:white;font-size:1rem;">És o membro #[memberCount]</span>
            `;
            break;
    }

    previewBox.appendChild(overlay);
}

document.getElementById('welcome-image-url')?.addEventListener('input', function() {
    const activeTab = document.querySelector('.image-tabs .tab-btn.active')?.textContent.trim() || 'Imagem de fundo';
    updateWelcomeImagePreview(activeTab);
    updateConfigFromInput(this);
    updateJSONPreview();
});

// ===== RANGE SLIDER =====
const xpMultiplier = document.getElementById('xp-multiplier');
const xpMultiplierValue = document.getElementById('xp-multiplier-value');
if (xpMultiplier && xpMultiplierValue) {
    xpMultiplier.addEventListener('input', () => {
        xpMultiplierValue.textContent = xpMultiplier.value + 'x';
        updateConfigFromInput(xpMultiplier);
        updateJSONPreview();
    });
}

// ===== CONFIG SYNC =====
function getPath(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
}

function setPath(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current)) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

function updateConfigFromInput(input) {
    const path = input.dataset.config;
    if (!path) return;

    let value;
    if (input.type === 'checkbox') {
        value = input.checked;
    } else if (input.type === 'number') {
        value = parseFloat(input.value) || 0;
    } else {
        value = input.value;
    }

    setPath(config, path, value);
}

// ===== INPUT LISTENERS =====
document.querySelectorAll('input[data-config], textarea[data-config], select[data-config]').forEach(input => {
    input.addEventListener('input', () => {
        updateConfigFromInput(input);
        updateJSONPreview();
        updateStatusBadges();
    });

    input.addEventListener('change', () => {
        updateConfigFromInput(input);
        updateJSONPreview();
        updateStatusBadges();
    });
});

// ===== JSON PREVIEW =====
function updateJSONPreview() {
    const preview = document.getElementById('json-preview');
    if (preview) {
        preview.textContent = JSON.stringify(config, null, 2);
    }
}

// ===== COPY JSON =====
document.getElementById('copy-json')?.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {
        showToast('JSON copiado para a clipboard!', 'success');
    });
});

// ===== STATUS BADGES =====
function updateStatusBadges() {
    const botToken = document.getElementById('bot-token');
    const statusBot = document.getElementById('status-bot');
    if (statusBot && botToken) {
        if (botToken.value.length > 10) {
            statusBot.textContent = 'Configurado';
            statusBot.classList.add('configured');
        } else {
            statusBot.textContent = 'Não configurado';
            statusBot.classList.remove('configured');
        }
    }

    const welcomeEnabled = document.getElementById('welcome-enabled');
    const statusWelcome = document.getElementById('status-welcome');
    if (statusWelcome && welcomeEnabled) {
        if (welcomeEnabled.checked) {
            statusWelcome.textContent = 'Ativo';
            statusWelcome.classList.add('enabled');
            statusWelcome.classList.remove('configured');
        } else {
            statusWelcome.textContent = 'Desativado';
            statusWelcome.classList.remove('enabled');
        }
    }

    const modEnabled = document.getElementById('anti-spam');
    const statusMod = document.getElementById('status-mod');
    if (statusMod && modEnabled) {
        if (modEnabled.checked) {
            statusMod.textContent = 'Ativo';
            statusMod.classList.add('enabled');
        } else {
            statusMod.textContent = 'Desativado';
            statusMod.classList.remove('enabled');
        }
    }

    const logChannel = document.getElementById('log-channel');
    const statusLogs = document.getElementById('status-logs');
    if (statusLogs && logChannel) {
        if (logChannel.value.length > 5) {
            statusLogs.textContent = 'Definido';
            statusLogs.classList.add('configured');
        } else {
            statusLogs.textContent = 'Não definido';
            statusLogs.classList.remove('configured');
        }
    }

    const ticketsEnabled = document.getElementById('tickets-enabled');
    const statusTickets = document.getElementById('status-tickets');
    if (statusTickets && ticketsEnabled) {
        if (ticketsEnabled.checked) {
            statusTickets.textContent = 'Ativo';
            statusTickets.classList.add('enabled');
        } else {
            statusTickets.textContent = 'Desativado';
            statusTickets.classList.remove('enabled');
        }
    }
}

// ===== VARIABLE TAGS CLICK =====
document.querySelectorAll('.var-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const textarea = tag.closest('.form-group').querySelector('textarea');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            textarea.value = text.substring(0, start) + tag.textContent + text.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + tag.textContent.length;
            textarea.focus();
            updateConfigFromInput(textarea);
            updateJSONPreview();
        }
    });
});

// ===== EMBED BUILDER =====
function updateEmbedPreview() {
    const title = document.getElementById('embed-title')?.value || 'Título do Embed';
    const description = document.getElementById('embed-description')?.value || 'Descrição do embed aparece aqui...';
    const color = document.getElementById('embed-color')?.value || '#5865F2';
    const footer = document.getElementById('embed-footer')?.value || 'Footer text';
    const timestamp = document.getElementById('embed-timestamp')?.checked;

    const preview = document.getElementById('embed-preview');
    if (preview) {
        const timeStr = timestamp ? new Date().toLocaleString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';
        preview.innerHTML = `
            <div class="discord-embed">
                <div class="embed-color-bar" style="background: ${color};"></div>
                <div class="embed-content">
                    <div class="embed-title">${escapeHtml(title)}</div>
                    <div class="embed-description">${escapeHtml(description).replace(/\n/g, '<br>')}</div>
                    <div class="embed-footer">
                        <span>${escapeHtml(footer)}</span>
                        ${timestamp ? `<span class="embed-timestamp">Hoje às ${timeStr}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    const embedJSON = {
        title: title,
        description: description,
        color: parseInt(color.replace('#', ''), 16),
        footer: { text: footer }
    };
    if (timestamp) embedJSON.timestamp = new Date().toISOString();

    const jsonArea = document.getElementById('embed-json');
    if (jsonArea) {
        jsonArea.value = JSON.stringify(embedJSON, null, 2);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

['embed-title', 'embed-description', 'embed-color', 'embed-footer'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateEmbedPreview);
});
document.getElementById('embed-timestamp')?.addEventListener('change', updateEmbedPreview);

document.getElementById('copy-embed-json')?.addEventListener('click', () => {
    const json = document.getElementById('embed-json')?.value;
    if (json) {
        navigator.clipboard.writeText(json).then(() => {
            showToast('JSON do embed copiado!', 'success');
        });
    }
});

// ===== SAVE BUTTONS =====
document.getElementById('save-config')?.addEventListener('click', () => {
    const jsonStr = JSON.stringify(config, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);

    showToast('Configurações guardadas e descarregadas!', 'success');
});

document.getElementById('save-draft')?.addEventListener('click', () => {
    localStorage.setItem('botpanel_config', JSON.stringify(config));
    showToast('Rascunho guardado no localStorage!', 'info');
});

// ===== LOAD DRAFT =====
function loadDraft() {
    const saved = localStorage.getItem('botpanel_config');
    if (saved) {
        try {
            const savedConfig = JSON.parse(saved);
            Object.assign(config, savedConfig);
            populateInputs();
            updateJSONPreview();
            updateStatusBadges();
            showToast('Rascunho carregado!', 'info');
        } catch (e) {
            console.error('Erro ao carregar rascunho:', e);
        }
    }
}

function populateInputs() {
    document.querySelectorAll('[data-config]').forEach(input => {
        const path = input.dataset.config;
        const value = getPath(config, path);
        if (value !== undefined) {
            if (input.type === 'checkbox') {
                input.checked = value;
            } else {
                input.value = value;
            }
        }
    });

    document.getElementById('welcome-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('goodbye-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('tickets-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('levels-enabled')?.dispatchEvent(new Event('change'));
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.success}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== RENDER DEPLOYMENT INFO =====
function showDeployInfo() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           🚀 BOT PANEL - DEPLOY NO RENDER                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. Cria um novo repo no GitHub                              ║
║  2. Faz upload destes ficheiros                              ║
║  3. Vai a render.com → New Static Site                       ║
║  4. Conecta o teu repo GitHub                                ║
║  5. Build Command: (deixa vazio)                             ║
║  6. Publish Directory: ./                                    ║
║  7. Clica Deploy!                                            ║
║                                                              ║
║  O site será hospedado em: https://teu-bot.onrender.com      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateJSONPreview();
    updateStatusBadges();
    loadDraft();
    showDeployInfo();

    // Inicializa preview da imagem de boas-vindas
    const initialTab = document.querySelector('.image-tabs .tab-btn.active');
    if (initialTab) {
        updateWelcomeImagePreview(initialTab.textContent.trim());
    }

    // Animate stats
    animateValue('stat-servers', 0, 12, 1000);
    animateValue('stat-users', 0, 487, 1500);
    animateValue('stat-commands', 0, 24, 1200);
});

function animateValue(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}
