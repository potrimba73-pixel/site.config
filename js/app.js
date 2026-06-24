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
        image: {
            backgroundUrl: 'https://probot.media/muc2fw4ibY.png',
            overlayOpacity: 50,
            avatarX: 512,
            avatarY: 180,
            avatarSize: 140,
            avatarShape: 'circle',
            avatarBorder: 6,
            avatarBorderColor: '#ffffff',
            usernameX: 512,
            usernameY: 340,
            usernameSize: 42,
            usernameColor: '#ffffff',
            usernameFont: 'Discord',
            usernameAlign: 'center',
            customText: 'BEM-VINDO AO SERVIDOR!',
            textX: 512,
            textY: 100,
            textSize: 56,
            textColor: '#F0E130',
            textFont: 'Bebas Neue',
            textAlign: 'center',
            layout: 'classic'
        }
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

// ===== API CONFIG =====
const API_URL = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : 'https://bot-panel-api.onrender.com/api';  // ALTERA ISTO para o teu URL

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

// ===== TOGGLE PASSWORD =====
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

// ===== TOGGLE SECTIONS =====
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
const welcomeImageSection = document.getElementById('welcome-image-config');
if (welcomeImageCheckbox && welcomeImageSection) {
    welcomeImageCheckbox.addEventListener('change', () => {
        welcomeImageSection.style.display = welcomeImageCheckbox.checked ? 'block' : 'none';
        config.welcome.imageEnabled = welcomeImageCheckbox.checked;
        if (welcomeImageCheckbox.checked) setTimeout(renderWelcomeCanvas, 100);
        updateJSONPreview();
    });
}

// ===== TABS =====
document.querySelectorAll('.image-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.image-tabs .tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`.tab-content[data-content="${target}"]`)?.classList.add('active');
    });
});

// ===== BACKGROUND GALLERY =====
document.querySelectorAll('.bg-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
        document.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('bg-image-url').value = thumb.dataset.url;
        config.welcome.image.backgroundUrl = thumb.dataset.url;
        renderWelcomeCanvas();
        updateJSONPreview();
    });
});

document.getElementById('bg-image-url')?.addEventListener('input', function() {
    config.welcome.image.backgroundUrl = this.value;
    renderWelcomeCanvas();
    updateJSONPreview();
});

// ===== OVERLAY =====
const overlaySlider = document.getElementById('bg-overlay-opacity');
const overlayValue = document.getElementById('overlay-value');
if (overlaySlider && overlayValue) {
    overlaySlider.addEventListener('input', () => {
        config.welcome.image.overlayOpacity = parseInt(overlaySlider.value);
        overlayValue.textContent = overlaySlider.value + '%';
        renderWelcomeCanvas();
        updateJSONPreview();
    });
}

// ===== COORD BUTTONS =====
document.querySelectorAll('[data-adjust]').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.adjust;
        const delta = parseInt(btn.dataset.delta);
        const input = document.getElementById(targetId);
        if (!input) return;
        input.value = parseInt(input.value || 0) + delta;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('change'));
    });
});

// ===== INPUT SYNC =====
function syncInputToConfig(id, key, type = 'string') {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
        let val = el.value;
        if (type === 'number') val = parseInt(val) || 0;
        config.welcome.image[key] = val;
        if (type === 'color') updateColorDisplays(id, val);
    });
    el.addEventListener('change', () => {
        let val = el.value;
        if (type === 'number') val = parseInt(val) || 0;
        config.welcome.image[key] = val;
        renderWelcomeCanvas();
        updateJSONPreview();
    });
}

['avatar-x','avatar-y','avatar-size','avatar-shape','avatar-border','avatar-border-color',
 'username-x','username-y','username-size','username-color','username-font','username-align',
 'text-x','text-y','text-size','text-color','text-font','text-align','custom-text'
].forEach(id => {
    const type = id.includes('color') ? 'color' : (id.includes('size') || id.includes('x') || id.includes('y') || id.includes('border') ? 'number' : 'string');
    const key = id.replace(/-([a-z])/g, (m,p) => p.toUpperCase());
    syncInputToConfig(id, key, type);
});

// ===== COLOR SYNC =====
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgb(${r},${g},${b})`;
}
function updateColorDisplays(pickerId, color) {
    const base = pickerId.replace('-color', '');
    const hexInput = document.getElementById(base + '-hex');
    const rgbSpan = document.getElementById(base + '-rgb');
    if (hexInput) hexInput.value = color.toUpperCase();
    if (rgbSpan) rgbSpan.textContent = hexToRgb(color);
}
['avatar-border', 'username', 'text'].forEach(prefix => {
    const picker = document.getElementById(prefix + '-color');
    const hex = document.getElementById(prefix + '-hex');
    if (!picker || !hex) return;
    hex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(hex.value)) {
            picker.value = hex.value;
            picker.dispatchEvent(new Event('input'));
            picker.dispatchEvent(new Event('change'));
        }
    });
});

// ===== LAYOUT =====
document.querySelectorAll('.layout-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.layout-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        document.getElementById('image-layout').value = opt.dataset.layout;
        config.welcome.image.layout = opt.dataset.layout;
        applyLayoutPreset(opt.dataset.layout);
        renderWelcomeCanvas();
        updateJSONPreview();
    });
});

const layoutPresets = {
    classic: { avatarX: 512, avatarY: 180, usernameY: 340, textY: 100, textAlign: 'center', usernameAlign: 'center', avatarSize: 140 },
    textonly: { avatarX: -999, avatarY: 180, usernameY: 260, textY: 120, textAlign: 'center', usernameAlign: 'center', avatarSize: 140 },
    left: { avatarX: 180, avatarY: 225, usernameX: 450, usernameY: 210, textX: 450, textY: 260, textAlign: 'left', usernameAlign: 'left', avatarSize: 140 },
    right: { avatarX: 844, avatarY: 225, usernameX: 574, usernameY: 210, textX: 574, textY: 260, textAlign: 'right', usernameAlign: 'right', avatarSize: 140 }
};
function applyLayoutPreset(layout) {
    const p = layoutPresets[layout];
    if (!p) return;
    Object.keys(p).forEach(k => {
        config.welcome.image[k] = p[k];
        const elId = k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        const el = document.getElementById(elId);
        if (el) el.value = p[k];
    });
}

// ===== CANVAS RENDERER =====
const canvas = document.getElementById('welcome-canvas');
const ctx = canvas?.getContext('2d');

function renderWelcomeCanvas() {
    if (!canvas || !ctx) return;
    const W = 1024, H = 450;
    const cfg = config.welcome.image;
    ctx.clearRect(0, 0, W, H);
    const loading = document.getElementById('canvas-loading');
    if (loading) loading.style.display = 'block';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        ctx.drawImage(img, 0, 0, W, H);
        ctx.fillStyle = `rgba(0,0,0,${cfg.overlayOpacity / 100})`;
        ctx.fillRect(0, 0, W, H);
        if (cfg.layout !== 'textonly' && cfg.avatarX >= 0) drawAvatar(ctx, cfg);
        drawTextElements(ctx, cfg);
        if (loading) loading.style.display = 'none';
    };
    img.onerror = () => {
        const grad = ctx.createLinearGradient(0,0,W,H);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#16213e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        if (cfg.layout !== 'textonly' && cfg.avatarX >= 0) drawAvatar(ctx, cfg);
        drawTextElements(ctx, cfg);
        if (loading) loading.style.display = 'none';
    };
    img.src = cfg.backgroundUrl;
}

function drawAvatar(ctx, cfg) {
    const x = cfg.avatarX, y = cfg.avatarY, s = cfg.avatarSize;
    ctx.save();
    ctx.beginPath();
    if (cfg.avatarShape === 'circle') {
        ctx.arc(x, y, s/2, 0, Math.PI * 2);
    } else if (cfg.avatarShape === 'rounded') {
        roundRectPath(ctx, x - s/2, y - s/2, s, s, s/8);
    } else {
        ctx.rect(x - s/2, y - s/2, s, s);
    }
    ctx.closePath();
    if (cfg.avatarBorder > 0) {
        ctx.lineWidth = cfg.avatarBorder;
        ctx.strokeStyle = cfg.avatarBorderColor;
        ctx.stroke();
    }
    ctx.clip();
    const grad = ctx.createLinearGradient(x - s/2, y - s/2, x + s/2, y + s/2);
    grad.addColorStop(0, '#5865F2');
    grad.addColorStop(1, '#4752C4');
    ctx.fillStyle = grad;
    ctx.fillRect(x - s/2, y - s/2, s, s);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(x, y - s/8, s/5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + s/3, s/3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawTextElements(ctx, cfg) {
    const W = 1024;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.font = `bold ${cfg.textSize}px "${cfg.textFont}", "Bebas Neue", sans-serif`;
    ctx.fillStyle = cfg.textColor;
    ctx.textAlign = cfg.textAlign;
    ctx.textBaseline = 'middle';
    ctx.fillText(cfg.customText, cfg.textX, cfg.textY);

    ctx.font = `bold ${cfg.usernameSize}px "${cfg.usernameFont}", sans-serif`;
    ctx.fillStyle = cfg.usernameColor;
    ctx.textAlign = cfg.usernameAlign;
    ctx.fillText('NomeDoUtilizador', cfg.usernameX, cfg.usernameY);

    ctx.shadowBlur = 4;
    ctx.font = `500 22px "${cfg.usernameFont}", sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('Bem-vindo ao servidor!', cfg.usernameX, cfg.usernameY + cfg.usernameSize * 0.9);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function roundRectPath(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
}

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
    if (input.type === 'checkbox') value = input.checked;
    else if (input.type === 'number') value = parseFloat(input.value) || 0;
    else value = input.value;
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
    if (preview) preview.textContent = JSON.stringify(config, null, 2);
}

// ===== COPY JSON =====
document.getElementById('copy-json')?.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {
        showToast('JSON copiado!', 'success');
    });
});

// ===== STATUS BADGES =====
function updateStatusBadges() {
    const botToken = document.getElementById('bot-token');
    const statusBot = document.getElementById('status-bot');
    if (statusBot && botToken) {
        statusBot.textContent = botToken.value.length > 10 ? 'Configurado' : 'Não configurado';
        statusBot.classList.toggle('configured', botToken.value.length > 10);
    }
    const welcomeEnabled = document.getElementById('welcome-enabled');
    const statusWelcome = document.getElementById('status-welcome');
    if (statusWelcome && welcomeEnabled) {
        statusWelcome.textContent = welcomeEnabled.checked ? 'Ativo' : 'Desativado';
        statusWelcome.classList.toggle('enabled', welcomeEnabled.checked);
    }
    const modEnabled = document.getElementById('anti-spam');
    const statusMod = document.getElementById('status-mod');
    if (statusMod && modEnabled) {
        statusMod.textContent = modEnabled.checked ? 'Ativo' : 'Desativado';
        statusMod.classList.toggle('enabled', modEnabled.checked);
    }
    const logChannel = document.getElementById('log-channel');
    const statusLogs = document.getElementById('status-logs');
    if (statusLogs && logChannel) {
        statusLogs.textContent = logChannel.value.length > 5 ? 'Definido' : 'Não definido';
        statusLogs.classList.toggle('configured', logChannel.value.length > 5);
    }
    const ticketsEnabled = document.getElementById('tickets-enabled');
    const statusTickets = document.getElementById('status-tickets');
    if (statusTickets && ticketsEnabled) {
        statusTickets.textContent = ticketsEnabled.checked ? 'Ativo' : 'Desativado';
        statusTickets.classList.toggle('enabled', ticketsEnabled.checked);
    }
}

// ===== VARIABLE TAGS =====
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
    const description = document.getElementById('embed-description')?.value || 'Descrição...';
    const color = document.getElementById('embed-color')?.value || '#5865F2';
    const footer = document.getElementById('embed-footer')?.value || 'Footer';
    const timestamp = document.getElementById('embed-timestamp')?.checked;
    const preview = document.getElementById('embed-preview');
    if (preview) {
        const timeStr = timestamp ? new Date().toLocaleString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '';
        preview.innerHTML = `<div class="discord-embed"><div class="embed-color-bar" style="background:${color};"></div><div class="embed-content"><div class="embed-title">${escapeHtml(title)}</div><div class="embed-description">${escapeHtml(description).replace(/\n/g,'<br>')}</div><div class="embed-footer"><span>${escapeHtml(footer)}</span>${timestamp?`<span class="embed-timestamp">Hoje às ${timeStr}</span>`:''}</div></div></div>`;
    }
    const embedJSON = { title, description, color: parseInt(color.replace('#',''),16), footer: { text: footer } };
    if (timestamp) embedJSON.timestamp = new Date().toISOString();
    const jsonArea = document.getElementById('embed-json');
    if (jsonArea) jsonArea.value = JSON.stringify(embedJSON, null, 2);
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
['embed-title','embed-description','embed-color','embed-footer'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateEmbedPreview);
});
document.getElementById('embed-timestamp')?.addEventListener('change', updateEmbedPreview);
document.getElementById('copy-embed-json')?.addEventListener('click', () => {
    const json = document.getElementById('embed-json')?.value;
    if (json) navigator.clipboard.writeText(json).then(() => showToast('JSON copiado!', 'success'));
});

// ============================================================
// ===== API FUNCTIONS - EXPORTAÇÃO DIRETA PARA O BOT =====
// ============================================================

// Verificar se API está online
async function checkAPI() {
    try {
        const res = await fetch(`${API_URL}/health`, { method: 'GET' });
        const data = await res.json();
        return data.status === 'ok';
    } catch (e) {
        return false;
    }
}

// GUARDAR na API (exportação direta)
async function saveConfigToAPI() {
    const guildId = document.getElementById('guild-id')?.value;
    const botToken = document.getElementById('bot-token')?.value;
    const clientId = document.getElementById('client-id')?.value;

    if (!guildId || !botToken || !clientId) {
        showToast('Preenche Guild ID, Bot Token e Client ID primeiro!', 'warning');
        return false;
    }

    showToast('A guardar na API...', 'info');

    try {
        const res = await fetch(`${API_URL}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guildId,
                botToken,
                clientId,
                ...config
            })
        });

        const data = await res.json();

        if (res.ok) {
            showToast('Configuração guardada na API! ✅', 'success');
            return true;
        } else {
            showToast('Erro: ' + (data.error || 'Falha ao guardar'), 'error');
            return false;
        }
    } catch (err) {
        showToast('API offline. Usa o download do JSON.', 'warning');
        console.error('API Error:', err);
        return false;
    }
}

// CARREGAR da API
async function loadConfigFromAPI() {
    const guildId = document.getElementById('guild-id')?.value;
    if (!guildId) {
        showToast('Insere o Guild ID primeiro!', 'warning');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/config/${guildId}`);
        if (res.status === 404) {
            showToast('Configuração não encontrada na API', 'info');
            return;
        }
        const data = await res.json();

        // Merge com config atual
        Object.assign(config, data);
        populateInputs();
        updateJSONPreview();
        updateStatusBadges();
        showToast('Configuração carregada da API!', 'success');
    } catch (err) {
        showToast('Erro ao carregar da API', 'error');
    }
}

// ===== SAVE POPUP COM OPÇÃO API =====
function showSavePopup() {
    const overlay = document.getElementById('save-popup-overlay');
    if (overlay) overlay.style.display = 'flex';
}

document.getElementById('popup-close')?.addEventListener('click', () => {
    document.getElementById('save-popup-overlay').style.display = 'none';
});

document.getElementById('popup-download')?.addEventListener('click', () => {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('save-popup-overlay').style.display = 'none';
    showToast('JSON descarregado!', 'success');
});

// Botão "Guardar na API" no popup
const popupContent = document.querySelector('.save-popup-content');
if (popupContent) {
    const apiBtn = document.createElement('button');
    apiBtn.className = 'btn btn-primary';
    apiBtn.innerHTML = '<i class="fas fa-cloud"></i> Guardar na API';
    apiBtn.style.marginTop = '10px';
    apiBtn.addEventListener('click', async () => {
        const ok = await saveConfigToAPI();
        if (ok) document.getElementById('save-popup-overlay').style.display = 'none';
    });
    popupContent.appendChild(apiBtn);
}

// ===== SAVE DRAFT =====
document.getElementById('save-draft')?.addEventListener('click', () => {
    localStorage.setItem('botpanel_config', JSON.stringify(config));
    showToast('Rascunho guardado localmente!', 'info');
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
            if (input.type === 'checkbox') input.checked = value;
            else input.value = value;
        }
    });
    ['avatar-border', 'username', 'text'].forEach(prefix => {
        const picker = document.getElementById(prefix + '-color');
        if (picker) updateColorDisplays(prefix + '-color', picker.value);
    });
    document.getElementById('welcome-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('goodbye-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('tickets-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('levels-enabled')?.dispatchEvent(new Event('change'));
    document.getElementById('welcome-image-enabled')?.dispatchEvent(new Event('change'));
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateJSONPreview();
    updateStatusBadges();
    loadDraft();

    // Verificar API
    checkAPI().then(online => {
        if (online) showToast('API online! Podes guardar diretamente.', 'info');
    });

    setTimeout(() => {
        if (document.getElementById('welcome-image-enabled')?.checked) renderWelcomeCanvas();
    }, 500);

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
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.floor(current);
    }, 16);
}
