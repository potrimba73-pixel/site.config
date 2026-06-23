// ===== WELCOME IMAGE BUILDER =====
const welcomeImageConfig = {
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
};

// Merge into main config
config.welcome.image = welcomeImageConfig;

const welcomeImageCheckbox = document.getElementById('welcome-image-enabled');
const welcomeImageSection = document.getElementById('welcome-image-config');

if (welcomeImageCheckbox && welcomeImageSection) {
    welcomeImageCheckbox.addEventListener('change', () => {
        welcomeImageSection.style.display = welcomeImageCheckbox.checked ? 'block' : 'none';
        config.welcome.imageEnabled = welcomeImageCheckbox.checked;
        updateJSONPreview();
    });
}

// Tabs
document.querySelectorAll('.image-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.image-tabs .tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`.tab-content[data-content="${target}"]`)?.classList.add('active');
        
        renderWelcomeCanvas();
    });
});

// Background gallery
document.querySelectorAll('.bg-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
        document.querySelectorAll('.bg-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('bg-image-url').value = thumb.dataset.url;
        welcomeImageConfig.backgroundUrl = thumb.dataset.url;
        renderWelcomeCanvas();
        updateJSONPreview();
    });
});

document.getElementById('bg-image-url')?.addEventListener('input', function() {
    welcomeImageConfig.backgroundUrl = this.value;
    renderWelcomeCanvas();
    updateJSONPreview();
});

// Overlay opacity
const overlaySlider = document.getElementById('bg-overlay-opacity');
const overlayValue = document.getElementById('overlay-value');
if (overlaySlider && overlayValue) {
    overlaySlider.addEventListener('input', () => {
        welcomeImageConfig.overlayOpacity = parseInt(overlaySlider.value);
        overlayValue.textContent = overlaySlider.value + '%';
        renderWelcomeCanvas();
        updateJSONPreview();
    });
}

// Coord adjust buttons
window.adjustValue = function(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = parseInt(input.value || 0) + delta;
    input.dispatchEvent(new Event('input'));
};

// Inputs que disparam render
['avatar-x','avatar-y','avatar-size','avatar-shape','avatar-border','avatar-border-color',
 'username-x','username-y','username-size','username-color','username-font','username-align',
 'text-x','text-y','text-size','text-color','text-font','text-align','custom-text'
].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
        const key = id.replace(/-([a-z])/g, (m,p) => p.toUpperCase());
        welcomeImageConfig[key] = el.type === 'number' ? parseInt(el.value) : el.value;
        if (id.includes('color')) renderWelcomeCanvas(); // color picker
    });
    el.addEventListener('change', () => {
        renderWelcomeCanvas();
        updateJSONPreview();
    });
});

// Color hex sync
['avatar-border-color','username-color','text-color'].forEach(id => {
    const picker = document.getElementById(id);
    const hex = document.getElementById(id.replace('color','hex') || id.replace('color','hex'));
    if (!picker || !hex) return;
    picker.addEventListener('input', () => { hex.value = picker.value; });
    hex.addEventListener('input', () => { 
        if (/^#[0-9A-F]{6}$/i.test(hex.value)) {
            picker.value = hex.value;
            picker.dispatchEvent(new Event('input'));
        }
    });
});

// Layout selector
document.querySelectorAll('.layout-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.layout-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        document.getElementById('image-layout').value = opt.dataset.layout;
        welcomeImageConfig.layout = opt.dataset.layout;
        applyLayoutPreset(opt.dataset.layout);
        renderWelcomeCanvas();
        updateJSONPreview();
    });
});

function applyLayoutPreset(layout) {
    const presets = {
        classic: { avatarX: 512, avatarY: 180, usernameY: 340, textY: 100, textAlign: 'center', usernameAlign: 'center' },
        textonly: { avatarX: -999, avatarY: 180, usernameY: 260, textY: 120, textAlign: 'center', usernameAlign: 'center' },
        left: { avatarX: 180, avatarY: 225, usernameX: 450, usernameY: 210, textX: 450, textY: 260, textAlign: 'left', usernameAlign: 'left' },
        right: { avatarX: 844, avatarY: 225, usernameX: 574, usernameY: 210, textX: 574, textY: 260, textAlign: 'right', usernameAlign: 'right' }
    };
    const p = presets[layout];
    if (!p) return;
    Object.keys(p).forEach(k => {
        welcomeImageConfig[k] = p[k];
        const el = document.getElementById(k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()));
        if (el) el.value = p[k];
    });
}

// ===== CANVAS RENDERER =====
const canvas = document.getElementById('welcome-canvas');
const ctx = canvas?.getContext('2d');

function renderWelcomeCanvas() {
    if (!canvas || !ctx) return;
    
    const W = 1024, H = 450;
    ctx.clearRect(0, 0, W, H);
    
    // Loading
    const loading = document.getElementById('canvas-loading');
    if (loading) loading.style.display = 'block';
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        // Background
        ctx.drawImage(img, 0, 0, W, H);
        
        // Overlay
        ctx.fillStyle = `rgba(0,0,0,${welcomeImageConfig.overlayOpacity / 100})`;
        ctx.fillRect(0, 0, W, H);
        
        // Avatar (if visible)
        if (welcomeImageConfig.layout !== 'textonly') {
            drawAvatar(ctx, welcomeImageConfig);
        }
        
        // Text
        drawTextElements(ctx, welcomeImageConfig);
        
        if (loading) loading.style.display = 'none';
    };
    img.onerror = () => {
        // Fallback gradient
        const grad = ctx.createLinearGradient(0,0,W,H);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#16213e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        drawAvatar(ctx, welcomeImageConfig);
        drawTextElements(ctx, welcomeImageConfig);
        if (loading) loading.style.display = 'none';
    };
    img.src = welcomeImageConfig.backgroundUrl;
}

function drawAvatar(ctx, cfg) {
    const x = cfg.avatarX, y = cfg.avatarY, s = cfg.avatarSize;
    if (x < 0) return; // hidden
    
    ctx.save();
    ctx.beginPath();
    if (cfg.avatarShape === 'circle') {
        ctx.arc(x, y, s/2, 0, Math.PI * 2);
    } else if (cfg.avatarShape === 'rounded') {
        roundRect(ctx, x - s/2, y - s/2, s, s, s/8);
    } else {
        ctx.rect(x - s/2, y - s/2, s, s);
    }
    ctx.closePath();
    ctx.lineWidth = cfg.avatarBorder;
    ctx.strokeStyle = cfg.avatarBorderColor;
    ctx.stroke();
    ctx.clip();
    
    // Placeholder avatar
    ctx.fillStyle = '#5865F2';
    ctx.fillRect(x - s/2, y - s/2, s, s);
    ctx.fillStyle = 'white';
    ctx.font = `bold ${s/2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', x, y);
    
    ctx.restore();
}

function drawTextElements(ctx, cfg) {
    ctx.textBaseline = 'middle';
    
    // Custom text (top)
    ctx.font = `bold ${cfg.textSize}px "${cfg.textFont}", sans-serif`;
    ctx.fillStyle = cfg.textColor;
    ctx.textAlign = cfg.textAlign;
    const textX = cfg.textAlign === 'left' ? cfg.textX : (cfg.textAlign === 'right' ? cfg.textX : cfg.textX);
    ctx.fillText(cfg.customText, textX, cfg.textY);
    
    // Username (bottom)
    ctx.font = `bold ${cfg.usernameSize}px "${cfg.usernameFont}", sans-serif`;
    ctx.fillStyle = cfg.usernameColor;
    ctx.textAlign = cfg.usernameAlign;
    const unameX = cfg.usernameAlign === 'left' ? cfg.usernameX : (cfg.usernameAlign === 'right' ? cfg.usernameX : cfg.usernameX);
    ctx.fillText('NomeDoUtilizador', unameX, cfg.usernameY);
    
    // Subtitle
    ctx.font = `500 20px "${cfg.usernameFont}", sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Bem-vindo ao servidor!', unameX, cfg.usernameY + cfg.usernameSize * 0.8);
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
}

// Font loading
const fontsToLoad = [
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'
];

fontsToLoad.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
});

// Initial render
setTimeout(renderWelcomeCanvas, 500);

// ===== SAVE POPUP =====
document.getElementById('save-config')?.addEventListener('click', () => {
    showSavePopup();
});

function showSavePopup() {
    const existing = document.querySelector('.save-popup');
    if (existing) existing.remove();
    
    const popup = document.createElement('div');
    popup.className = 'save-popup';
    popup.innerHTML = `
        <div class="save-popup-content">
            <h3><i class="fas fa-check-circle" style="color: var(--accent-success);"></i> Guardar Configurações</h3>
            <p>As tuas alterações foram guardadas. O ficheiro <code>config.json</code> vai ser descarregado automaticamente.</p>
            <div class="popup-buttons">
                <button class="btn btn-secondary" onclick="this.closest('.save-popup').remove()">Fechar</button>
                <button class="btn btn-primary" id="confirm-download"><i class="fas fa-download"></i> Descarregar JSON</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    
    document.getElementById('confirm-download')?.addEventListener('click', () => {
        const jsonStr = JSON.stringify(config, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.json';
        a.click();
        URL.revokeObjectURL(url);
        popup.remove();
        showToast('Configurações guardadas!', 'success');
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.remove();
    });
}
