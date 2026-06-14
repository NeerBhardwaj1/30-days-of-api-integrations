/**
 * Day 01: Geolocation Weather Dashboard
 * Core logic for fetching IP Location details, mapping it, and querying 3-day forecasts.
 */

// Mapping Open-Meteo WMO weather codes to text and Lucide icons
const weatherCodeMap = {
    0: { text: "Clear Sky", icon: "sun" },
    1: { text: "Mainly Clear", icon: "cloud-sun" },
    2: { text: "Partly Cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Foggy", icon: "cloud-fog" },
    48: { text: "Depositing Rime Fog", icon: "cloud-fog" },
    51: { text: "Light Drizzle", icon: "cloud-drizzle" },
    53: { text: "Moderate Drizzle", icon: "cloud-drizzle" },
    55: { text: "Dense Drizzle", icon: "cloud-drizzle" },
    61: { text: "Slight Rain", icon: "cloud-rain" },
    63: { text: "Moderate Rain", icon: "cloud-rain" },
    65: { text: "Heavy Rain", icon: "cloud-rain" },
    71: { text: "Slight Snowfall", icon: "snowflake" },
    73: { text: "Moderate Snowfall", icon: "snowflake" },
    75: { text: "Heavy Snowfall", icon: "snowflake" },
    80: { text: "Slight Rain Showers", icon: "cloud-rain" },
    81: { text: "Moderate Rain Showers", icon: "cloud-rain" },
    82: { text: "Violent Rain Showers", icon: "cloud-lightning" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" },
    96: { text: "Thunderstorm with hail", icon: "cloud-lightning" },
    99: { text: "Severe Thunderstorm", icon: "cloud-lightning" }
};

// Variable to store the Leaflet map instance to prevent duplicate initializations
let mapInstance = null;

// Convert country code to Flag Emoji (e.g. "US" -> "🇺🇸")
function getFlagEmoji(countryCode) {
    if (!countryCode) return "🌍";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

// Convert wind direction degrees to human cardinal direction text
function getWindDirectionText(degree) {
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const idx = Math.round(((degree % 360) / 45)) % 8;
    return directions[idx];
}

// Format ISO date strings into readable day names
function getDayName(isoDateString) {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Format update time
function formatUpdateTime(isoTime) {
    try {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "Just now";
    }
}

// Core Geolocation & Weather Initializer
async function initDashboard() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const dashboardContent = document.getElementById('dashboardContent');
    const errorMessage = document.getElementById('errorMessage');

    // Reset visibility states
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    dashboardContent.classList.add('hidden');

    try {
        // Step 1: Query Geolocation using Client IP Address
        let geoData;
        try {
            const geoResponse = await fetch('http://ip-api.com/json/');
            if (!geoResponse.ok) throw new Error("Primary location fetch failed");
            geoData = await geoResponse.json();
        } catch (e) {
            // Fallback: Query HTTPS-supporting service if HTTP IP-API fails or gets blocked
            const fallbackResponse = await fetch('https://ipapi.co/json/');
            if (!fallbackResponse.ok) throw new Error("Unable to locate client IP context");
            const rawFallback = await fallbackResponse.json();
            
            geoData = {
                status: "success",
                city: rawFallback.city,
                regionName: rawFallback.region,
                country: rawFallback.country_name,
                countryCode: rawFallback.country_code,
                query: rawFallback.ip,
                lat: rawFallback.latitude,
                lon: rawFallback.longitude,
                isp: rawFallback.org,
                timezone: rawFallback.timezone
            };
        }

        if (geoData.status !== "success" && !geoData.lat) {
            throw new Error("Geolocation parser failed to retrieve lat/lon coordinates.");
        }

        // Step 2: Query weather & daily forecasts from Open-Meteo
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geoData.lat}&longitude=${geoData.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error("Weather request failed");
        const weatherData = await weatherResponse.json();

        // Step 3: Populate DOM Elements
        // Geolocation Data
        document.getElementById('geoCity').textContent = geoData.city || 'Local Area';
        document.getElementById('geoFlag').textContent = getFlagEmoji(geoData.countryCode);
        document.getElementById('geoRegion').textContent = `${geoData.regionName || ''}, ${geoData.country || ''}`;
        document.getElementById('geoIP').textContent = geoData.query || 'N/A';
        document.getElementById('geoCoords').textContent = `${geoData.lat.toFixed(4)}° N, ${geoData.lon.toFixed(4)}° E`;
        document.getElementById('geoISP').textContent = geoData.isp || 'N/A';
        document.getElementById('geoTimezone').textContent = geoData.timezone || 'N/A';

        // Weather Data
        const current = weatherData.current_weather;
        if (!current) throw new Error("Weather object structure missing");

        const temp = Math.round(current.temperature);
        const wind = current.windspeed;
        const windDir = getWindDirectionText(current.winddirection);
        const code = current.weathercode;
        const time = formatUpdateTime(current.time);
        
        // Custom simple "feels like" approximation (Open-Meteo doesn't provide apparent temperature on keyless current block without adding variables)
        const apparentTemp = temp; 

        // Resolve weather code meta
        const weatherMeta = weatherCodeMap[code] || { text: "Cloudy", icon: "cloud" };

        document.getElementById('weatherTemp').textContent = temp;
        document.getElementById('weatherWind').textContent = `${wind} km/h`;
        document.getElementById('weatherWindDir').textContent = windDir;
        document.getElementById('weatherFeels').textContent = apparentTemp;
        document.getElementById('weatherTime').textContent = time;
        document.getElementById('weatherDesc').textContent = weatherMeta.text;

        // Render matching main weather icon
        const iconContainer = document.getElementById('weatherIcon');
        iconContainer.innerHTML = `<i data-lucide="${weatherMeta.icon}" class="${weatherMeta.icon === 'sun' ? 'sun-glow' : ''}"></i>`;

        // Render 3-Day Forecast Cards
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';
        
        const daily = weatherData.daily;
        if (daily && daily.time) {
            // Start from index 1 to show Day +1, Day +2, Day +3
            for (let i = 1; i <= 3; i++) {
                const dayName = getDayName(daily.time[i]);
                const forecastCode = daily.weathercode[i];
                const maxTemp = Math.round(daily.temperature_2m_max[i]);
                const minTemp = Math.round(daily.temperature_2m_min[i]);
                const forecastMeta = weatherCodeMap[forecastCode] || { text: "Cloudy", icon: "cloud" };

                const cardHtml = `
                    <div class="forecast-card">
                        <span class="forecast-day">${dayName}</span>
                        <div class="forecast-icon">
                            <i data-lucide="${forecastMeta.icon}"></i>
                        </div>
                        <span class="forecast-desc" style="font-size: 10px; color: var(--text-secondary); text-align: center;">${forecastMeta.text}</span>
                        <div class="forecast-temps">
                            <span class="forecast-max">${maxTemp}°</span>
                            <span class="forecast-min">${minTemp}°</span>
                        </div>
                    </div>
                `;
                forecastGrid.insertAdjacentHTML('beforeend', cardHtml);
            }
        }

        // Initialize / Refresh Leaflet Map
        // Remove existing map instance if doing a refetch refresh
        if (mapInstance !== null) {
            mapInstance.remove();
            mapInstance = null;
        }

        // Initialize Leaflet Map centered on geolocation coords
        setTimeout(() => {
            try {
                mapInstance = L.map('map', {
                    zoomControl: false,
                    attributionControl: false
                }).setView([geoData.lat, geoData.lon], 12);

                // Adding high-quality Dark Map Tiles from CartoDB
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19
                }).addTo(mapInstance);

                // Add a glowing indicator circle at the coordinates
                L.circle([geoData.lat, geoData.lon], {
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.2,
                    radius: 1200
                }).addTo(mapInstance);

                // Add a marker pointing to coordinates
                L.marker([geoData.lat, geoData.lon]).addTo(mapInstance);
            } catch (e) {
                console.error("Map initialization failed:", e);
            }
        }, 100);

        // Refresh dynamic icons
        lucide.createIcons();

        // Reveal the main dashboard
        loadingState.classList.add('hidden');
        dashboardContent.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        errorMessage.textContent = err.message || "An unexpected error occurred while parsing geolocation data.";
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        lucide.createIcons();
    }
}

// API Spec Modal Controls
function toggleApiModal() {
    const modal = document.getElementById('apiModal');
    modal.classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}

// Auto-run on load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
