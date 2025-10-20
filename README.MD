# 🚀 AstroZeit: Die ultimative kosmische Kaffeemaschinensteuerung (für Berlin!)

| 🇩🇪 Deutsche Version | 🇬🇧 English Version (coming soon, maybe) |
| :--- | :--- |
| **Status:** Läuft! (Hoffentlich) | **Lizenz:** Freie Radikale |



---

## 🧐 Das Problem: Die Sonne ist unpünktlich

Kennst du das? Du sitzt in Berlin, wartest auf den perfekten Moment für deinen *zweiten* Kaffee, aber die **Sonne** ☀️ hält sich einfach nicht an deinen Zeitplan. Mal geht sie *nautisch* unter, mal *astronomisch*. Wer soll da noch durchblicken?!

**Die Lösung:** Unser kleines, aber **mächtiges** iobroker-Skript, das die Himmelsmechanik zwingt, in DEIN Smart Home einzuziehen!

---

## 🌌 Was dieses Skript tut (und was nicht)

### 🥇 Was es kann:

* **Sonnenzeiten berechnen:** Von `sunrise` bis `astronomicalDusk` – wir haben das volle Himmelsprogramm!
* **Datenpunkte erstellen:** Sorgfältig sortiert unter `0_userdata.0.sonnenzeit`. Jetzt weiß deine Logik, wann die *goldene Stunde* für Selfies ist.
* **Doppelte Ausführung:** Es speichert die Zeiten sowohl als **Unix Timestamp** (für die Nerds) als auch als **HH:MM String** (für die, die nur wissen wollen, wann es dunkel wird).
* **100% Berlin-zentriert:** Mit `52.52` und `13.405` sind wir so lokal, es riecht fast nach Döner.
    *(P.S. Wenn du nicht in Berlin wohnst: **PECH GEHABT!** Oder ändere die Koordinaten – aber pssst, das ist ein Geheimtipp).*

### 🥈 Was es NICHT kann:

* **Kaffee kochen:** Aber es liefert dir die genaue Zeit, wann du am besten damit anfangen solltest.
* **Das Wetter vorhersagen:** Die Sonne ist *da*, der Regen auch.
* **Deine iobroker-Instanz reparieren:** Wenn es abstürzt, war's die Schwerkraft.

---

## 🛠️ Installation & Inbetriebnahme (Easy Peasy, Astro-Squeezy)

1.  **Stelle sicher, dass iobroker läuft.** (Ein Muss, sonst wird's nix mit der Heimautomation.)
2.  **Öffne den JavaScript-Adapter.** (Sollte klar sein.)
3.  **Füge das `SunCalc`-Modul hinzu.** (Ohne Sonnenuhr keine Sonnenzeit. Meistens ist es aber schon da – *Gott sei Dank!*)
4.  **Kopiere den gesamten Code** in ein neues Skript (nenn es `AstroZeit.js` oder `Chefkoch_der_Sonnenzeiten`).
5.  **Speichern und starten.**
6.  **Schau in den Log:** Wenn da steht: `"Sonnenzeiten wurden unter 0_userdata.0.sonnenzeit erstellt/aktualisiert."`, dann hast du die Himmelsmechanik besiegt!

---

## 📜 Der Code (Die Magie geschieht in den Tiefen des JS)

```javascript
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


👨‍🔬 About: Der Schöpfer und das Chaos

AstroZeit ist ein Nebenprodukt der verzweifelten Suche nach dem perfekten Moment, um die Rolläden zu schließen, damit die Nachbarn nicht das Chaos im Wohnzimmer sehen. Entwickelt in einer schlaflosen Nacht, in der die Sonne einfach nicht wusste, ob sie auf- oder untergehen soll.

Philosophie: Warum raten, wann die nauticalDusk ist, wenn man es auch wissen kann? Die Menschheit ist auf dem Mond gelandet – wir können auch die Dämmerung in einem iobroker-Datenpunkt erfassen!

Disclaimer: Für Fehler in der Himmelsmechanik oder falsche Sonnenzeiten aufgrund von Zeitzonenwechseln lehnen wir jede Verantwortung ab. Frag die Sonne, nicht den Coder! 🤪