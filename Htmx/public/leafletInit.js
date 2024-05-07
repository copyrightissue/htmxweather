// depreciated code, replaced by radar.html
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing map');

    if (typeof L === 'undefined') {
        console.error('Leaflet is not available');
        return;
    }

    // Initialize the map
    var map = L.map('map').setView([47.0166, -113.8009], 6);

    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    console.log('Base layer added');

    // Add RainViewer Radar Layer
    var radarLayer = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/nowcast/{z}/{x}/{y}/1/1_1.png', {
        tileSize: 512,
        zoomOffset: -1,
        opacity: 0.6,
        attribution: 'RainViewer'
    }).addTo(map);

    console.log('Radar layer added');
});
