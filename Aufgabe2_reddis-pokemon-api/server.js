import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
app.use(express.static(path.join(__dirname, 'public')));

//redis create client
const client = await createClient({ url: 'redis://localhost:6379' })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
// für test von cachetime
// await client.flushAll();


app.get('/api/pokemon/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();
  const cache_time = 20;

  try {

    //von redis holen
    const cached = await client.get(name);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const lean = {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      height: data.height,
      weight: data.weight,
      types: data.types.map(t => t.type.name),
      stats: Object.fromEntries(data.stats.map(s => [s.stat.name, s.base_stat])),
    };

    //in redis speicher wenn nicht vorhanden
    await client.setEx(name, cache_time, JSON.stringify(lean));

    res.json(lean);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch Pokémon.' });
  }
});

app.get('/api/list', async (_, res) => {
  try {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    res.json(data.results.map((p) => p.name));
  } catch {
    res.status(500).json({ error: 'Could not fetch Pokémon list.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
