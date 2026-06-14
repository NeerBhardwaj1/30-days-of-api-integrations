/**
 * Day 02: Space Dashboard (NASA APOD & ISS Tracker)
 * Core logic for querying NASA astronomy media and polling live ISS coordinates.
 */

// Custom satellite icon for Leaflet marker representation
let issIcon = null;
let issMap = null;
let issMarker = null;
let issPath = null;
const pathCoordinates = [];

// Timer configuration for polling
let updateCountdown = 5;
let timerInterval = null;

// Core Dashboard Initializer
async function initDashboard() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const dashboardContent = document.getElementById('dashboardContent');
    const errorMessage = document.getElementById('errorMessage');

    // Reset visibility
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    dashboardContent.classList.add('hidden');

    try {
        // Step 1: Fetch NASA APOD (Astronomy Picture of the Day)
        // Using DEMO_KEY (publicly available with basic rate-limiting)
        const apodResponse = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        if (!apodResponse.ok) throw new Error("NASA APOD API request limit hit or service down");
        const apodData = await apodResponse.json();

        // Populate APOD details
        document.getElementById('apodDate').textContent = formatDate(apodData.date);
        document.getElementById('apodTitle').textContent = apodData.title || "Cosmic Photo";
        document.getElementById('apodCopyright').textContent = apodData.copyright ? `© ${apodData.copyright}` : "Public Domain (NASA)";
        document.getElementById('apodExplanation').textContent = apodData.explanation || "No explanation provided.";

        // Handle Media Type (NASA APOD returns YouTube video embeds sometimes)
        const imgEl = document.getElementById('apodImg');
        const videoContainer = document.getElementById('apodVideoContainer');
        const videoEl = document.getElementById('apodVideo');
        const fallbackEl = document.getElementById('apodMediaFallback');

        if (apodData.media_type === "video") {
            videoEl.src = apodData.url;
            videoContainer.classList.remove('hidden');
            imgEl.classList.add('hidden');
            fallbackEl.classList.add('hidden');
        } else {
            imgEl.src = apodData.url;
            imgEl.onload = () => {
                fallbackEl.classList.add('hidden');
                imgEl.classList.remove('hidden');
            };
            imgEl.onerror = () => {
                fallbackEl.innerHTML = "<span>Failed to render image</span>";
            };
            videoContainer.classList.add('hidden');
        }

        // Step 2: Fetch Initial ISS location to initialize Leaflet Map
        const issResponse = await fetch('http://api.open-notify.org/iss-now.json');
        if (!issResponse.ok) throw new Error("ISS live orbital tracker service is down");
        const issData = await issResponse.json();

        if (issData.message !== "success") throw new Error("Invalid ISS telemetry data received");

        const lat = parseFloat(issData.iss_position.latitude);
        const lon = parseFloat(issData.iss_position.longitude);

        // Populate initial coordinates
        updateCoordinatesUI(lat, lon);

        // Reveal dashboard layout
        loadingState.classList.add('hidden');
        dashboardContent.classList.remove('hidden');

        // Step 3: Initialize Leaflet Map centered on ISS
        setTimeout(() => {
            initializeMap(lat, lon);
            // Start the 5-second polling system
            startTelemetryPoll();
        }, 100);

    } catch (err) {
        console.error(err);
        errorMessage.textContent = err.message || "An unexpected error occurred while parsing Space APIs.";
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        lucide.createIcons();
    }
}

// Map setup helper
function initializeMap(initialLat, initialLon) {
    if (issMap !== null) {
        issMap.remove();
        issMap = null;
    }

    try {
        // Setup Map container
        issMap = L.map('issMap', {
            zoomControl: false,
            attributionControl: false
        }).setView([initialLat, initialLon], 3);

        // Add Dark Map Tiles from CartoDB
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18
        }).addTo(issMap);

        // Custom Satellite Icon representing the ISS
        issIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
            iconSize: [40, 25],
            iconAnchor: [20, 12]
        });

        // Add orbital flight path polyline (trail)
        issPath = L.polyline(pathCoordinates, {
            color: '#A855F7', // Purple trail line
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10'
        }).addTo(issMap);

        // Add coordinate point to trail
        addCoordinateToTrail(initialLat, initialLon);

        // Create Marker with custom satellite icon
        issMarker = L.marker([initialLat, initialLon], { icon: issIcon }).addTo(issMap);
    } catch (e) {
        console.error("Leaflet initialization error:", e);
    }
}

// Polling timer loop
function startTelemetryPoll() {
    // Clear any existing intervals
    if (timerInterval) clearInterval(timerInterval);

    updateCountdown = 5;
    document.getElementById('updateTimer').textContent = `${updateCountdown}s`;

    timerInterval = setInterval(async () => {
        updateCountdown--;
        if (updateCountdown <= 0) {
            // Trigger API fetch
            document.getElementById('updateTimer').textContent = "Updating...";
            await fetchISSTelemetry();
            updateCountdown = 5;
        }
        document.getElementById('updateTimer').textContent = `${updateCountdown}s`;
    }, 1000);
}

// Fetch live coordinates and update map
async function fetchISSTelemetry() {
    try {
        const res = await fetch('http://api.open-notify.org/iss-now.json');
        if (!res.ok) throw new Error("ISS request failed");
        const data = await res.json();

        if (data.message === "success" && issMarker && issMap) {
            const lat = parseFloat(data.iss_position.latitude);
            const lon = parseFloat(data.iss_position.longitude);

            // Update UI
            updateCoordinatesUI(lat, lon);

            // Update Marker location
            issMarker.setLatLng([lat, lon]);

            // Add point to trail and update path line
            addCoordinateToTrail(lat, lon);

            // Pan map smoothly to follow ISS
            issMap.panTo([lat, lon]);
        }
    } catch (e) {
        console.warn("Failed to poll ISS position:", e);
        document.getElementById('updateTimer').textContent = "Retry in 5s";
    }
}

// Update UI Labels
function updateCoordinatesUI(lat, lon) {
    document.getElementById('issLat').textContent = `${lat.toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
    document.getElementById('issLon').textContent = `${lon.toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
}

// Add path trail coordinate helper
function addCoordinateToTrail(lat, lon) {
    pathCoordinates.push([lat, lon]);
    
    // Cap path coords to last 50 points to prevent DOM load issues
    if (pathCoordinates.length > 50) {
        pathCoordinates.shift();
    }
    
    if (issPath) {
        issPath.setLatLngs(pathCoordinates);
    }
}

// Helper: Format date strings beautifully
function formatDate(dateStr) {
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
        return dateStr;
    }
}

// UI triggers: Accordion toggling
function toggleAccordion() {
    const content = document.getElementById('accordionContent');
    const trigger = document.querySelector('.accordion-trigger');
    const icon = document.getElementById('accordionIcon');

    content.classList.toggle('hidden');
    trigger.classList.toggle('active');

    if (content.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = 'rotate(180deg)';
    }
}

// Modal controls
function toggleApiModal() {
    document.getElementById('apiModal').classList.toggle('hidden');
}

function closeApiModalOutside(e) {
    if (e.target.id === 'apiModal') {
        toggleApiModal();
    }
}

// Clean up intervals when leaving page
window.addEventListener('beforeunload', () => {
    if (timerInterval) clearInterval(timerInterval);
});

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
