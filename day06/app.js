// State Management
let airingAnime = [];
let searchResults = [];
let ghibliFilms = [];
let activeAnimeTab = 'airing';
let currentDetailItem = null;
let currentDetailType = '';

// Local Backup Databases (For offline and Jikan rate limits fallback)
const backupAnime = [
    {
        mal_id: 52991,
        title: "Sousou no Frieren",
        title_english: "Frieren: Beyond Journey's End",
        title_japanese: "葬送のフリーレン",
        score: 9.38,
        type: "TV",
        status: "Finished Airing",
        aired: { prop: { from: { year: 2023 } }, string: "Sep 2023 to Mar 2024" },
        duration: "24 min per ep",
        rating: "PG-13 - Teens 13 or older",
        synopsis: "During their 10-year quest, the hero party—consisting of the hero Himmel, the priest Heiter, the warrior Eisen, and the elven mage Frieren—defeated the Demon King and brought peace to the world. Frieren, as an elf, lives much longer than her companions, and promises to return after 50 years to witness a meteor shower. When she returns, she realizes how fleeting human lives are, and begins a journey to learn more about humans.",
        images: { webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138029l.webp" } },
        studios: [{ name: "Madhouse" }],
        genres: [{ name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
        source: "Manga",
        trailer: { embed_url: "https://www.youtube.com/embed/qgQkT6TkUT0?enablejsapi=1&wmode=opaque" }
    },
    {
        mal_id: 5114,
        title: "Fullmetal Alchemist: Brotherhood",
        title_english: "Fullmetal Alchemist: Brotherhood",
        title_japanese: "鋼の錬金術師 FULLMETAL ALCHEMIST",
        score: 9.10,
        type: "TV",
        status: "Finished Airing",
        aired: { prop: { from: { year: 2009 } }, string: "Apr 2009 to Jul 2010" },
        duration: "24 min per ep",
        rating: "R - 17+ (violence & profanity)",
        synopsis: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left with scarred bodies. Edward loses his left leg and sacrifices his right arm to bind Alphonse's soul to a suit of armor. They set out to find the Philosopher's Stone to restore their bodies.",
        images: { webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp" } },
        studios: [{ name: "Bones" }],
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
        source: "Manga",
        trailer: { embed_url: "https://www.youtube.com/embed/K84J-2Z9g-I?enablejsapi=1&wmode=opaque" }
    },
    {
        mal_id: 50265,
        title: "Spy x Family",
        title_english: "Spy x Family",
        title_japanese: "SPY×FAMILY",
        score: 8.52,
        type: "TV",
        status: "Finished Airing",
        aired: { prop: { from: { year: 2022 } }, string: "Apr 2022 to Jun 2022" },
        duration: "24 min per ep",
        rating: "PG-13 - Teens 13 or older",
        synopsis: "For the agent known as 'Twilight', no order is too tall if it is for the sake of peace. Twilight operates as the master spy Westalis, working tirelessly to prevent extremists from sparking a war. For his latest mission, he must investigate Ostanian politician Donovan Desmond. To do this, he must marry and adopt a child to infiltrate Desmond's social circle, unaware his new family members are a telepathic child and an assassin.",
        images: { webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1441/122795l.webp" } },
        studios: [{ name: "Wit Studio, CloverWorks" }],
        genres: [{ name: "Action" }, { name: "Comedy" }],
        source: "Manga",
        trailer: { embed_url: "https://www.youtube.com/embed/OZsUv8fAasM?enablejsapi=1&wmode=opaque" }
    },
    {
        mal_id: 54112,
        title: "Kimetsu no Yaiba: Hashira Geiko-hen",
        title_english: "Demon Slayer: Kimetsu no Yaiba Hashira Training Arc",
        title_japanese: "鬼滅の刃 柱稽古編",
        score: 8.35,
        type: "TV",
        status: "Currently Airing",
        aired: { prop: { from: { year: 2024 } }, string: "May 2024 to ?" },
        duration: "24 min per ep",
        rating: "R - 17+ (violence & profanity)",
        synopsis: "In preparation for the impending battle against Muzan Kibutsuji, the members of the Demon Slayer Corps, including Tanjiro Kamado and his companions, undergo rigorous training led by the elite Hashira. This intense conditioning tests their resolve, physical limits, and spiritual endurance.",
        images: { webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1908/142385l.webp" } },
        studios: [{ name: "ufotable" }],
        genres: [{ name: "Action" }, { name: "Fantasy" }],
        source: "Manga",
        trailer: { embed_url: "https://www.youtube.com/embed/5aLh7XG_9f8?enablejsapi=1&wmode=opaque" }
    }
];

const backupGhibli = [
    {
        id: "58611129-2cd1-4552-9f4c-413a2746c8b2",
        title: "My Neighbor Totoro",
        original_title: "となりのトトロ",
        original_title_romanised: "Tonari no Totoro",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/rt8x5Xrr24559Up59x254t7g86d.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/d1rm7VQCxT0wdi1ENmSyqQQ4GPd.jpg",
        description: "Two young girls, Satsuki and her younger sister Mei, move into a house in the country with their father to be closer to their hospitalized mother. They discover that the nearby forest is inhabited by magical spirits called Totoros, led by a giant, friendly creature named Totoro.",
        director: "Hayao Miyazaki",
        producer: "Hayao Miyazaki",
        release_date: "1988",
        running_time: "86",
        rt_score: "93"
    },
    {
        id: "2baf2f88-514e-48a7-a8df-9b03c1b13037",
        title: "Castle in the Sky",
        original_title: "天空の城ラピュタ",
        original_title_romanised: "Tenkū no Shiro Rapyuta",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/npSS2TCm6zW6795s3CYsR1z3IFj.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/3rxw0tSjuV45VNyhHsu53skvOIq.jpg",
        description: "The orphan Sheeta and her supporter Pazu race against hostile agents in search of the legendary floating castle of Laputa.",
        director: "Hayao Miyazaki",
        producer: "Isao Takahata",
        release_date: "1986",
        running_time: "124",
        rt_score: "95"
    },
    {
        id: "0440483e-ca0e-4120-8c50-5c84996cbb45",
        title: "Whisper of the Heart",
        original_title: "耳をすませば",
        original_title_romanised: "Mimi wo Sumaseba",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/5e4B9q52Q36t1w6874P6wrr3t9C.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/990eR7e2JqG7j4Z4NfH7Yk2w15F.jpg",
        description: "Shizuku Tsukishima is a bookworm who discovers that all the library books she checks out have previously been borrowed by a boy named Seiji Amasawa. Intrigued, she seeks out Seiji, who dreams of becoming a master violin maker in Italy. Inspired by him, Shizuku decides to write a book about the Baron, a cat figurine she finds in an antique shop.",
        director: "Yoshifumi Kondō",
        producer: "Toshio Suzuki",
        release_date: "1995",
        running_time: "111",
        rt_score: "91"
    },
    {
        id: "12cf405c-ac99-4d15-a4c9-947e1b5946d3",
        title: "Grave of the Fireflies",
        original_title: "火垂るの墓",
        original_title_romanised: "Hotaru no Haka",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/kGzNIBjZGw38Jqyd5FT7WIdo8IE.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/fC4cx46BBnEV7jS64Joc2w0aG5u.jpg",
        description: "In the latter part of World War II, a boy and his sister, orphaned when their mother is killed in the firebombing of Tokyo, are left to survive on their own. They struggle to survive in the face of widespread famine and the callousness of their compatriots.",
        director: "Isao Takahata",
        producer: "Toru Hara",
        release_date: "1988",
        running_time: "89",
        rt_score: "97"
    },
    {
        id: "ea91057a-44d9-4ab5-8c50-68751fa33f2a",
        title: "Spirited Away",
        original_title: "千と千尋の神隠し",
        original_title_romanised: "Sen to Chihiro no Kamikakushi",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/39q62SznR2q16K2FIzU6vGsRRen.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/3WZ9TzBvP24S61QvR2tHwZ92ZgB.jpg",
        description: "A ten-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
        director: "Hayao Miyazaki",
        producer: "Toshio Suzuki",
        release_date: "2001",
        running_time: "125",
        rt_score: "97"
    },
    {
        id: "cd3de28e-6309-43d2-b7d4-0a70f2459b74",
        title: "Howl's Moving Castle",
        original_title: "ハウルの動く城",
        original_title_romanised: "Hauru no Ugoku Shiro",
        image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/l3n7ik51c76j60t8e41w0a30b42.jpg",
        movie_banner: "https://image.tmdb.org/t/p/w533_and_h300_filter(min_substantial)/7coJp7SipmEsz0kLntFvF5z4c1D.jpg",
        description: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard and his companions in his legged, walking castle.",
        director: "Hayao Miyazaki",
        producer: "Toshio Suzuki",
        release_date: "2004",
        running_time: "119",
        rt_score: "87"
    }
];

// Initialise Elements on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialise Icons
    lucide.createIcons();

    // Load Data
    initAnimeData();
    initGhibliData();
});

// 1. ANIME EXPLORER (Jikan)
async function initAnimeData() {
    const loader = document.getElementById('animeLoader');
    const container = document.getElementById('animeContainer');
    
    loader.classList.remove('hidden');
    container.classList.add('hidden');
    
    try {
        // Fetch top airing anime from Jikan
        const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=15');
        
        if (!response.ok) throw new Error('Jikan fetch failed');
        
        const payload = await response.json();
        if (payload && payload.data) {
            airingAnime = payload.data;
            showBanner(false);
            renderAnimeList();
            return;
        }
        throw new Error('Jikan payload invalid');
    } catch (e) {
        console.warn('Jikan API request failed. Loading backup database.', e);
        airingAnime = backupAnime;
        showBanner(true, "Using local backup database. Jikan API rate limit (3 req/sec) or network issue detected.");
        renderAnimeList();
    } finally {
        loader.classList.add('hidden');
        container.classList.remove('hidden');
    }
}

// Render Anime Cards
function renderAnimeList() {
    const container = document.getElementById('animeContainer');
    container.innerHTML = '';
    
    const activeList = activeAnimeTab === 'airing' ? airingAnime : searchResults;
    
    if (activeList.length === 0) {
        container.innerHTML = `<div class="empty-results">No anime listings found. Try a different search!</div>`;
        return;
    }
    
    activeList.forEach(anime => {
        const title = anime.title_english || anime.title;
        const sub = anime.title_japanese || '';
        const img = anime.images.webp.large_image_url || anime.images.jpg.image_url;
        const score = anime.score ? anime.score.toFixed(2) : null;
        const type = anime.type || 'TV';
        const episodesStr = anime.episodes ? `${anime.episodes} episodes` : 'Airing';
        
        const card = document.createElement('div');
        card.className = 'explorer-card anime-card-style';
        card.onclick = () => showDetail('anime', anime.mal_id);
        
        card.innerHTML = `
            <div class="card-img-frame">
                <img src="${img}" alt="${title}" loading="lazy">
            </div>
            <div class="card-details">
                <div class="card-title-row">
                    <h3>${title}</h3>
                    <div class="japanese-sub">${sub}</div>
                </div>
                <div class="card-meta-row">
                    <span class="meta-badge">${type}</span>
                    <span class="meta-badge">${episodesStr}</span>
                    ${score ? `
                        <div class="card-score-wrapper">
                            <i data-lucide="star" style="fill: var(--anime-accent)"></i>
                            <span>${score}</span>
                        </div>
                    ` : `
                        <span class="no-score">No Rank</span>
                    `}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    lucide.createIcons();
}

// Anime Search Handler
async function searchAnime() {
    const query = document.getElementById('animeSearch').value.trim();
    if (!query) {
        // Reset to Airing if empty search
        switchAnimeTab('airing');
        return;
    }
    
    const loader = document.getElementById('animeLoader');
    const container = document.getElementById('animeContainer');
    const tabResults = document.getElementById('tabResults');
    
    loader.classList.remove('hidden');
    container.classList.add('hidden');
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=15`);
        if (!response.ok) throw new Error('Search failed');
        
        const payload = await response.json();
        if (payload && payload.data) {
            searchResults = payload.data;
            tabResults.classList.remove('hidden');
            switchAnimeTab('results');
            return;
        }
        throw new Error('Search payload invalid');
    } catch (e) {
        console.error('Anime search failed, filtering local backup...', e);
        // Fallback: search query in backup list
        searchResults = backupAnime.filter(a => 
            a.title.toLowerCase().includes(query.toLowerCase()) || 
            (a.title_english && a.title_english.toLowerCase().includes(query.toLowerCase()))
        );
        tabResults.classList.remove('hidden');
        switchAnimeTab('results');
    } finally {
        loader.classList.add('hidden');
        container.classList.remove('hidden');
    }
}

// Handle key press in anime search input
function handleAnimeSearchKey(e) {
    if (e.key === 'Enter') {
        searchAnime();
    }
}

// Switch between Airing / Results tab
function switchAnimeTab(tab) {
    activeAnimeTab = tab;
    
    document.getElementById('tabAiring').classList.remove('active');
    document.getElementById('tabResults').classList.remove('active');
    
    if (tab === 'airing') {
        document.getElementById('tabAiring').classList.add('active');
    } else {
        document.getElementById('tabResults').classList.add('active');
    }
    
    renderAnimeList();
}


// 2. STUDIO GHIBLI ARCHIVES
async function initGhibliData() {
    const loader = document.getElementById('ghibliLoader');
    const container = document.getElementById('ghibliContainer');
    
    loader.classList.remove('hidden');
    container.classList.add('hidden');
    
    try {
        const response = await fetch('https://ghibliapi.dev/films');
        if (!response.ok) throw new Error('Ghibli fetch failed');
        
        const data = await response.json();
        if (Array.isArray(data)) {
            ghibliFilms = data;
            renderGhibliList();
            return;
        }
        throw new Error('Ghibli invalid array');
    } catch (e) {
        console.warn('Ghibli API request failed. Loading backup database.', e);
        ghibliFilms = backupGhibli;
        renderGhibliList();
    } finally {
        loader.classList.add('hidden');
        container.classList.remove('hidden');
    }
}

// Render Ghibli Cards
function renderGhibliList() {
    const container = document.getElementById('ghibliContainer');
    container.innerHTML = '';
    
    const sortVal = document.getElementById('ghibliSort').value;
    const filterQuery = document.getElementById('ghibliSearch').value.toLowerCase().trim();
    
    // 1. Filter
    let filteredFilms = ghibliFilms.filter(film => 
        film.title.toLowerCase().includes(filterQuery) || 
        film.original_title.toLowerCase().includes(filterQuery)
    );
    
    // 2. Sort
    filteredFilms.sort((a, b) => {
        if (sortVal === 'score') {
            return Number(b.rt_score) - Number(a.rt_score);
        } else if (sortVal === 'date-new') {
            return Number(b.release_date) - Number(a.release_date);
        } else if (sortVal === 'date-old') {
            return Number(a.release_date) - Number(b.release_date);
        } else if (sortVal === 'duration') {
            return Number(b.running_time) - Number(a.running_time);
        }
        return 0;
    });
    
    if (filteredFilms.length === 0) {
        container.innerHTML = `<div class="empty-results">No Ghibli films matched the filter.</div>`;
        return;
    }
    
    filteredFilms.forEach(film => {
        const title = film.title;
        const sub = `${film.original_title} (${film.original_title_romanised})`;
        const img = film.image || 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rt8x5Xrr24559Up59x254t7g86d.jpg';
        const score = film.rt_score;
        const year = film.release_date;
        const duration = `${film.running_time}m`;
        
        const card = document.createElement('div');
        card.className = 'explorer-card ghibli-card-style';
        card.onclick = () => showDetail('ghibli', film.id);
        
        card.innerHTML = `
            <div class="card-img-frame">
                <img src="${img}" alt="${title}" loading="lazy">
            </div>
            <div class="card-details">
                <div class="card-title-row">
                    <h3>${title}</h3>
                    <div class="japanese-sub">${sub}</div>
                </div>
                <div class="card-meta-row">
                    <span class="meta-badge">${year}</span>
                    <span class="meta-badge">${duration}</span>
                    <div class="card-score-wrapper">
                        <i data-lucide="star" style="fill: var(--ghibli-accent)"></i>
                        <span>${score}%</span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    lucide.createIcons();
}


// 3. UNIFIED MODAL DRAWER
function showDetail(type, id) {
    currentDetailType = type;
    
    if (type === 'anime') {
        const list = activeAnimeTab === 'airing' ? airingAnime : searchResults;
        currentDetailItem = list.find(a => a.mal_id === id);
    } else if (type === 'ghibli') {
        currentDetailItem = ghibliFilms.find(f => f.id === id);
    }
    
    if (!currentDetailItem) return;
    
    // DOM Elements
    const modal = document.getElementById('detailModal');
    const banner = document.getElementById('detailBanner');
    const badge = document.getElementById('detailTypeBadge');
    const title = document.getElementById('detailTitle');
    const sub = document.getElementById('detailSubTitle');
    const scoreVal = document.getElementById('detailScore');
    
    // Meta Labels & Values
    const mLabel2 = document.getElementById('metaLabel2');
    const mValue2 = document.getElementById('metaValue2');
    
    const mLabel3 = document.getElementById('metaLabel3');
    const mValue3 = document.getElementById('metaValue3');
    
    const mCard4 = document.getElementById('metaCard4');
    const mLabel4 = document.getElementById('metaLabel4');
    const mValue4 = document.getElementById('metaValue4');
    
    const descText = document.getElementById('detailDescription');
    const specsContainer = document.getElementById('detailSpecs');
    const btnTrailer = document.getElementById('btnDetailTrailer');
    
    // Reset video iframe
    document.getElementById('trailerIframeContainer').innerHTML = '';
    
    // Clear styles
    badge.className = 'detail-badge';
    
    if (type === 'anime') {
        // Render Anime Style Details
        badge.textContent = currentDetailItem.type || 'TV';
        badge.style.background = 'var(--anime-gradient)';
        
        title.textContent = currentDetailItem.title_english || currentDetailItem.title;
        sub.textContent = currentDetailItem.title_japanese || '';
        
        banner.style.backgroundImage = `url('${currentDetailItem.images.webp.large_image_url || currentDetailItem.images.jpg.image_url}')`;
        scoreVal.textContent = currentDetailItem.score ? currentDetailItem.score.toFixed(2) : 'N/A';
        
        mLabel2.textContent = 'Year';
        mValue2.textContent = currentDetailItem.year || currentDetailItem.aired.prop.from.year || 'N/A';
        
        mLabel3.textContent = 'Episodes';
        mValue3.textContent = currentDetailItem.episodes ? `${currentDetailItem.episodes} eps` : 'Airing';
        
        mCard4.classList.remove('hidden');
        mLabel4.textContent = 'Studio';
        mValue4.textContent = currentDetailItem.studios && currentDetailItem.studios.length > 0 ? currentDetailItem.studios[0].name : 'Unknown';
        
        descText.textContent = currentDetailItem.synopsis || 'No synopsis details available.';
        
        // Specs table
        const genresStr = currentDetailItem.genres ? currentDetailItem.genres.map(g => g.name).join(', ') : 'None';
        specsContainer.innerHTML = `
            <div class="spec-item"><span class="spec-name">Genres</span><span class="spec-val">${genresStr}</span></div>
            <div class="spec-item"><span class="spec-name">Source</span><span class="spec-val">${currentDetailItem.source || 'Unknown'}</span></div>
            <div class="spec-item"><span class="spec-name">Duration</span><span class="spec-val">${currentDetailItem.duration || 'Unknown'}</span></div>
            <div class="spec-item"><span class="spec-name">Aired Range</span><span class="spec-val">${currentDetailItem.aired.string || 'Unknown'}</span></div>
            <div class="spec-item" style="grid-column: 1/-1;"><span class="spec-name">Rating</span><span class="spec-val">${currentDetailItem.rating || 'N/A'}</span></div>
        `;
        
        // Handle Video Trailer tab
        if (currentDetailItem.trailer && currentDetailItem.trailer.embed_url) {
            btnTrailer.classList.remove('hidden');
        } else {
            btnTrailer.classList.add('hidden');
        }
        
    } else if (type === 'ghibli') {
        // Render Ghibli Film Details
        badge.textContent = 'Movie';
        badge.style.background = 'var(--ghibli-gradient)';
        
        title.textContent = currentDetailItem.title;
        sub.textContent = `${currentDetailItem.original_title} (${currentDetailItem.original_title_romanised})`;
        
        const bannerUrl = currentDetailItem.movie_banner || currentDetailItem.image;
        banner.style.backgroundImage = `url('${bannerUrl}')`;
        scoreVal.textContent = `${currentDetailItem.rt_score}%`;
        
        mLabel2.textContent = 'Release';
        mValue2.textContent = currentDetailItem.release_date;
        
        mLabel3.textContent = 'Duration';
        mValue3.textContent = `${currentDetailItem.running_time} mins`;
        
        mCard4.classList.remove('hidden');
        mLabel4.textContent = 'Director';
        mValue4.textContent = currentDetailItem.director;
        
        descText.textContent = currentDetailItem.description;
        
        // Specs table
        specsContainer.innerHTML = `
            <div class="spec-item"><span class="spec-name">Producer</span><span class="spec-val">${currentDetailItem.producer || 'Unknown'}</span></div>
            <div class="spec-item"><span class="spec-name">Release Date</span><span class="spec-val">${currentDetailItem.release_date}</span></div>
            <div class="spec-item"><span class="spec-name">Rotten Score</span><span class="spec-val">${currentDetailItem.rt_score}/100</span></div>
            <div class="spec-item"><span class="spec-name">Running Time</span><span class="spec-val">${currentDetailItem.running_time} minutes</span></div>
        `;
        
        btnTrailer.classList.add('hidden'); // Ghibli API has no trailers
    }
    
    // Switch to Info tab default
    switchDetailTab('info');
    
    // Unhide modal
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.add('hidden');
    // Stop trailer video if playing
    document.getElementById('trailerIframeContainer').innerHTML = '';
}

function closeDetailModalOutside(e) {
    if (e.target.id === 'detailModal') {
        closeDetailModal();
    }
}

// Switch Detail Tab (Synopsis / Trailer)
function switchDetailTab(tabName) {
    const btnInfo = document.getElementById('btnDetailInfo');
    const btnTrailer = document.getElementById('btnDetailTrailer');
    const infoContent = document.getElementById('detailInfoContent');
    const trailerContent = document.getElementById('detailTrailerContent');
    
    btnInfo.classList.remove('active');
    btnTrailer.classList.remove('active');
    infoContent.classList.add('hidden');
    trailerContent.classList.add('hidden');
    
    if (tabName === 'info') {
        btnInfo.classList.add('active');
        infoContent.classList.remove('hidden');
    } else if (tabName === 'trailer') {
        btnTrailer.classList.add('active');
        trailerContent.classList.remove('hidden');
        
        // Load YouTube video embed if trailer available
        if (currentDetailItem && currentDetailItem.trailer && currentDetailItem.trailer.embed_url) {
            const iframe = document.createElement('iframe');
            iframe.src = currentDetailItem.trailer.embed_url;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            document.getElementById('trailerIframeContainer').appendChild(iframe);
        }
    }
}


// 4. API SPEC MODAL
function toggleApiModal() {
    document.getElementById('apiModal').classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}


// 5. BANNER ALERTS
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
