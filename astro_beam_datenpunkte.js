// iobroker Script: Sonnenzeiten berechnen und Datenpunkte erstellen
// Zielverzeichnis: 0_userdata.0.sonnenzeit

// 1️⃣ Koordinaten für Berlin
const latitude = 52.52;
const longitude = 13.405;

// 2️⃣ SunCalc laden (in iobroker ist sie meist verfügbar, ansonsten über javascript-Adapter als npm-Modul)
const SunCalc = require('suncalc');

// 3️⃣ Aktuelles Datum
const now = new Date();

// 4️⃣ Sonnenzeiten berechnen
const times = SunCalc.getTimes(now, latitude, longitude);

// 5️⃣ Funktion zum Formatieren als HH:MM
function formatTime(date) {
    const h = date.getHours().toString().padStart(2,'0');
    const m = date.getMinutes().toString().padStart(2,'0');
    return `${h}:${m}`;
}

// 6️⃣ Datenpunkte erstellen / aktualisieren
const basePath = '0_userdata.0.sonnenzeit';

// Definition der Datenpunkte
const dpList = {
    sunrise: times.sunrise,
    sunset: times.sunset,
    solarNoon: times.solarNoon,
    dawn: times.dawn,                // Bürgerliche Dämmerung morgens
    dusk: times.dusk,                // Bürgerliche Dämmerung abends
    nauticalDawn: times.nauticalDawn,
    nauticalDusk: times.nauticalDusk,
    astronomicalDawn: times.nightEnd,
    astronomicalDusk: times.night,
    goldenHourMorning: times.goldenHourEnd,
    goldenHourEvening: times.goldenHour
};

// 7️⃣ Schleife über alle Datenpunkte
for (let key in dpList) {
    const date = dpList[key];
    if (!date) continue; // falls SunCalc keinen Wert liefert
    
    // Pfad für den Datenpunkt
    const dpPathTimestamp = `${basePath}.${key}_timestamp`;
    const dpPathString = `${basePath}.${key}_hhmm`;

    // Datenpunkt als Zahl (Unix Timestamp in Sekunden)
    if (!existsState(dpPathTimestamp)) {
        createState(dpPathTimestamp, Math.floor(date.getTime()/1000), { type: 'number', read: true, write: false });
    } else {
        setState(dpPathTimestamp, Math.floor(date.getTime()/1000), true);
    }

    // Datenpunkt als String HH:MM
    if (!existsState(dpPathString)) {
        createState(dpPathString, formatTime(date), { type: 'string', read: true, write: false });
    } else {
        setState(dpPathString, formatTime(date), true);
    }
}

// 8️⃣ Info in Log
log('Sonnenzeiten wurden unter 0_userdata.0.sonnenzeit erstellt/aktualisiert.');
