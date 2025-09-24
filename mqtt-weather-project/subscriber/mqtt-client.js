import mqtt from 'mqtt';


const url = 'mqtt://localhost:1883'


const client = mqtt.connect(url)
client.on('connect', function () {
    console.log('connected')
    client.subscribe('weather', function (err) {
        if (!err) {
            client.publish('topic0', 'hello mqtt')
        }
    })
})

let stations = {};
let lastConnect = {};
let outLog = [];

client.on('message', function (topic, message) {
    const data = JSON.parse(message.toString());


    if (data.temperature < -40) {
        data.temperature = "Sensor error";
    };

    if (data.humidity > 100) {
        data.humidity = "Sensor error";
    };

     stations[data.stationId] = {
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: data.timestamp,
        status: "Connected"
    };

    lastConnect[data.stationId] = Date.now();

       renderTable();

}); 

function renderTable() {
    console.clear();
    console.table(stations);

    if (outLog.length > 0) {
        console.log("Ausfall-Protokoll:");
        outLog.forEach(entry => {
            console.log(`Station: ${entry.stationId} | Ausfall: ${entry.outLog}`);
        });
}}
setInterval(() => {
    const now = Date.now();
    Object.entries(lastConnect).forEach(([stationId, timestamp]) => {
        if (now - timestamp > 30000) {
            if (stations[stationId].status !== "ALARM Station meldet seit mindestens 30s keine Daten") {
                stations[stationId].status = "ALARM Station meldet seit mindestens 30s keine Daten";
                outLog.push({
                    stationId: stationId,
                    outLog: new Date(now).toISOString()
                });
            }
        }
    });
    renderTable();
}, 5000);