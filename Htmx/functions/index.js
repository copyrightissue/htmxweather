const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const pug = require('pug');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// test case for CORS
const viewsDir = path.join(__dirname, 'views');
exports.test = onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, hx-target');
    response.send('Test function is working!');
    if(request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }
});
// Serve weather data
exports.weather = onRequest(async (request, response) => {
    const city = request.query.city || 'Missoula';
    let weatherData = {};
    let today = {};
    let forecasts = [];
    let cityInfo = {};

    try {
        // Fetch data from Firestore
        const doc = await db.collection('weather').doc(city).get();
        if (doc.exists) {
            weatherData = doc.data();
            const forecastList = weatherData.list || [];
            cityInfo = weatherData.city || { name: city };

            //  today's weather
            if (forecastList.length > 0) {
                const todayEntry = forecastList[0];
                today = {
                    temp: todayEntry.main.temp,
                    condition: todayEntry.weather[0].description,
                    humidity: todayEntry.main.humidity,
                    wind: todayEntry.wind.speed,
                    icon: todayEntry.weather[0].icon
                };
            }

            //  forecast for the next 5 days
            forecasts = forecastList.slice(1, 6).map(entry => ({
                date: entry.dt_txt.split(' ')[0],
                temp: entry.main.temp,
                condition: entry.weather[0].description,
                icon: entry.weather[0].icon
            }));
        } else {
            console.warn(`No weather data found for city: ${city}`);
        }

        //  template with city information, today's weather, and forecast
        const template = pug.compileFile(path.join(viewsDir, 'weather.pug'));
        const markup = template({ city: cityInfo, today, forecasts });
        response.set('Content-Type', 'text/html');
        response.send(markup);
    } catch (e) {
        console.error('Error fetching weather data:', e);
        response.status(500).send('Internal Server Error');
    }
});

// Serve radar data
// exports.radar = onRequest((request, response) => {
//     const template = pug.compileFile(path.join(viewsDir, 'radar.pug'));
//     const markup = template();
//
//     response.set('Content-Type', 'text/html');
//     response.send(markup);
// });
