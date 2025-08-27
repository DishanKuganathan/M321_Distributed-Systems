# Aufgabe: Caching mit Redis

## Ziel

Implementiere Caching mit Redis in einem bestehenden Node.js/Express-Projekt, um die Antwortzeiten beim Abrufen von Pokémon-Daten zu optimieren.

---

## Ausgangslage

Du erhältst ein funktionierendes Projekt mit:

- einem Express-Server (`server.js`)
- einer statischen HTML-Seite (`public/index.html`)
- einem JavaScript-Client (`public/main.js`), der 100 Pokémon über `/api/pokemon/:name` abruft
- einer API `/api/list`, die eine Liste mit 100 Pokémon-Namen liefert
- kein Caching ist implementiert

Aktuell werden alle Anfragen direkt an die öffentliche [PokeAPI](https://pokeapi.co) weitergeleitet. Dadurch entstehen bei vielen Requests unnötig lange Ladezeiten.

---

## Aufgabe

Deine Aufgabe ist es, ein Caching mit Redis im Backend (_server.js_) zu implementieren. Ziel ist, dass bereits abgerufene Pokémon-Daten nicht erneut von der PokeAPI geladen werden müssen.

Bitte stelle sicher, dass die Daten nicht ewig nur aus dem Cache geladen werden.

### Schritte

1. **Redis starten**

Im Projekt liegt ein docker-compose.yaml mit dem Befehl _docker-compose up_ lässt sich so ein Redis Server auf dem konfigurierten Port starten.

Um Redis in node.js zu verwenden nutzt: https://github.com/redis/node-redis


