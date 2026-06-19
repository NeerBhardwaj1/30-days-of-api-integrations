# 30 Days of API Integrations 🚀

A daily coding challenge to build **one interactive micro-application per day**, combining **two distinct APIs** to solve real-world tasks. Designed with premium dark aesthetics, glassmorphism UI layouts, and smooth animations.

Developed by **Neer Bhardwaj** ([codewithneerb@gmail.com](mailto:codewithneerb@gmail.com)).

---

## 🌟 Live Demo Portal
You can run a local web server to explore the portal hub and individual projects:
```bash
# Start a local web server
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 📅 Roadmap & Active Days

### 🟢 Day 01: Geolocation & Live Weather Dashboard
* **APIs Integrated**:
  1. [IP-API](http://ip-api.com) / [ipapi.co](https://ipapi.co) — Client IP Geolocation
  2. [Open-Meteo](https://open-meteo.com) — Meteorological Forecast
* **Key Features**:
  * Automatic IP address analysis and mapping with [Leaflet.js](https://leafletjs.com/).
  * Real-time weather parameters and a 3-day meteorological forecast.
  * Dynamic Flag Emojis and specs preview overlay.

### 🟢 Day 02: Astronomy APOD & ISS Live Tracker
* **APIs Integrated**:
  1. [NASA APOD API](https://api.nasa.gov) — Astronomy Picture of the Day
  2. [Open Notify ISS API](http://open-notify.org) — Live ISS Coordinate Telemetry
* **Key Features**:
  * Dual-media handler rendering high-quality NASA daily photography or YouTube video iframe embeds.
  * Smooth expanding accordion explanation of celestial physics.
  * Live-updating dark map showing the International Space Station's real-time position.
  * 50-point dotted orbital flight path trail and countdown fetch timer.

### 🟢 Day 03: Cryptocurrency Live Prices & Fiat Converter
* **APIs Integrated**:
  1. [CoinGecko API](https://www.coingecko.com) — Live Market Tickers & Sparklines
  2. [Frankfurter API](https://www.frankfurter.dev) — Foreign Exchange Rates
* **Key Features**:
  * Dynamic price feeds displaying 24h percentage changes and 7-day sparkline trend SVGs.
  * Interactive Crypto-to-Fiat & Fiat-to-Crypto conversion calculator.
  * Multi-fiat equivalent grid displaying asset values in 6 major currencies simultaneously.
  * Persistent local cache fallback mechanism protecting against 429 rate limit errors.

### 🟢 Day 04: Cats vs Dogs Vote Dashboard
* **APIs Integrated**:
  1. [The Cat API](https://thecatapi.com) — Random Feline Photos & Breeds
  2. [Dog CEO API](https://dog.ceo/dog-api/) — Random Canine Photos & Breed Parsing
* **Key Features**:
  * Side-by-side candidates comparing random cats and dogs with custom breed formatting.
  * Real-time voting button with automatic candidate refreshing on click.
  * Visual standings tracker showing live vote distribution percentages and leading indicators.
  * Local storage history grid displaying thumbnails of past voted pets.

### 🟢 Day 05: Motivational Quote Card Generator
* **APIs Integrated**:
  1. [ZenQuotes API](https://zenquotes.io) — Motivational & Philosophical Quotes
  2. [Unsplash API](https://unsplash.com/developers) — HD Photographic Backgrounds
* **Key Features**:
  * Multi-layer quote loader calling ZenQuotes (via AllOrigins CORS wrapper) -> DummyJSON API -> Local presets.
  * Interactive background panel with Unsplash Access Key connector (local storage configuration) and categorized offline presets.
  * Real-time sliders adjusting font family styles, font size, overlay opacity (readability), background blur, text alignment, and shadows.
  * High-res canvas compiler drawing center-cropped images, text wrapping, and custom shadows to download 1080x1080 PNG graphics.

### 🟢 Day 06: Anime Explorer & Ghibli Cinema
* **APIs Integrated**:
  1. [Jikan API](https://jikan.moe) — MyAnimeList Directory Search
  2. [Studio Ghibli API](https://ghibliapi.dev) — Movie Archive Database
* **Key Features**:
  * Dual-themed layout showcasing high-tech neon cyber controls for modern anime listings alongside vintage sepia film aesthetics for retro Ghibli archives.
  * Live anime directory search returning ratings, genres, and YouTube embedded trailer iframe videos in a dedicated sliding drawer.
  * Ghibli catalog sorter filtering titles, and ordering items by Rotten Tomatoes ratings, release dates, or running lengths.
  * Multi-tiered Jikan cache fallbacks protecting against MyAnimeList's rate limits and offline queries.

### 🔒 Days 07 - 30: Mystery Challenges
* Locked API integrations and mystery challenges are encrypted in the dashboard portal. A new module will decrypt and unlock each day!

---

## 🛠️ Tech Stack
* **Language**: Vanilla JavaScript (ES6+), HTML5
* **Styling**: Modern CSS3 (Grid, Flexbox, custom HSL palettes, glassmorphism, animations)
* **Libraries**: Lucide Icons, Leaflet.js
* **Hosting-Ready**: Static files, compatible with GitHub Pages, Vercel, or Netlify.

---

## 📂 Project Structure
```text
├── index.html        # Main dashboard hub
├── style.css         # Portal styles
├── README.md         # Documentation
├── LICENSE           # MIT License
├── .gitignore        # Staging ignores
├── day01/            # Day 1 project directory
│   ├── index.html    # Day 1 dashboard HTML
│   ├── style.css     # Day 1 CSS
│   └── app.js        # Geolocation & weather logic
├── day02/            # Day 2 project directory
│   ├── index.html    # Day 2 Space HTML
│   ├── style.css     # Day 2 CSS
│   └── app.js        # NASA & ISS tracker logic
├── day03/            # Day 3 project directory
│   ├── index.html    # Day 3 Crypto HTML
│   ├── style.css     # Day 3 CSS
│   └── app.js        # CoinGecko & Frankfurter logic
└── day04/            # Day 4 project directory
    ├── index.html    # Day 4 Pets HTML
    ├── style.css     # Day 4 CSS
    └── app.js        # Cat & Dog voting logic
```
