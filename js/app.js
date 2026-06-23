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
