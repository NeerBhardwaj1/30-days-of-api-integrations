// State Variables
let selectedImageUrl = '';
let unsplashApiKey = localStorage.getItem('unsplash_api_key') || '';
let currentQuote = { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" };
let isFetchingQuote = false;

// Curated Background Presets
const presets = [
    { id: 1, name: 'Foggy Forest', tag: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Deep Space', tag: 'Stars', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'Mountain Peaks', tag: 'Mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80' },
    { id: 4, name: 'Deep Ocean', tag: 'Ocean', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=150&q=80' },
    { id: 5, name: 'Neon Fluid', tag: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=150&q=80' },
    { id: 6, name: 'Minimal Lamp', tag: 'Minimal', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d2038b5?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1494438639946-1ebd1d2038b5?auto=format&fit=crop&w=150&q=80' },
    { id: 7, name: 'Northern Lights', tag: 'Stars', url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=150&q=80' },
    { id: 8, name: 'Sunset Dunes', tag: 'Nature', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=150&q=80' },
    { id: 9, name: 'Misty Peaks', tag: 'Mountain', url: 'https://images.unsplash.com/photo-1491466424936-e304919aada7?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1491466424936-e304919aada7?auto=format&fit=crop&w=150&q=80' },
    { id: 10, name: 'Sunset Lake', tag: 'Nature', url: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=150&q=80' },
    { id: 11, name: 'City Skyline', tag: 'Minimal', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=150&q=80' },
    { id: 12, name: 'Fluid Texture', tag: 'Abstract', url: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=1200&q=80', thumb: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=150&q=80' }
];

// Offline Fallback Quotes
const fallbackQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
    { text: "What we think, we become.", author: "Buddha" },
    { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Our life is frittered away by detail. Simplify, simplify.", author: "Henry David Thoreau" },
    { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche" },
    { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" }
];

// Initial Setup on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select default image
    selectedImageUrl = presets[0].url;
    
    // Initialize presets grid
    populatePresetsGrid();

    // Check saved API keys
    updateKeyModalStatus();

    // Initialize Lucide Icons
    lucide.createIcons();

    // Trigger initial preview updates
    updatePreview();
});

// Populate Preset Thumbnails
function populatePresetsGrid() {
    const grid = document.getElementById('presetsGrid');
    grid.innerHTML = '';
    
    presets.forEach(preset => {
        const img = document.createElement('img');
        img.src = preset.thumb;
        img.alt = preset.name;
        img.className = 'preset-thumb' + (selectedImageUrl === preset.url ? ' selected' : '');
        img.onclick = () => selectPreset(preset.url, img);
        grid.appendChild(img);
    });
}

// Select a Preset Background Image
function selectPreset(url, element) {
    selectedImageUrl = url;
    
    // Update thumbnail highlights
    document.querySelectorAll('.preset-thumb, .image-thumb-result').forEach(el => {
        el.classList.remove('selected');
    });
    if (element) {
        element.classList.add('selected');
    }
    
    updatePreview();
}

// Select category tag and filter presets
function selectTag(tagName) {
    // Highlight active tag
    document.querySelectorAll('.tag-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.textContent === tagName) {
            pill.classList.add('active');
        }
    });

    // Check if Unsplash Key is configured. If so, trigger Unsplash search for that tag
    if (unsplashApiKey) {
        document.getElementById('imageSearchInput').value = tagName;
        searchImages(tagName);
    } else {
        // If no key, filter local presets and highlight the first one in that category
        const matchingPreset = presets.find(p => p.tag === tagName);
        if (matchingPreset) {
            // Find thumb and click it
            const thumbs = document.querySelectorAll('.preset-thumb');
            const index = presets.indexOf(matchingPreset);
            if (thumbs[index]) {
                thumbs[index].click();
            }
        }
    }
}

// Fetch Random Quote from ZenQuotes (via AllOrigins CORS Proxy)
async function fetchQuote() {
    if (isFetchingQuote) return;
    isFetchingQuote = true;
    
    const btn = document.getElementById('btnFetchQuote');
    const btnText = btn.querySelector('span');
    const originalContent = btn.innerHTML;
    
    btn.disabled = true;
    btnText.textContent = "Connecting ZenQuotes...";
    
    try {
        // Method A: Call ZenQuotes via AllOrigins Proxy
        const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random');
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('AllOrigins response not ok');
        
        const data = await response.json();
        const payload = JSON.parse(data.contents);
        
        if (payload && payload.length > 0) {
            currentQuote.text = payload[0].q;
            currentQuote.author = payload[0].a;
            
            showBanner(false);
            updateFormInputs();
            updatePreview();
            return;
        }
        throw new Error('Invalid ZenQuotes payload');
        
    } catch (e) {
        console.warn('ZenQuotes fetch failed, attempting DummyJSON fallback...', e);
        
        try {
            // Method B: Call DummyJSON API (Direct CORS-ready quotes)
            const response = await fetch('https://dummyjson.com/quotes/random');
            if (!response.ok) throw new Error('DummyJSON response not ok');
            const data = await response.json();
            
            currentQuote.text = data.quote;
            currentQuote.author = data.author;
            
            showBanner(true, "Fetched fallback quotes from DummyJSON (ZenQuotes restricted).");
            updateFormInputs();
            updatePreview();
            return;
            
        } catch (innerErr) {
            console.error('All quote APIs failed. Falling back to local catalog.', innerErr);
            
            // Method C: Pull randomly from local fallback array
            const randomIdx = Math.floor(Math.random() * fallbackQuotes.length);
            currentQuote = fallbackQuotes[randomIdx];
            
            showBanner(true, "Network offline. Displaying curated motivational preset.");
            updateFormInputs();
            updatePreview();
        }
    } finally {
        isFetchingQuote = false;
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// Sync Preview with form inputs
function updateFormInputs() {
    document.getElementById('quoteInput').value = currentQuote.text;
    document.getElementById('authorInput').value = currentQuote.author;
}

// Real-time rendering of options to preview card
function updatePreview() {
    const textInput = document.getElementById('quoteInput').value;
    const authorInput = document.getElementById('authorInput').value;
    const font = document.getElementById('fontFamilySelect').value;
    const color = document.getElementById('textColorInput').value;
    const alignment = document.querySelector('input[name="textAlign"]:checked').value;
    
    // Sliders
    const fontSize = document.getElementById('fontSizeSlider').value;
    const overlayVal = document.getElementById('overlaySlider').value;
    const blurVal = document.getElementById('blurSlider').value;
    const shadowVal = document.getElementById('shadowSlider').value;
    
    // Checkboxes
    const showQuotes = document.getElementById('toggleQuotes').checked;
    const showWatermark = document.getElementById('toggleWatermark').checked;

    // Update form labels
    document.getElementById('textColorVal').textContent = color.toUpperCase();
    document.getElementById('fontSizeVal').textContent = `${fontSize}px`;
    document.getElementById('overlayVal').textContent = `${overlayVal}%`;
    document.getElementById('blurVal').textContent = `${blurVal}px`;
    document.getElementById('shadowVal').textContent = `${shadowVal}px`;

    // Apply styles to card DOM
    const quoteCard = document.getElementById('quoteCard');
    const cardBg = document.getElementById('cardBg');
    const cardOverlay = document.getElementById('cardOverlay');
    const textPreview = document.getElementById('quotePreviewText');
    const authorPreview = document.getElementById('quotePreviewAuthor');
    const quoteMarkTop = document.getElementById('quoteMarkTop');
    const watermark = document.getElementById('cardWatermark');

    // Update Text Content
    textPreview.textContent = textInput || "Keep going. Each step is progress.";
    authorPreview.textContent = authorInput ? `— ${authorInput}` : "";

    // Background Image & Filters
    cardBg.style.backgroundImage = `url('${selectedImageUrl}')`;
    cardBg.style.filter = `blur(${blurVal}px)`;

    // Overlay Opacity
    cardOverlay.style.backgroundColor = `rgba(0, 0, 0, ${overlayVal / 100})`;

    // Text Style
    textPreview.style.fontFamily = font;
    textPreview.style.fontSize = `${fontSize}px`;
    textPreview.style.color = color;
    textPreview.style.textAlign = alignment;
    
    // Text Shadow
    const shadowOffset = Math.max(1, shadowVal / 2);
    textPreview.style.textShadow = shadowVal > 0 
        ? `${shadowOffset}px ${shadowOffset}px ${shadowVal}px rgba(0,0,0,0.8)` 
        : 'none';

    // Author Style
    authorPreview.style.fontFamily = font.includes('Playfair') ? "'Playfair Display', serif" : "'Outfit', sans-serif";
    authorPreview.style.textAlign = alignment;
    authorPreview.style.color = color;
    authorPreview.style.opacity = 0.85;
    authorPreview.style.textShadow = shadowVal > 0 
        ? `${shadowOffset * 0.7}px ${shadowOffset * 0.7}px ${shadowVal * 0.7}px rgba(0,0,0,0.8)` 
        : 'none';

    // Quotes visibility
    if (showQuotes) {
        quoteMarkTop.classList.remove('hidden');
        quoteMarkTop.style.color = color;
    } else {
        quoteMarkTop.classList.add('hidden');
    }

    // Watermark visibility
    if (showWatermark) {
        watermark.classList.remove('hidden');
        watermark.style.color = color;
    } else {
        watermark.classList.add('hidden');
    }
}

// Search Images on Unsplash
async function searchImages(customQuery = '') {
    const query = customQuery || document.getElementById('imageSearchInput').value.trim();
    if (!query) return;

    if (!unsplashApiKey) {
        // Highlight Key Connection Modal if no key is configured
        toggleKeyModal();
        return;
    }

    const grid = document.getElementById('imageResultsGrid');
    const container = document.getElementById('resultsContainer');
    
    container.classList.remove('hidden');
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 12px; color: var(--text-secondary); padding: 20px;">Searching Unsplash...</div>';

    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&client_id=${unsplashApiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Unsplash search failed');
        
        const data = await response.json();
        
        grid.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.urls.thumb;
                img.alt = photo.alt_description || 'Unsplash image';
                img.className = 'image-thumb-result';
                img.onclick = () => selectPreset(photo.urls.regular, img);
                grid.appendChild(img);
            });
        } else {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 12px; color: var(--danger); padding: 20px;">No results found.</div>';
        }
    } catch (e) {
        console.error('Unsplash Search Error', e);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; font-size: 12px; color: var(--danger); padding: 20px;">API Limit exceeded or invalid key.</div>';
    }
}

// Hide custom search results overlay
function hideSearchResults() {
    document.getElementById('resultsContainer').classList.add('hidden');
}

// Handle Enter Key in image search
function handleSearchKey(e) {
    if (e.key === 'Enter') {
        searchImages();
    }
}

// Save API Key in Local Storage
function saveApiKey() {
    const key = document.getElementById('unsplashKeyInput').value.trim();
    if (!key) return;
    
    unsplashApiKey = key;
    localStorage.setItem('unsplash_api_key', key);
    updateKeyModalStatus();
    toggleKeyModal();
    
    // Re-initialize search if they typed a search string
    const query = document.getElementById('imageSearchInput').value.trim();
    if (query) {
        searchImages(query);
    }
}

// Clear API Key from Local Storage
function clearApiKey() {
    unsplashApiKey = '';
    localStorage.removeItem('unsplash_api_key');
    document.getElementById('unsplashKeyInput').value = '';
    updateKeyModalStatus();
    toggleKeyModal();
    hideSearchResults();
}

// Update API key status text in config modal
function updateKeyModalStatus() {
    const textElement = document.getElementById('keyStatusText');
    const inputField = document.getElementById('unsplashKeyInput');
    
    if (unsplashApiKey) {
        inputField.value = unsplashApiKey;
        textElement.className = 'key-status-row status-connected';
        textElement.innerHTML = `<i data-lucide="lock-keyhole"></i> <span>Unsplash API Key Connected. Custom searches enabled!</span>`;
    } else {
        inputField.value = '';
        textElement.className = 'key-status-row';
        textElement.innerHTML = `<i data-lucide="unlock"></i> <span>Currently using Curated Offline Presets.</span>`;
    }
    lucide.createIcons();
}

// Reset Styling parameters to default values
function resetStyles() {
    document.getElementById('fontFamilySelect').value = "'Playfair Display', serif";
    document.getElementById('textColorInput').value = '#ffffff';
    document.querySelector('input[name="textAlign"][value="center"]').checked = true;
    document.getElementById('toggleQuotes').checked = true;
    document.getElementById('toggleWatermark').checked = true;
    
    document.getElementById('fontSizeSlider').value = 24;
    document.getElementById('overlaySlider').value = 45;
    document.getElementById('blurSlider').value = 0;
    document.getElementById('shadowSlider').value = 4;
    
    selectedImageUrl = presets[0].url;
    populatePresetsGrid();
    hideSearchResults();
    updatePreview();
}

// Generate & Download Ultra-HD Image (1080x1080) using Canvas
function downloadCard() {
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');
    
    // Fetch current state parameter values
    const font = document.getElementById('fontFamilySelect').value;
    const color = document.getElementById('textColorInput').value;
    const alignment = document.querySelector('input[name="textAlign"]:checked').value;
    const fontSize = parseInt(document.getElementById('fontSizeSlider').value) * (1080 / 380); // Scaling size for 1080px resolution
    const overlayOpacity = parseFloat(document.getElementById('overlaySlider').value) / 100;
    const blurVal = parseInt(document.getElementById('blurSlider').value);
    const shadowVal = parseInt(document.getElementById('shadowSlider').value) * (1080 / 380);
    
    const showQuotes = document.getElementById('toggleQuotes').checked;
    const showWatermark = document.getElementById('toggleWatermark').checked;
    
    const quoteText = document.getElementById('quoteInput').value || "Keep going. Each step is progress.";
    const authorText = document.getElementById('authorInput').value ? `— ${document.getElementById('authorInput').value}` : "";

    // Draw solid color loader state in case background image fails loading
    ctx.fillStyle = '#060a13';
    ctx.fillRect(0, 0, 1080, 1080);
    
    // Draw background image
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous'; // Enable CORS handling for canvas download
    
    bgImg.onload = function() {
        // Calculate center-crop dimensions (object-fit: cover implementation on canvas)
        const aspect = bgImg.width / bgImg.height;
        let sx, sy, sWidth, sHeight;
        
        if (aspect > 1) { // Landscape
            sHeight = bgImg.height;
            sWidth = bgImg.height;
            sx = (bgImg.width - sWidth) / 2;
            sy = 0;
        } else { // Portrait / Square
            sWidth = bgImg.width;
            sHeight = bgImg.width;
            sx = 0;
            sy = (bgImg.height - sHeight) / 2;
        }
        
        // Draw background
        ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, 1080, 1080);
        
        // Draw blur overlay manually or via filter if blur value > 0
        if (blurVal > 0) {
            // Apply a simple blur filter. Note: Canvas blur filter works on modern environments.
            // In case it's not supported, canvas still exports cleanly.
            ctx.filter = `blur(${blurVal * (1080 / 380)}px)`;
            ctx.drawImage(canvas, 0, 0);
            ctx.filter = 'none'; // reset filter
        }

        // Draw Dark Semi-transparent Overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
        ctx.fillRect(0, 0, 1080, 1080);

        // Draw Text Elements
        ctx.fillStyle = color;
        
        // Setup shadow parameters
        if (shadowVal > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = shadowVal;
            ctx.shadowOffsetX = shadowVal * 0.4;
            ctx.shadowOffsetY = shadowVal * 0.4;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // 1. Draw Opening Quote Mark
        if (showQuotes) {
            ctx.font = `italic bold 100px 'Playfair Display', serif`;
            ctx.textAlign = 'center';
            ctx.fillText('“', 540, 260);
        }

        // 2. Draw Quote text (with manual wrapping)
        // Clean font parameters for typography rendering
        let canvasFont = font;
        // Strip quotes or custom weights to match canvas font definitions
        if (canvasFont.includes('Playfair')) canvasFont = "'Playfair Display'";
        if (canvasFont.includes('Outfit')) canvasFont = "'Outfit'";
        if (canvasFont.includes('Montserrat')) canvasFont = "'Montserrat'";
        if (canvasFont.includes('Courier')) canvasFont = "'Courier Prime'";
        if (canvasFont.includes('Caveat')) canvasFont = "'Caveat'";

        ctx.font = `500 ${fontSize}px ${canvasFont}`;
        ctx.textAlign = alignment;
        
        const maxWidth = 860; // Leave margin on both sides
        const lineHeight = fontSize * 1.45;
        const lines = wrapText(ctx, quoteText, maxWidth);
        
        // Calculate vertical alignment bounds
        const textBlockHeight = lines.length * lineHeight;
        const centerYOffset = 520 - (textBlockHeight / 2);
        
        // Horizontal text position coordinates based on alignment
        let textX = 540; // Center
        if (alignment === 'left') textX = 110;
        if (alignment === 'right') textX = 970;

        lines.forEach((line, index) => {
            const lineY = centerYOffset + (index * lineHeight);
            ctx.fillText(line, textX, lineY);
        });

        // 3. Draw Author
        if (authorText) {
            let authorFont = font.includes('Playfair') ? "'Playfair Display'" : "'Outfit'";
            ctx.font = `bold ${fontSize * 0.6}px ${authorFont}`;
            ctx.textAlign = alignment;
            
            const authorY = centerYOffset + textBlockHeight + 40;
            ctx.fillText(authorText, textX, authorY);
        }

        // 4. Draw Watermark
        if (showWatermark) {
            ctx.shadowColor = 'transparent'; // Remove shadow for watermark
            ctx.font = `700 24px 'Outfit'`;
            ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
            ctx.textAlign = 'right';
            ctx.fillText('30 Days of APIs • Day 05', 980, 1020);
        }

        // Export Canvas to browser download link
        triggerDownload(canvas);
    };

    // Handle Image Load Errors
    bgImg.onerror = function() {
        console.error('Failed to load background image for canvas render. Fetching direct fallback.');
        // Draw solid background color with elegant gradient
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, '#100a20');
        gradient.addColorStop(1, '#05101a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);

        // Re-draw text layers directly
        ctx.fillStyle = color;
        ctx.font = `500 ${fontSize}px 'Outfit'`;
        ctx.textAlign = alignment;
        
        let textX = 540;
        if (alignment === 'left') textX = 110;
        if (alignment === 'right') textX = 970;

        const maxWidth = 860;
        const lineHeight = fontSize * 1.45;
        const lines = wrapText(ctx, quoteText, maxWidth);
        const textBlockHeight = lines.length * lineHeight;
        const centerYOffset = 520 - (textBlockHeight / 2);

        lines.forEach((line, index) => {
            ctx.fillText(line, textX, centerYOffset + (index * lineHeight));
        });

        if (authorText) {
            ctx.font = `bold ${fontSize * 0.6}px 'Outfit'`;
            ctx.fillText(authorText, textX, centerYOffset + textBlockHeight + 40);
        }

        if (showWatermark) {
            ctx.font = `700 24px 'Outfit'`;
            ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
            ctx.textAlign = 'right';
            ctx.fillText('30 Days of APIs • Day 05', 980, 1020);
        }

        triggerDownload(canvas);
    };

    // Append a timestamp/random query parameter to the image source to completely bypass browser caching (and potential CORS cache issue)
    bgImg.src = selectedImageUrl + (selectedImageUrl.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
}

// Helper to trigger download from canvas
function triggerDownload(canvas) {
    try {
        const link = document.createElement('a');
        link.download = `quote-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Canvas export blocked by cross-origin security rules. Triggering screenshot mode.", e);
        alert("Downloading block: Unsplash cross-origin policy. Double check your internet access or try setting your custom API key.");
    }
}

// Text wrap helper function for canvas text rendering
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// UI Modals Toggles
function toggleApiModal() {
    document.getElementById('apiModal').classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}

function toggleKeyModal() {
    document.getElementById('keyModal').classList.toggle('hidden');
    if (!document.getElementById('keyModal').classList.contains('hidden')) {
        updateKeyModalStatus();
    }
}

function closeKeyModalOutside(e) {
    if (e.target.id === 'keyModal') {
        toggleKeyModal();
    }
}

// Notification Banner Manager
function showBanner(show, text = "") {
    const banner = document.getElementById('statusBanner');
    if (show) {
        document.getElementById('bannerText').textContent = text;
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

function closeBanner() {
    document.getElementById('statusBanner').classList.add('hidden');
}
