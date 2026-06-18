/**
 * Day 04: Cats vs Dogs Vote Dashboard
 * Core logic for querying random pets, formatting breed names,
 * rendering vote stats distributions, and preserving state in localStorage.
 */

// Vote counters
let catVotes = 0;
let dogVotes = 0;

// Current loaded candidate URLs
let currentCatUrl = "";
let currentDogUrl = "";
let currentCatBreed = "";
let currentDogBreed = "";

// Stored histories
let catHistory = [];
let dogHistory = [];

// Backup offline library in case APIs rate-limit or fail
const backupCats = [
    { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop", breed: "Siamese" },
    { url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=400&auto=format&fit=crop", breed: "Tabby Cat" },
    { url: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=400&auto=format&fit=crop", breed: "Persian Cat" },
    { url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400&auto=format&fit=crop", breed: "Bengal Cat" },
    { url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=400&auto=format&fit=crop", breed: "Maine Coon" }
];

const backupDogs = [
    { url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop", breed: "Beagle" },
    { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400&auto=format&fit=crop", breed: "French Bulldog" },
    { url: "https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?q=80&w=400&auto=format&fit=crop", breed: "Pug" },
    { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop", breed: "Golden Retriever" },
    { url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop", breed: "Labrador" }
];

// Initialize Dashboard
async function initDashboard() {
    loadSavedData();
    updateUI();

    // Fetch initial candidate pair
    await Promise.all([fetchNewCat(), fetchNewDog()]);
}

// Load from LocalStorage
function loadSavedData() {
    catVotes = parseInt(localStorage.getItem('day04_cat_votes')) || 0;
    dogVotes = parseInt(localStorage.getItem('day04_dog_votes')) || 0;

    const catHistSaved = localStorage.getItem('day04_cat_history');
    const dogHistSaved = localStorage.getItem('day04_dog_history');

    catHistory = catHistSaved ? JSON.parse(catHistSaved) : [];
    dogHistory = dogHistSaved ? JSON.parse(dogHistSaved) : [];
}

// Fetch a new Cat candidate
async function fetchNewCat() {
    const loader = document.getElementById('catLoader');
    const img = document.getElementById('catImg');
    const breedLabel = document.getElementById('catBreed');

    loader.classList.remove('hidden');
    img.classList.add('hidden');

    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        if (!response.ok) throw new Error("Cat API returned error code");
        const data = await response.json();

        if (data && data[0]) {
            currentCatUrl = data[0].url;
            // The Cat API sometimes includes breeds details, check if available
            if (data[0].breeds && data[0].breeds.length > 0) {
                currentCatBreed = data[0].breeds[0].name;
            } else {
                currentCatBreed = "Domestic Shorthair";
            }
            
            // Set image source
            img.src = currentCatUrl;
            img.onload = () => {
                loader.classList.add('hidden');
                img.classList.remove('hidden');
            };
            breedLabel.textContent = currentCatBreed;
            hideBanner();
        } else {
            throw new Error("Invalid Cat payload");
        }
    } catch (e) {
        console.warn("Cats API failed. Loading fallback:", e);
        loadCatFallback();
    }
}

// Fallback loader for Cats
function loadCatFallback() {
    const loader = document.getElementById('catLoader');
    const img = document.getElementById('catImg');
    const breedLabel = document.getElementById('catBreed');

    const randomIndex = Math.floor(Math.random() * backupCats.length);
    const backup = backupCats[randomIndex];

    currentCatUrl = backup.url;
    currentCatBreed = backup.breed;

    img.src = currentCatUrl;
    img.onload = () => {
        loader.classList.add('hidden');
        img.classList.remove('hidden');
    };
    breedLabel.textContent = currentCatBreed;

    showBanner("Using backup pet library. Network requests failed.", "alert-triangle");
}

// Fetch a new Dog candidate
async function fetchNewDog() {
    const loader = document.getElementById('dogLoader');
    const img = document.getElementById('dogImg');
    const breedLabel = document.getElementById('dogBreed');

    loader.classList.remove('hidden');
    img.classList.add('hidden');

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) throw new Error("Dog API returned error code");
        const data = await response.json();

        if (data && data.status === "success") {
            currentDogUrl = data.message;
            currentDogBreed = parseDogBreedFromUrl(currentDogUrl);

            img.src = currentDogUrl;
            img.onload = () => {
                loader.classList.add('hidden');
                img.classList.remove('hidden');
            };
            breedLabel.textContent = currentDogBreed;
            hideBanner();
        } else {
            throw new Error("Invalid Dog payload");
        }
    } catch (e) {
        console.warn("Dogs API failed. Loading fallback:", e);
        loadDogFallback();
    }
}

// Fallback loader for Dogs
function loadDogFallback() {
    const loader = document.getElementById('dogLoader');
    const img = document.getElementById('dogImg');
    const breedLabel = document.getElementById('dogBreed');

    const randomIndex = Math.floor(Math.random() * backupDogs.length);
    const backup = backupDogs[randomIndex];

    currentDogUrl = backup.url;
    currentDogBreed = backup.breed;

    img.src = currentDogUrl;
    img.onload = () => {
        loader.classList.add('hidden');
        img.classList.remove('hidden');
    };
    breedLabel.textContent = currentDogBreed;

    showBanner("Using backup pet library. Network requests failed.", "alert-triangle");
}

// Parse Dog Breed name from CEO API url
function parseDogBreedFromUrl(url) {
    try {
        // Dog CEO URL structure: https://images.dog.ceo/breeds/sub-breed/photo.jpg
        const parts = url.split('/');
        const breedIndex = parts.indexOf('breeds') + 1;
        if (breedIndex > 0 && breedIndex < parts.length) {
            let breedRaw = parts[breedIndex];
            
            // Format breed names like "terrier-irish" to "Irish Terrier"
            const breedParts = breedRaw.split('-');
            const formattedParts = breedParts.map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            });
            // Reverse so sub-breeds sound better (e.g. "Irish Terrier" instead of "Terrier Irish")
            return formattedParts.reverse().join(' ');
        }
        return "Unknown Breed";
    } catch (e) {
        return "Mixed Breed";
    }
}

// Vote action
async function vote(team) {
    const cardId = team === 'cat' ? 'catCard' : 'dogCard';
    const card = document.getElementById(cardId);
    
    // Trigger pop/shake animation
    card.style.transform = 'scale(0.97)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);

    if (team === 'cat') {
        catVotes++;
        localStorage.setItem('day04_cat_votes', catVotes.toString());
        
        // Save current cat to history
        addPetToHistory('cat', currentCatUrl);
        
        // Refresh only the voted side to keep the other challenger active
        await fetchNewCat();
    } else {
        dogVotes++;
        localStorage.setItem('day04_dog_votes', dogVotes.toString());
        
        // Save current dog to history
        addPetToHistory('dog', currentDogUrl);
        
        // Refresh only the voted side
        await fetchNewDog();
    }

    updateUI();
}

// Add pet image to voting history
function addPetToHistory(team, url) {
    if (team === 'cat') {
        // Add to front, cap at 3
        catHistory.unshift(url);
        if (catHistory.length > 3) catHistory.pop();
        localStorage.setItem('day04_cat_history', JSON.stringify(catHistory));
    } else {
        dogHistory.unshift(url);
        if (dogHistory.length > 3) dogHistory.pop();
        localStorage.setItem('day04_dog_history', JSON.stringify(dogHistory));
    }
}

// Skip Candidate Pair
async function skipRound() {
    // Disable buttons temporarily
    const skipBtn = document.querySelector('.btn-skip');
    skipBtn.disabled = true;

    await Promise.all([fetchNewCat(), fetchNewDog()]);
    skipBtn.disabled = false;
}

// Update the full interface counters & progress bars
function updateUI() {
    // 1. Counters
    document.getElementById('catVotes').textContent = catVotes.toLocaleString();
    document.getElementById('dogVotes').textContent = dogVotes.toLocaleString();

    // 2. Winner classes & Match Status text
    const catCard = document.getElementById('catCard');
    const dogCard = document.getElementById('dogCard');
    const matchStatus = document.getElementById('matchStatus');

    catCard.classList.remove('winning-cat');
    dogCard.classList.remove('winning-dog');

    if (catVotes === 0 && dogVotes === 0) {
        matchStatus.textContent = "Tie Match";
        matchStatus.className = "match-status-pill";
    } else if (catVotes > dogVotes) {
        catCard.classList.add('winning-cat');
        const diff = catVotes - dogVotes;
        matchStatus.textContent = `Cats Leading by ${diff}`;
        matchStatus.className = "match-status-pill cats-leading";
    } else if (dogVotes > catVotes) {
        dogCard.classList.add('winning-dog');
        const diff = dogVotes - catVotes;
        matchStatus.textContent = `Dogs Leading by ${diff}`;
        matchStatus.className = "match-status-pill dogs-leading";
    } else {
        matchStatus.textContent = "Tie Match";
        matchStatus.className = "match-status-pill";
    }

    // 3. Progress bar percentages
    const totalVotes = catVotes + dogVotes;
    let catPercent = 50;
    let dogPercent = 50;

    if (totalVotes > 0) {
        catPercent = Math.round((catVotes / totalVotes) * 100);
        dogPercent = 100 - catPercent; // Maintain perfect 100 total
    }

    document.getElementById('catPercent').textContent = catPercent;
    document.getElementById('dogPercent').textContent = dogPercent;

    document.getElementById('catFill').style.width = `${catPercent}%`;
    document.getElementById('dogFill').style.width = `${dogPercent}%`;

    // 4. Render History columns
    renderHistoryRow('cat');
    renderHistoryRow('dog');
}

// Render thumb list helper
function renderHistoryRow(team) {
    const list = document.getElementById(`${team}History`);
    const historyArr = team === 'cat' ? catHistory : dogHistory;

    list.innerHTML = '';

    if (historyArr.length === 0) {
        list.innerHTML = `<span class="no-history">No votes yet</span>`;
        return;
    }

    historyArr.forEach((url, i) => {
        const img = document.createElement('img');
        img.className = 'history-thumb';
        img.src = url;
        img.alt = `Voted ${team} ${i + 1}`;
        img.title = "Click to open image in full size";
        img.onclick = () => window.open(url, '_blank');
        list.appendChild(img);
    });
}

// Reset votes
function resetVotes() {
    const confirmReset = confirm("Are you sure you want to clear all vote tallies and candidates history? This cannot be undone.");
    if (confirmReset) {
        catVotes = 0;
        dogVotes = 0;
        catHistory = [];
        dogHistory = [];

        localStorage.removeItem('day04_cat_votes');
        localStorage.removeItem('day04_dog_votes');
        localStorage.removeItem('day04_cat_history');
        localStorage.removeItem('day04_dog_history');

        updateUI();
    }
}

// Toast warning banners controls
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

// Modal specifications controls
function toggleApiModal() {
    document.getElementById('apiModal').classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
