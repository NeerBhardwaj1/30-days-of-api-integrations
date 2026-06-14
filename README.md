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
  * Automatic IP address analysis and geographical coordination.
  * Interactive dark-themed map visualization using [Leaflet.js](https://leafletjs.com/) and CartoDB.
  * Real-time local weather reports (temperature, feels-like, wind speed/direction).
  * 3-day meteorological forecast grid.
  * API specs viewer modal displaying endpoint payloads.
  * Dynamic ISO-to-flag emoji compiler.

### 🔒 Days 02 - 30: Mystery Challenges
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
└── day01/            # Day 1 project directory
    ├── index.html    # Day 1 dashboard HTML
    ├── style.css     # Day 1 CSS
    └── app.js        # Geolocation & weather logic
```
