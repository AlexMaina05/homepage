# 🚀 HomeServer Hub - Dashboard & PWA Microservizi

Dashboard web moderna, reattiva e installabile come **Web App (PWA) nativa su Windows** (con icona desktop, barra delle applicazioni e finestra dedicata senza bordi del browser) per accedere a tutti i microservizi del tuo server.

---

## 📦 Container Docker Standalone

Il progetto è configurato per girare come **container Docker indipendente** e ultra-leggero (basato su `nginx:alpine`, ~25 MB):

### Avvio rapido con Docker Compose
Dalla cartella del progetto:
```bash
docker compose up -d --build
```
La dashboard sarà immediatamente attiva su:
👉 **`http://<IP-DEL-TUO-SERVER>:8085`** *(o la porta che preferisci nel docker-compose.yml)*

---

## 🐳 Distribuzione tramite Portainer (Stack)

Se preferisci avviarla direttamente dall'interfaccia di Portainer visibile nei tuoi container:

1. Apri **Portainer** (`:9000` o `:9443`) → vai su **Stacks** → **Add Stack**.
2. Assegna il nome (es. `homepage` o `homeserver-hub`).
3. Seleziona **Repository** (se carichi su Git) oppure incolla il contenuto di [docker-compose.yml](file:///e:/code/homepage/docker-compose.yml) in **Web Editor**.
4. Clicca su **Deploy the stack**.

---

## 🪟 Come installare l'App su Windows (PWA)

Una volta avviato il container sul server:

1. Apri **Microsoft Edge** o **Google Chrome** sul tuo PC Windows.
2. Naviga all'indirizzo della dashboard: `http://<IP-DEL-TUO-SERVER>:8085`.
3. In alto a destra:
   - Clicca sul pulsante **"Installa App"** nella barra superiore della dashboard, **oppure**
   - Fai clic sull'icona **"Installa app"** (il monitor con la freccia) direttamente nella barra degli indirizzi del browser.
4. Conferma l'installazione:
   - L'applicazione verrà installata su Windows con il suo eseguibile dedicato.
   - Puoi aggiungerla alla **Barra delle applicazioni** o al **Menu Start**.
   - Si aprirà come un'app nativa senza le barre e le schede del browser.

---

## ⚙️ Funzionalità Incluse

- **Tutti i tuoi microservizi preconfigurati**:
  - 🏠 **Home Assistant** (`:8123`)
  - 🔊 **Music Assistant** (`:8095`)
  - 📹 **go2rtc** (`:1984`)
  - 🎵 **Navidrome** (`:4533`)
  - ⬇️ **MeTube** (`:9080`)
  - ⚡ **n8n** (`:5678`)
  - 📦 **Portainer** (`:9000`)
  - 🛡️ **Nginx Proxy Manager** (`:81`)
  - 🔌 **Servizi di background** (Mosquitto MQTT `:1883`, Cloudflare Tunnel, Matter Server, PS5 MQTT, AirConnect) con interruttore per visualizzarli o nasconderli.
- **Navigazione Integrata**:
  - Cliccando su un microservizio, questo si apre all'interno della stessa app con barra superiore per tornare indietro alla Home con un clic (o premendo `ESC`).
  - Pulsante per aprire in nuova scheda o in finestra popout separata.
- **Configurazione Dinamica dell'Host**:
  - Dalle **Impostazioni** (icona ingranaggio) puoi cambiare l'indirizzo IP del server in 1 secondo (es. `192.168.1.100` o dominio personalizzato). Tutti i link si aggiorneranno all'istante.
- **Aggiunta e Modifica Servizi**:
  - Puoi aggiungere nuovi servizi, modificare porte, nomi, icone e colori direttamente dall'interfaccia.
  - Salvataggio automatico locale con supporto per **Esporta / Importa `services.json`** e ripristino predefiniti.
- **Ricerca Rapida**:
  - Filtro in tempo reale premendo il tasto `/` da tastiera.
  - Filtri per categoria: *Domotica*, *Media*, *Automazione*, *Infrastruttura*.
  - Sezione *Preferiti Rapidi* (contrassegna con la stella ⭐ i servizi che usi più spesso).
