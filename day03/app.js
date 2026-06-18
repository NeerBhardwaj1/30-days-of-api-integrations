/**
 * Day 03: Crypto Prices & Fiat Converter
 * Core logic for fetching CoinGecko cryptocurrency statistics,
 * retrieving Frankfurter fiat exchange rates, managing offline caches,
 * rendering SVG trend sparklines, and performing conversion calculations.
 */

// State variables
let cryptoData = [];
let fiatRates = {};
let selectedCryptoId = 'bitcoin';
let conversionMode = 'cryptoToFiat'; // 'cryptoToFiat' or 'fiatToCrypto'

// Refresh Cooldown variables
const COOLDOWN_TIME = 15; // 15 seconds cooldown
let cooldownTimer = 0;
let cooldownInterval = null;

// Currency definitions for formatting
const fiatDefinitions = {
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
    GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    CHF: { symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    MXN: { symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' }
};

// Hardcoded fallbacks in case APIs are completely unreachable and no cache is available
const fallbackCryptoData = [
    {
        id: "bitcoin", symbol: "btc", name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 67452.12, market_cap: 1320491029102, market_cap_rank: 1,
        high_24h: 68120.50, low_24h: 66890.10, price_change_percentage_24h: 1.45,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 66000 + Math.sin(i / 10) * 800 + i * 8) }
    },
    {
        id: "ethereum", symbol: "eth", name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 3521.80, market_cap: 422019482910, market_cap_rank: 2,
        high_24h: 3612.00, low_24h: 3490.40, price_change_percentage_24h: -1.25,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 3620 - Math.sin(i / 15) * 60 - i * 0.7) }
    },
    {
        id: "solana", symbol: "sol", name: "Solana",
        image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        current_price: 142.60, market_cap: 65120392019, market_cap_rank: 5,
        high_24h: 145.20, low_24h: 135.10, price_change_percentage_24h: 5.12,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 135 + Math.sin(i / 8) * 4 + i * 0.05) }
    },
    {
        id: "ripple", symbol: "xrp", name: "Ripple",
        image: "https://assets.coingecko.com/coins/images/44/large/xrp.png",
        current_price: 0.4852, market_cap: 26912304910, market_cap_rank: 8,
        high_24h: 0.4910, low_24h: 0.4790, price_change_percentage_24h: 0.15,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 0.48 + Math.cos(i / 12) * 0.005) }
    },
    {
        id: "cardano", symbol: "ada", name: "Cardano",
        image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        current_price: 0.3824, market_cap: 13651239102, market_cap_rank: 10,
        high_24h: 0.3990, low_24h: 0.3780, price_change_percentage_24h: -2.31,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 0.395 - Math.sin(i / 20) * 0.005 - i * 0.0001) }
    },
    {
        id: "dogecoin", symbol: "doge", name: "Dogecoin",
        image: "https://assets.coingecko.com/coins/images/325/large/dogecoin.png",
        current_price: 0.1245, market_cap: 17923481029, market_cap_rank: 9,
        high_24h: 0.1280, low_24h: 0.1080, price_change_percentage_24h: 12.80,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 0.108 + Math.sin(i / 6) * 0.005 + i * 0.0001) }
    },
    {
        id: "polkadot", symbol: "dot", name: "Polkadot",
        image: "https://assets.coingecko.com/coins/images/12171/large/polkadot-new.png",
        current_price: 5.82, market_cap: 8291039481, market_cap_rank: 14,
        high_24h: 5.95, low_24h: 5.76, price_change_percentage_24h: -0.80,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 5.92 - Math.sin(i / 14) * 0.08) }
    },
    {
        id: "chainlink", symbol: "link", name: "Chainlink",
        image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
        current_price: 14.15, market_cap: 8320491028, market_cap_rank: 13,
        high_24h: 14.35, low_24h: 13.80, price_change_percentage_24h: 1.67,
        sparkline_in_7d: { price: Array.from({length: 168}, (_, i) => 13.8 + Math.cos(i / 10) * 0.15 + i * 0.002) }
    }
];

const fallbackFiatRates = {
    USD: 1.0,
    EUR: 0.9312,
    GBP: 0.7895,
    JPY: 157.42,
    AUD: 1.5034,
    CAD: 1.3725,
    CHF: 0.8911,
    CNY: 7.2560,
    INR: 83.5420,
    MXN: 18.4310
};

// Initialize Dashboard
async function initDashboard() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const dashboardContent = document.getElementById('dashboardContent');

    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    dashboardContent.classList.add('hidden');

    try {
        await loadMarketRates();

        // Reveal dashboard layout
        loadingState.classList.add('hidden');
        dashboardContent.classList.remove('hidden');

        // Render contents
        renderCryptoList();
        selectCryptoItem(selectedCryptoId);
        initializeCalculators();
        
        // Setup icons
        lucide.createIcons();

        // Check if there is an active cooldown from previous sessions
        checkCooldownRestore();

    } catch (err) {
        console.error(err);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        document.getElementById('errorMessage').textContent = err.message || "An unexpected network error occurred.";
    }
}

// Load cryptocurrency and fiat rates (with offline cache support)
async function loadMarketRates() {
    let cryptoSuccess = false;
    let fiatSuccess = false;

    // 1. Fetch Crypto Prices
    try {
        const cryptoResponse = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin,polkadot,chainlink&order=market_cap_desc&sparkline=true&price_change_percentage=24h'
        );
        
        if (cryptoResponse.ok) {
            cryptoData = await cryptoResponse.json();
            // Cache successful response
            localStorage.setItem('day03_cached_crypto', JSON.stringify(cryptoData));
            cryptoSuccess = true;
        } else if (cryptoResponse.status === 429) {
            console.warn("CoinGecko API Rate Limit hit. Looking for cache...");
        } else {
            console.warn(`CoinGecko request failed with status: ${cryptoResponse.status}`);
        }
    } catch (e) {
        console.warn("CoinGecko network request failed:", e);
    }

    // 2. Fetch Fiat Exchange Rates
    try {
        const fiatResponse = await fetch('https://api.frankfurter.dev/v2/latest?base=USD');
        if (fiatResponse.ok) {
            const data = await fiatResponse.json();
            fiatRates = data.rates;
            fiatRates['USD'] = 1.0; // Anchor base rate
            // Cache successful response
            localStorage.setItem('day03_cached_fiat', JSON.stringify(fiatRates));
            fiatSuccess = true;
        } else {
            console.warn(`Frankfurter request failed with status: ${fiatResponse.status}`);
        }
    } catch (e) {
        // Fallback domain if primary is down
        try {
            console.warn("Primary Frankfurter failed, trying fallback...");
            const fallbackResponse = await fetch('https://api.frankfurter.app/latest?base=USD');
            if (fallbackResponse.ok) {
                const data = await fallbackResponse.json();
                fiatRates = data.rates;
                fiatRates['USD'] = 1.0;
                localStorage.setItem('day03_cached_fiat', JSON.stringify(fiatRates));
                fiatSuccess = true;
            }
        } catch (fbErr) {
            console.warn("Frankfurter fallback request failed:", fbErr);
        }
    }

    // 3. Fallback resolution logic
    const cachedCrypto = localStorage.getItem('day03_cached_crypto');
    const cachedFiat = localStorage.getItem('day03_cached_fiat');
    const cacheTime = localStorage.getItem('day03_cached_time') || new Date().toISOString();

    if (cryptoSuccess && fiatSuccess) {
        // Successful API load
        localStorage.setItem('day03_cached_time', new Date().toISOString());
        hideBanner();
    } else {
        // Some part failed, retrieve cache or hardcode fallback
        if (cachedCrypto && cachedFiat) {
            cryptoData = JSON.parse(cachedCrypto);
            fiatRates = JSON.parse(cachedFiat);
            showBanner(`Using cached market data (recorded: ${formatDateTime(cacheTime)}). API rate limits reached.`, 'warning');
        } else {
            // No cache available, load static mock datasets so application still functions elegantly
            cryptoData = fallbackCryptoData;
            fiatRates = fallbackFiatRates;
            showBanner("Network connectivity issues. Currently displaying simulated/cached prices.", 'alert-triangle');
        }
    }
}

// Render the cryptocurrency item rows
function renderCryptoList() {
    const listContainer = document.getElementById('cryptoList');
    listContainer.innerHTML = '';

    cryptoData.forEach(coin => {
        const price = coin.current_price;
        const change = coin.price_change_percentage_24h || 0;
        const isPositive = change >= 0;
        const sparklinePrices = coin.sparkline_in_7d ? coin.sparkline_in_7d.price : [];

        const sparklineSVG = generateSparklineHTML(sparklinePrices, isPositive);

        const cryptoItem = document.createElement('div');
        cryptoItem.className = `crypto-item ${coin.id === selectedCryptoId ? 'selected' : ''}`;
        cryptoItem.id = `coin-item-${coin.id}`;
        cryptoItem.onclick = () => selectCryptoItem(coin.id);

        cryptoItem.innerHTML = `
            <div class="asset-info-col">
                <img src="${coin.image}" alt="${coin.name}" class="asset-icon" onerror="this.src='https://assets.coingecko.com/coins/images/1/large/bitcoin.png'">
                <div class="asset-name-group">
                    <span class="asset-name">${coin.name}</span>
                    <span class="asset-symbol">${coin.symbol}</span>
                </div>
            </div>
            <div class="price-col font-mono">
                $${formatPrice(price)}
            </div>
            <div class="change-col ${isPositive ? 'positive' : 'negative'}">
                <i data-lucide="${isPositive ? 'trending-up' : 'trending-down'}"></i>
                <span class="font-mono">${isPositive ? '+' : ''}${change.toFixed(2)}%</span>
            </div>
            <div class="trend-col">
                ${sparklineSVG}
            </div>
        `;

        listContainer.appendChild(cryptoItem);
    });

    lucide.createIcons();
}

// Sparkline SVG generator helper
function generateSparklineHTML(prices, isPositive) {
    if (!prices || prices.length === 0) {
        return `<span style="font-size:10px; color:var(--text-secondary)">--</span>`;
    }

    const width = 80;
    const height = 30;
    const padding = 2;

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min === 0 ? 1 : max - min;

    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width;
        // Invert Y coordinate since SVG (0,0) is top-left
        const y = height - padding - ((price - min) / range) * (height - 2 * padding);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

    const statusClass = isPositive ? 'positive' : 'negative';

    return `
        <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}">
            <path class="sparkline-fill ${statusClass}" d="${fillD}"></path>
            <path class="sparkline-path ${statusClass}" d="${pathD}"></path>
        </svg>
    `;
}

// Select a cryptocurrency from the list
function selectCryptoItem(coinId) {
    const previousSelection = document.querySelector('.crypto-item.selected');
    if (previousSelection) {
        previousSelection.classList.remove('selected');
    }

    const currentSelection = document.getElementById(`coin-item-${coinId}`);
    if (currentSelection) {
        currentSelection.classList.add('selected');
    }

    selectedCryptoId = coinId;
    const coin = cryptoData.find(c => c.id === coinId) || cryptoData[0];

    // Update calculator layout
    document.getElementById('selectedCryptoIcon').src = coin.image;
    document.getElementById('selectedCryptoSymbol').textContent = coin.symbol.toUpperCase();

    // Update Stats panel
    document.getElementById('statRank').textContent = `#${coin.market_cap_rank || '--'}`;
    document.getElementById('statHigh').textContent = `$${formatPrice(coin.high_24h || 0)}`;
    document.getElementById('statLow').textContent = `$${formatPrice(coin.low_24h || 0)}`;

    // Recalculate values
    calculateConversion();
}

// Setup input defaults
function initializeCalculators() {
    calculateConversion();
}

// Swaps the conversion direction
function swapConverterMode() {
    const swapBtn = document.querySelector('.btn-swap');
    swapBtn.style.transform = 'translate(-50%, -50%) rotate(180deg)';

    // Reset rotation after transition
    setTimeout(() => {
        swapBtn.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }, 400);

    const calcModeText = document.getElementById('calcModeText');
    const inputLabel = document.getElementById('inputLabel');
    const outputLabel = document.getElementById('outputLabel');
    
    const inputField = document.getElementById('inputAmount');
    const outputField = document.getElementById('outputAmount');

    if (conversionMode === 'cryptoToFiat') {
        conversionMode = 'fiatToCrypto';
        calcModeText.textContent = 'Fiat to Crypto';
        inputLabel.textContent = 'Fiat Value';
        outputLabel.textContent = 'Crypto Amount';

        // Re-read current inputs and perform calculations
        calculateReverseConversion();
    } else {
        conversionMode = 'cryptoToFiat';
        calcModeText.textContent = 'Crypto to Fiat';
        inputLabel.textContent = 'Crypto Amount';
        outputLabel.textContent = 'Fiat Value';

        calculateConversion();
    }
}

// Crypto to Fiat calculation (and triggers stats grid update)
function calculateConversion() {
    const coin = cryptoData.find(c => c.id === selectedCryptoId) || cryptoData[0];
    const fiatSelect = document.getElementById('fiatSelect');
    const selectedFiat = fiatSelect.value;
    const fiatRate = fiatRates[selectedFiat] || 1.0;

    const inputField = document.getElementById('inputAmount');
    const outputField = document.getElementById('outputAmount');

    if (conversionMode === 'cryptoToFiat') {
        const cryptoAmount = parseFloat(inputField.value) || 0;
        const totalValueUSD = cryptoAmount * coin.current_price;
        const totalValueFiat = totalValueUSD * fiatRate;

        // Populate conversion output (format decimal places dynamically)
        outputField.value = formatCalculatorValue(totalValueFiat);

        // Update Equivalent Valuations Grid in stats
        updateMultiFiatValuations(cryptoAmount, coin.current_price);
    } else {
        // If in reverse mode, the user edited the fiat input field (which is inputField)
        const fiatAmount = parseFloat(inputField.value) || 0;
        const totalUSD = fiatAmount / fiatRate;
        const cryptoAmount = totalUSD / coin.current_price;

        outputField.value = formatCryptoCalculatorValue(cryptoAmount);

        // Update Equivalent Valuations Grid in stats
        updateMultiFiatValuations(cryptoAmount, coin.current_price);
    }
}

// Fiat to Crypto calculation (when editing output in regular mode or input in reverse)
function calculateReverseConversion() {
    const coin = cryptoData.find(c => c.id === selectedCryptoId) || cryptoData[0];
    const fiatSelect = document.getElementById('fiatSelect');
    const selectedFiat = fiatSelect.value;
    const fiatRate = fiatRates[selectedFiat] || 1.0;

    const inputField = document.getElementById('inputAmount');
    const outputField = document.getElementById('outputAmount');

    if (conversionMode === 'cryptoToFiat') {
        // User is editing the fiat output, calculate how much crypto that represents
        const fiatValue = parseFloat(outputField.value) || 0;
        const totalUSD = fiatValue / fiatRate;
        const cryptoAmount = totalUSD / coin.current_price;

        inputField.value = formatCryptoCalculatorValue(cryptoAmount);
        updateMultiFiatValuations(cryptoAmount, coin.current_price);
    } else {
        // User is in reverse mode and editing the crypto output field
        const cryptoAmount = parseFloat(outputField.value) || 0;
        const totalUSD = cryptoAmount * coin.current_price;
        const fiatValue = totalUSD * fiatRate;

        inputField.value = formatCalculatorValue(fiatValue);
        updateMultiFiatValuations(cryptoAmount, coin.current_price);
    }
}

// Update the multi-fiat breakdown grid
function updateMultiFiatValuations(cryptoAmount, usdPrice) {
    const grid = document.getElementById('multiFiatGrid');
    grid.innerHTML = '';

    const majorFiats = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR'];
    
    majorFiats.forEach(fiat => {
        const rate = fiatRates[fiat] || 1.0;
        const equivalentValue = cryptoAmount * usdPrice * rate;
        const def = fiatDefinitions[fiat];

        const fiatCard = document.createElement('div');
        fiatCard.className = 'fiat-card';
        fiatCard.innerHTML = `
            <div class="fiat-card-header">
                <span class="fiat-badge">${fiat}</span>
                <span class="fiat-flag">${def ? def.flag : ''}</span>
            </div>
            <div class="fiat-val-output font-mono">${def ? def.symbol : ''}${formatFiatVal(equivalentValue)}</div>
        `;
        grid.appendChild(fiatCard);
    });
}

// Trigger Manual Rate Refresh
async function refreshRates() {
    if (cooldownTimer > 0) return;

    const refreshBtn = document.getElementById('refreshBtn');
    const refreshIcon = document.getElementById('refreshIcon');
    const textSpan = document.getElementById('refreshBtnText');

    refreshBtn.disabled = true;
    refreshBtn.classList.add('spinning');
    textSpan.textContent = 'Updating...';

    try {
        await loadMarketRates();
        renderCryptoList();
        selectCryptoItem(selectedCryptoId);
    } catch (e) {
        console.error("Refresh error:", e);
    } finally {
        refreshBtn.classList.remove('spinning');
        startCooldown();
    }
}

// Cooldown mechanism to prevent rate limits
function startCooldown() {
    cooldownTimer = COOLDOWN_TIME;
    updateCooldownUI();

    // Store cooldown expiry timestamp in localStorage to persist across refreshes
    const expiryTimestamp = Date.now() + COOLDOWN_TIME * 1000;
    localStorage.setItem('day03_cooldown_expiry', expiryTimestamp.toString());

    cooldownInterval = setInterval(() => {
        cooldownTimer--;
        if (cooldownTimer <= 0) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
            localStorage.removeItem('day03_cooldown_expiry');
            
            const refreshBtn = document.getElementById('refreshBtn');
            const textSpan = document.getElementById('refreshBtnText');
            refreshBtn.disabled = false;
            textSpan.textContent = 'Refresh';
        } else {
            updateCooldownUI();
        }
    }, 1000);
}

// Restore cooldown state if page was refreshed during a cooldown
function checkCooldownRestore() {
    const expiry = localStorage.getItem('day03_cooldown_expiry');
    if (expiry) {
        const remainingTime = Math.ceil((parseInt(expiry) - Date.now()) / 1000);
        if (remainingTime > 0) {
            cooldownTimer = remainingTime;
            const refreshBtn = document.getElementById('refreshBtn');
            refreshBtn.disabled = true;
            
            cooldownInterval = setInterval(() => {
                cooldownTimer--;
                if (cooldownTimer <= 0) {
                    clearInterval(cooldownInterval);
                    cooldownInterval = null;
                    localStorage.removeItem('day03_cooldown_expiry');
                    
                    const textSpan = document.getElementById('refreshBtnText');
                    refreshBtn.disabled = false;
                    textSpan.textContent = 'Refresh';
                } else {
                    updateCooldownUI();
                }
            }, 1000);
        } else {
            localStorage.removeItem('day03_cooldown_expiry');
        }
    }
}

function updateCooldownUI() {
    const textSpan = document.getElementById('refreshBtnText');
    textSpan.textContent = `Wait ${cooldownTimer}s`;
}

// Formatting helpers
function formatPrice(val) {
    if (val === 0) return '0.00';
    if (val < 1) return val.toFixed(4);
    if (val < 10) return val.toFixed(2);
    return Math.round(val).toLocaleString();
}

function formatCalculatorValue(val) {
    if (val === 0) return '0.00';
    if (val < 1) return val.toFixed(5);
    if (val < 100) return val.toFixed(2);
    return val.toFixed(2);
}

function formatCryptoCalculatorValue(val) {
    if (val === 0) return '0';
    if (val < 0.00001) return val.toFixed(8);
    if (val < 0.1) return val.toFixed(6);
    return val.toFixed(4);
}

function formatFiatVal(val) {
    if (val === 0) return '0.00';
    if (val < 0.01) return val.toFixed(4);
    if (val < 1000) return val.toFixed(2);
    return Math.round(val).toLocaleString();
}

function formatDateTime(isoStr) {
    try {
        const date = new Date(isoStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
        return isoStr;
    }
}

// Banner controls
function showBanner(text, iconName) {
    const banner = document.getElementById('statusBanner');
    const textSpan = document.getElementById('bannerText');
    const icon = document.getElementById('bannerIcon');

    textSpan.textContent = text;
    icon.setAttribute('data-lucide', iconName);
    banner.classList.remove('hidden');

    lucide.createIcons();
}

function hideBanner() {
    document.getElementById('statusBanner').classList.add('hidden');
}

function closeBanner() {
    hideBanner();
}

// Modal Controls
function toggleApiModal() {
    document.getElementById('apiModal').classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}

// Cleanup intervals on unload
window.addEventListener('beforeunload', () => {
    if (cooldownInterval) clearInterval(cooldownInterval);
});

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
