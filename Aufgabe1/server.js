const express = require('express');
const axios = require('axios');
const currentPort = 3000;
const app = express();

app.use(express.json());

let counter = 0;

function getOtherBackends() {
    return process.env.otserv.split(',').map(name => `http://${name}:3000`);
}

function simulateLatency() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 200));
}

app.get('/increment', async (req, res) => {
    await simulateLatency();
    counter++;
    await Promise.all(
        getOtherBackends().map(url =>
            axios.post(`${url}/sync`, { value: counter }).catch(() => null)
        )
    );
    res.json({ counter });
});


app.get('/count', (req, res) => {
    res.json({ counter });
});


app.post('/sync', (req, res) => {
    counter = req.body.value;
    res.json({ counter });
});

app.listen(currentPort, async () => {
    counter = await highestNum();
    console.log(`Server running on port ${currentPort}`);
});

async function highestNum() {
  const counters = await Promise.all(
    getOtherBackends().map(url =>
      axios.get(`${url}/count`).then(r => r.data.counter).catch(() => 0)
    )
  );
  return Math.max(counter, ...counters);
}
