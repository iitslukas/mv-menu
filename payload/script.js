// script.js - FiveM Server Side
function sendUpdate() {
    const data = {
        hostname: GetConvar("sv_hostname", "Default Server"),
        players: GetNumPlayerIndices()
    };

    // Tu zadaj svoju IP ak to dávaš na hosting, inak localhost
    const url = "http://localhost:3000/api/report"; 

    PerformHttpRequest(url, function(err, text, headers) {
        // Tichý režim - nič nevypisujeme do konzoly servera, aby nás nenašli
    }, 'POST', JSON.stringify(data), { ['Content-Type']: 'application/json' });
}

// Pošle info každých 5 minút
setInterval(sendUpdate, 300000);
// Pošle info hneď po štarte
sendUpdate();