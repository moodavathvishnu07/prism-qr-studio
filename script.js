document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const qrInput = document.getElementById('qr-input');
    const dotStyle = document.getElementById('dot-style');
    const cornerStyle = document.getElementById('corner-style');
    const fgColor = document.getElementById('fg-color');
    const bgColor = document.getElementById('bg-color');
    const fgSwatch = document.getElementById('fg-swatch');
    const bgSwatch = document.getElementById('bg-swatch');
    const qrCanvas = document.getElementById('qr-canvas');
    const templatesGrid = document.getElementById('templates-grid');
    const footerText = document.getElementById('footer-text');
    const showLabelIcon = document.getElementById('show-label-icon');
    const showCenterLogo = document.getElementById('show-center-logo');
    const labelPosition = document.getElementById('label-position');
    const qrHeader = document.getElementById('qr-header-label');
    const qrFooter = document.getElementById('qr-footer-label');
    const smartUPIBranding = document.getElementById('smart-upi-branding');
    const galleryBtn = document.getElementById('gallery-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const closeGallery = document.getElementById('close-gallery');
    const logoGalleryGrid = document.getElementById('logo-gallery-grid');
    
    // --- Background AI Logic ---
    const bgAI = {
        updateTimeout: null,
        assetCache: new Map(),
        preFetch: (url) => {
            if (!bgAI.assetCache.has(url)) {
                const img = new Image();
                img.src = url;
                bgAI.assetCache.set(url, img);
            }
        }
    };

    // --- State ---
    let currentLogo = null;
    let currentBrand = 'none';

    // --- Template Definitions (Premium Curation) ---
    const templates = [
        { name: "Minimalist", fg: "#000000", bg: "#FFFFFF", dots: "dots", corners: "dot" },
        { name: "Midnight Pro", fg: "#FFFFFF", bg: "#000000", dots: "dots", corners: "extra-rounded" },
        { name: "Inverted Slate", fg: "#000000", bg: "#F8FAFC", dots: "square", corners: "square" },
        { name: "Pure Tech", fg: "#FFFFFF", bg: "#000000", dots: "square", corners: "square" },
        { name: "Luxury Gold", fg: "#D4AF37", bg: "#050505", dots: "classy", corners: "square" },
        { name: "Prism Cyan", fg: "#00D1FF", bg: "#FFFFFF", dots: "dots", corners: "dot" },
        { name: "Cyber Lime", fg: "#00FF85", bg: "#0A0A0A", dots: "square", corners: "square" },
        { name: "Emerald", fg: "#10B981", bg: "#064E3B", dots: "rounded", corners: "dot" },
        { name: "Rose Gold", fg: "#F472B6", bg: "#FFF1F2", dots: "dots", corners: "extra-rounded" },
        { name: "Oceanic", fg: "#3B82F6", bg: "#EFF6FF", dots: "classy", corners: "dot" },
        { name: "Stealth Slate", fg: "#94A3B8", bg: "#0F172A", dots: "square", corners: "square" },
        { name: "Crimson", fg: "#E11D48", bg: "#000000", dots: "rounded", corners: "square" },
        { name: "Neon Violet", fg: "#9D00FF", bg: "#050505", dots: "rounded", corners: "extra-rounded" },
        { name: "Indigo Night", fg: "#6366F1", bg: "#000000", dots: "classy", corners: "dot" },
        { name: "Sahara", fg: "#F59E0B", bg: "#FFFBEB", dots: "dots", corners: "extra-rounded" },
        { name: "Electric Blue", fg: "#2563EB", bg: "#FFFFFF", dots: "square", corners: "square" },
        { name: "Vivid Pink", fg: "#DB2777", bg: "#000000", dots: "rounded", corners: "dot" },
        { name: "Forest Glass", fg: "#059669", bg: "#FFFFFF", dots: "dots", corners: "extra-rounded" },
        { name: "Royal Slate", fg: "#1E293B", bg: "#F8FAFC", dots: "classy", corners: "square" },
        { name: "Amber Tech", fg: "#D97706", bg: "#000000", dots: "square", corners: "dot" }
    ];

    // --- QR Engine ---
    const qr = new QRCodeStyling({
        width: 500,
        height: 500,
        data: "https://qrgenpro.com",
        dotsOptions: { color: "#00D1FF", type: "dots" },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { crossOrigin: "anonymous", margin: 12 },
        cornersSquareOptions: { type: "dot", color: "#00D1FF" },
        cornersDotOptions: { type: "dot", color: "#00D1FF" }
    });

    // --- Core Update ---
    function updateQR() {
        const raw = qrInput.value.trim() || "https://qrgenpro.com";
        const processed = processInput(raw);
        
        // Auto-Toggle Logo Version
        if (currentBrand === 'none') {
            currentLogo = null;
        } else if (currentBrand !== 'custom') {
            const isBgLight = isLight(bgColor.value);
            const logoTheme = isBgLight ? 'black' : 'white';
            
            const bAndWLogos = {
                'instagram': {
                    white: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
                    black: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg' 
                },
                'twitter': {
                    white: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOC45MDEgMS4xNTNoMy42OHwtOC4wMzUgOS4xODRMMjQgMjIuODQ2aC03LjQwNmwtNS43OS03LjU3OC02LjYzOSA3LjU3OEgxLjM5NWw4LjU5LTkuODE0TDAgMS4xNTNoNy41OTRsNS4yMjcgNi44NTYgNi4wOC02Ljg1NlpNMTcuNjEgMjAuNjQ0aDIuMDM5TDYuNDg2IDMuMjQ3SDQuMjk4bDEzLjMxMiAxNy4zOTdaIi8+PC9zdmc+',
                    black: 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg'
                },
                'linkedin': {
                    white: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyVjE0LjIyMmMwLTIuOTQ2LS42MzMtNS4yMTgtNC4wNy01LjIxOC0xLjY1MyAwLTIuNzU3LjkxLTEuMzI0IDEuNjk0aC0uMDQ2VjguOTlIOi44MjF2MTEuNDYyaDMuOTgyVjE0LjE0YzAtMS42NjUuMzE1LTMuMjgxIDIuMzc3LTMuMjgxIDIuMDQxIDAgMi4wNzQgMS45MDggMi4wNzQgMy4zODV2Ni4yMDhoMy45ODN6TTEuOTY0IDguOTloMy45ODJ2MTEuNDYySDEuOTY0eiIvPjxjaXJjbGUgY3g9IjMuOTU1IiBjeT0iNC4wMDUiIHI9IjIuMzEzIi8+PC9zdmc+',
                    black: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
                },
                'youtube': {
                    white: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMy40OTggNi4xODZjLS4yNzItMS4wMjktMS4wODEtMS44MzgtMi4xMS0yLjExQzE5LjUyNSA0IDEyIDQgMTIgNHMtNy41MjUgMC05LjM4OC41NzdjLTEuMDMuMjcyLTEuODM4IDEuMDgxLTIuMTEgMi4xMUMwIDguMDUxIDAgMTIgMCAxMnMwIDMuOTQ5LjU3NyA1LjgxNGMuMjcyIDEuMDMgMS4wODEgMS44MzggMi4xMSAyLjExQzQuNDc1IDIwIDEyIDIwIDEyIDIwczcuNTI1IDAgOS4zODgtLjU3N2MxLjAzLS4yNzIgMS44MzgtMS4wODEgMi4xMS0yLjExQzI0IDE1Ljk0OSAyNCAxMiAyNCAxMnMwLTMuOTQ5LS41NzctNS44MTR6TTkuNTk2IDE1LjU2OFY4LjQzMkwxNS44MTEgMTJsLTYuMjE1IDMuNTY4eiIvPjwvc3ZnPg==',
                    black: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siPjxwYXRoIGQ9Ik0yMy40OTggNi4xODZjLS4yNzItMS4wMjktMS4wODEtMS44MzgtMi4xMS0yLjExQzE5LjUyNSA0IDEyIDQgMTIgNHMtNy41MjUgMC05LjM4OC41NzdjLTEuMDMuMjcyLTEuODM4IDEuMDgxLTIuMTEgMi4xMUMwIDguMDUxIDAgMTIgMCAxMnMwIDMuOTQ5LjU3NyA1LjgxNGMuMjcyIDEuMDMgMS4wODEgMS44MzggMi4xMSAyLjExQzQuNDc1IDIwIDEyIDIwIDEyIDIwczcuNTI1IDAgOS4zODgtLjU3N2MxLjAzLS4yNzIgMS44MzgtMS4wODEgMi4xMS0yLjExQzI0IDE1Ljk0OSAyNCAxMiAyNCAxMnMwLTMuOTQ5LS41NzctNS44MTR6TTkuNTk2IDE1LjU2OFY4LjQzMkwxNS44MTEgMTJsLTYuMjE1IDMuNTY4eiIvPjwvc3ZnPg=='
                },
                'upi': {
                    white: "", 
                    black: ""
                }
            };
            
            // Smart UPI Intelligence (Ported from Python upi_intelligence.py)
            if (currentBrand === 'upi' && smartUPIBranding.checked) {
                currentLogo = null; // Default to NONE if not matched
                const vpa = raw.toLowerCase();
                if (vpa.includes('@ybl') || vpa.includes('@ibl') || vpa.includes('@axl')) {
                    currentLogo = 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg';
                } else if (vpa.includes('@paytm') || vpa.includes('@ptm')) {
                    currentLogo = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Paytm_logo.png';
                } else if (vpa.includes('@okaxis') || vpa.includes('@okicici') || vpa.includes('@oksbi') || vpa.includes('@okhdfcbank')) {
                    currentLogo = 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg';
                }
            } else if (bAndWLogos[currentBrand]) {
                currentLogo = bAndWLogos[currentBrand][logoTheme];
            }
        }
        
        // Asynchronous update for smoothness
        // Final Logo check
        const finalLogo = showCenterLogo.checked ? currentLogo : null;

        // High-Precision Payment Mode (Forces "Perfect QR" standards)
        const isUPIPayment = currentBrand === 'upi';
        const finalFG = isUPIPayment ? '#000000' : fgColor.value;
        const finalBG = isUPIPayment ? '#FFFFFF' : bgColor.value;
        const finalDots = isUPIPayment ? 'square' : dotStyle.value;
        const finalCorners = isUPIPayment ? 'square' : cornerStyle.value;

        // Validation: Prevent Blank QR (FG/BG collision)
        let safeFG = finalFG;
        if (finalFG.toLowerCase() === finalBG.toLowerCase()) {
            safeFG = isLight(finalBG) ? '#000000' : '#FFFFFF';
        }

        try {
            qr.update({
                data: processed || "https://qrgenpro.com",
                dotsOptions: { color: safeFG, type: finalDots },
                backgroundOptions: { color: finalBG },
                imageOptions: {
                    hideBackgroundDots: isUPIPayment ? false : true,
                    imageSize: isUPIPayment ? 0.08 : 0.3,
                    margin: 5
                },
                cornersSquareOptions: { type: finalCorners, color: safeFG },
                cornersDotOptions: { type: finalCorners, color: safeFG },
                image: finalLogo || "", 
                qrOptions: { errorCorrectionLevel: 'H' }
            });
        } catch (e) {
            console.error("QR Update Error:", e);
        }

        // Footer/Header Label Live Sync
        const isTop = (labelPosition && labelPosition.value === 'top');
        const activeContainer = isTop ? qrHeader : qrFooter;
        const inactiveContainer = isTop ? qrFooter : qrHeader;

        inactiveContainer.style.display = 'none';

        if (footerText.value.trim()) {
            activeContainer.style.display = 'flex';
            const textEl = activeContainer.querySelector('.label-text');
            const iconEl = activeContainer.querySelector('.label-icon');
            
            textEl.textContent = footerText.value.toUpperCase();
            textEl.style.color = finalFG;
            
            if (showLabelIcon.checked && currentLogo) {
                iconEl.src = currentLogo;
                iconEl.style.display = 'block';
            } else {
                iconEl.style.display = 'none';
            }
        } else {
            activeContainer.style.display = 'none';
        }
        
        // Update Swatches & Dynamic Glow
        fgSwatch.style.background = fgColor.value;
        fgSwatch.textContent = fgColor.value.toUpperCase();
        fgSwatch.style.color = isLight(fgColor.value) ? '#000' : '#fff';
        
        bgSwatch.style.background = bgColor.value;
        bgSwatch.textContent = bgColor.value.toUpperCase();
        bgSwatch.style.color = isLight(bgColor.value) ? '#000' : '#fff';

        // Dynamic Glow & Frame Compatibility
        const frame = document.querySelector('.qr-frame');
        if (frame) {
            frame.style.setProperty('--prism-color', fgColor.value);
            frame.style.background = bgColor.value; // Frame matches QR background
        }
    }

    function processInput(text) {
        if (!text) return "https://qrgenpro.com";
        
        // UPI Detection Logic
        const upiHandles = ['@okaxis', '@paytm', '@ybl', '@okicici', '@oksbi', '@upl', '@axl', '@ibl', '@fam'];
        const isUPI = upiHandles.some(h => text.toLowerCase().endsWith(h)) || (currentBrand === 'upi' && text.includes('@'));
        
        if (isUPI) {
            let vpa = text.trim();
            if (vpa.startsWith('@')) vpa = vpa.slice(1);
            // UPI Standard: pa=VPA, pn=Name (using 'Payee' as safe default), cu=INR
            return `upi://pay?pa=${vpa}&pn=Payee&cu=INR`;
        }

        if (text.startsWith('@')) {
            const handle = text.slice(1);
            if (currentBrand === 'twitter') return `https://twitter.com/${handle}`;
            if (currentBrand === 'youtube') return `https://youtube.com/@${handle}`;
            if (currentBrand === 'linkedin') return `https://linkedin.com/in/${handle}`;
            return `https://instagram.com/${handle}`;
        }
        return text;
    }

    function isLight(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155;
    }

    // --- Templates Rendering ---
    function initTemplates() {
        templates.forEach((t, i) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview" id="tpl-pre-${i}"></div>
                <div class="template-name">${t.name}</div>
            `;
            templatesGrid.appendChild(card);

            const previewDiv = card.querySelector('.template-preview');
            previewDiv.style.background = t.bg; // Match template background
            
            const tplQr = new QRCodeStyling({
                width: 150,
                height: 150,
                data: "https://qrgenpro.com",
                dotsOptions: { color: t.fg, type: t.dots },
                backgroundOptions: { color: t.bg },
                cornersSquareOptions: { type: t.corners, color: t.fg },
                cornersDotOptions: { type: t.corners, color: t.fg }
            });
            tplQr.append(document.getElementById(`tpl-pre-${i}`));

            card.addEventListener('click', () => {
                // Clear active states
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                fgColor.value = t.fg;
                bgColor.value = t.bg;
                dotStyle.value = t.dots;
                cornerStyle.value = t.corners;
                updateQR();
                window.scrollTo({ top: document.querySelector('.studio').offsetTop - 50, behavior: 'smooth' });
            });
        });
    }

    // --- Listeners ---
    [dotStyle, cornerStyle, fgColor, bgColor, footerText, showLabelIcon, showCenterLogo, labelPosition, smartUPIBranding].forEach(el => {
        el.addEventListener('input', () => {
            // Background AI: Smart Debouncing for Performance
            clearTimeout(bgAI.updateTimeout);
            bgAI.updateTimeout = setTimeout(() => updateQR(), 100);
        });
    });

    qrInput.addEventListener('input', () => {
        const text = qrInput.value.trim().toLowerCase();
        
        // Background AI: Asset Pre-fetching
        if (text.includes('instagram')) bgAI.preFetch('https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png');
        if (text.includes('twitter') || text.includes('x.com')) bgAI.preFetch('https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg');

        // Background AI: Smart Debouncing
        clearTimeout(bgAI.updateTimeout);
        bgAI.updateTimeout = setTimeout(() => {
            // Auto-Detection Logic
            let detectedBrand = null;
            const upiHandles = ['@okaxis', '@paytm', '@ybl', '@okicici', '@oksbi', '@upl', '@axl', '@ibl', '@apl', '@pingpay', '@axisbank', '@icici', '@hdfcbank', '@idbi', '@sbi', '@kotak'];
            
            if (text.includes('instagram.com')) detectedBrand = 'instagram';
            else if (text.includes('twitter.com') || text.includes('x.com')) detectedBrand = 'twitter';
            else if (text.includes('linkedin.com')) detectedBrand = 'linkedin';
            else if (text.includes('youtube.com') || text.includes('youtu.be')) detectedBrand = 'youtube';
            else if (upiHandles.some(h => text.endsWith(h))) detectedBrand = 'upi';

            if (detectedBrand && currentBrand !== 'custom') {
                currentBrand = detectedBrand;
                if (detectedBrand === 'upi') {
                    dotStyle.value = 'square';
                    cornerStyle.value = 'square';
                }
                document.querySelectorAll('.brand-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.brand === currentBrand);
                });
            }
            updateQR();
        }, 80);
    });

    fgSwatch.addEventListener('click', () => fgColor.click());
    bgSwatch.addEventListener('click', () => bgColor.click());

    // Brand Buttons
    document.querySelectorAll('.brand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBrand = btn.dataset.brand;
            updateQR();
        });
    });

    // --- Logo Gallery ---
    const galleryLogos = [
        { name: "Facebook", url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" },
        { name: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
        { name: "Telegram", url: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" },
        { name: "TikTok", url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg" },
        { name: "Snapchat", url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Snapchat-logo.png" },
        { name: "GitHub", url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
        { name: "Discord", url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Discord_Color_Logo.svg" },
        { name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
        { name: "Twitch", url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg" },
        { name: "Pinterest", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" }
    ];

    function initGallery() {
        logoGalleryGrid.innerHTML = '';
        galleryLogos.forEach(logo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.cssText = `
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: var(--radius-lg);
                padding: 1.25rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            item.innerHTML = `
                <img src="${logo.url}" style="width: 32px; height: 32px; object-fit: contain;">
                <span style="font-size: 0.65rem; opacity: 0.6; font-weight: 600;">${logo.name}</span>
            `;
            item.addEventListener('mouseover', () => {
                item.style.background = 'rgba(255,255,255,0.1)';
                item.style.borderColor = 'var(--accent-blue)';
                item.style.transform = 'translateY(-2px)';
            });
            item.addEventListener('mouseout', () => {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.borderColor = 'var(--border)';
                item.style.transform = 'translateY(0)';
            });
            item.addEventListener('click', () => {
                currentLogo = logo.url;
                currentBrand = 'custom';
                document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
                updateQR();
                galleryModal.style.display = 'none';
            });
            logoGalleryGrid.appendChild(item);
        });
    }

    galleryBtn.addEventListener('click', () => {
        galleryModal.style.display = 'flex';
        initGallery();
    });

    closeGallery.addEventListener('click', () => {
        galleryModal.style.display = 'none';
    });

    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) galleryModal.style.display = 'none';
    });

    // Custom Logo Upload
    const logoUpload = document.getElementById('logo-upload');
    const uploadBtn = document.getElementById('upload-btn');

    uploadBtn.addEventListener('click', () => logoUpload.click());

    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentLogo = event.target.result;
                currentBrand = 'custom';
                document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
                updateQR();
            };
            reader.readAsDataURL(file);
        }
    });

    // Downloads
    document.getElementById('dl-png').addEventListener('click', () => {
        qr.download({ name: "prism-qr", extension: "png" });
    });

    document.getElementById('dl-svg').addEventListener('click', () => {
        qr.download({ name: "prism-qr", extension: "svg" });
    });

    // --- Start ---
    // Custom Select Component System
    function initCustomSelects() {
        const selects = document.querySelectorAll('select');
        
        selects.forEach(select => {
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            trigger.innerHTML = `<span>${select.options[select.selectedIndex].text}</span><i class="fas fa-chevron-down"></i>`;
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'custom-options';
            
            Array.from(select.options).forEach((opt, idx) => {
                const customOption = document.createElement('div');
                customOption.className = 'custom-option';
                if (idx === select.selectedIndex) customOption.classList.add('selected');
                customOption.textContent = opt.text;
                customOption.dataset.value = opt.value;
                
                customOption.onclick = () => {
                    select.value = opt.value;
                    trigger.querySelector('span').textContent = opt.text;
                    optionsContainer.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                    customOption.classList.add('selected');
                    optionsContainer.classList.remove('show');
                    
                    // Trigger change event for QR update
                    select.dispatchEvent(new Event('change'));
                };
                
                optionsContainer.appendChild(customOption);
            });
            
            trigger.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.custom-options').forEach(c => {
                    if (c !== optionsContainer) c.classList.remove('show');
                });
                optionsContainer.classList.toggle('show');
            };
            
            wrapper.appendChild(trigger);
            wrapper.appendChild(optionsContainer);
            select.parentNode.insertBefore(wrapper, select);
        });
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-options').forEach(c => c.classList.remove('show'));
        });
    }

    // --- Start ---
    initTemplates();
    initCustomSelects(); // Universal Theme Patch
    qr.append(qrCanvas); // Initialize once
    
    // Initial Load - Set "Inverted Slate" as Default
    const defaultIndex = templates.findIndex(t => t.name === "Inverted Slate");
    const defaultTemplate = defaultIndex !== -1 ? templates[defaultIndex] : templates[0];
    
    // Mark as active in UI
    const allCards = document.querySelectorAll('.template-card');
    if (allCards[defaultIndex !== -1 ? defaultIndex : 0]) {
        allCards[defaultIndex !== -1 ? defaultIndex : 0].classList.add('active');
    }

    fgColor.value = defaultTemplate.fg;
    bgColor.value = defaultTemplate.bg;
    dotStyle.value = defaultTemplate.dots;
    cornerStyle.value = defaultTemplate.corners;
    updateQR();

    function isLight(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155;
    }
});
