import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mqtt from 'mqtt';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  client.subscribe('weather');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    io.emit('weather', data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/health', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web-Dashboard läuft auf http://localhost:${PORT}`);
});
