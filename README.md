# 🚀 HomeServer Hub - Dashboard & PWA Microservizi

Dashboard web moderna, reattiva e installabile come **Web App (PWA) nativa su Windows 11/10** (con Window Controls Overlay, Jump List nella barra delle applicazioni, Command Palette e sistema Multi-Tab) per accedere e gestire tutti i microservizi del tuo server.

---

## 📦 Container Docker Standalone

Il progetto è configurato per girare come **container Docker indipendente** e ultra-leggero (basato su `nginx:alpine`, ~25 MB):

### Avvio rapido con Docker Compose
Dalla cartella del progetto:
```bash
docker compose up -d --build
```
La dashboard sarà immediatamente attiva su:
👉 **`http://<IP-DEL-TUO-SERVER>:8085`** *(o la porta che preferisci nel `docker-compose.yml`)*

---

## 🐳 Distribuzione tramite Portainer (Stack)

Se preferisci avviarla direttamente dall'interfaccia di Portainer visibile nei tuoi container:

1. Apri **Portainer** (`:9000` o `:9443`) → vai su **Stacks** → **Add Stack**.
2. Assegna il nome (es. `homepage` o `homeserver-hub`).
3. Seleziona **Repository** oppure incolla il contenuto di [docker-compose.yml](file:///e:/code/homepage/docker-compose.yml) in **Web Editor**.
4. Clicca su **Deploy the stack**.

---

## 🪟 Funzionalità Avanzate Windows 11 & PWA (Punto 1, 3, 4)

### 1. 🪟 Integrazione Windows 11 Desktop (PWA)
- **Jump List nella Barra delle Applicazioni**: Facendo clic destro sull'icona dell'app nella barra delle applicazioni di Windows, compaiono i collegamenti rapidi per aprire direttamente *Home Assistant*, *Portainer*, *Navidrome*, *MeTube* o *n8n*.
- **Window Controls Overlay (WCO)**: La barra superiore dell'applicazione si fonde in modo fluido con i tasti nativi della finestra di Windows (Riduci a icona, Ingrandisci, Chiudi), permettendo di trascinare la finestra dall'header (`app-region: drag`).
- **Command Palette Globale (`Ctrl + K`)**: Premi `Ctrl + K` in qualsiasi momento per aprire la barra di ricerca rapida in stile Spotlight/Raycast: naviga con le frecce della tastiera e premi `Invio` per aprire qualsiasi microservizio o azione.
- **Scorciatoia Schede (`Ctrl + W` / `ESC`)**: Chiudi la scheda corrente al volo senza toccare il mouse.

### 2. 📑 Sistema Multi-Tab Integrato (All-in-One Workspace)
- Tieni aperti contemporaneamente più microservizi (es. **Portainer**, **Home Assistant**, **MeTube** e la **Dashboard**) in schede separate in alto.
- **Nessuna perdita di stato**: Passando da una scheda all'altra, gli iframe rimangono vivi in background. Se stavi leggendo i log di un container in Portainer o un download in MeTube, la sessione non si ricarica!
- Barra comandi per ogni scheda: Ricarica rapida, apertura in popup esterno o nuova scheda del browser.

### 3. 🧩 Mini-Widget Interattivi
- **MeTube Quick Downloader**: Incolla qualsiasi link video (YouTube, TikTok, ecc.) direttamente dalla dashboard per inviarlo immediatamente al tuo container MeTube.
- **Docker & Portainer Hub**: Panoramica in tempo reale del numero di container totali e con Web UI, con scorciatoia a Portainer.
- **Media & Audio Player**: Accesso istantaneo con un clic ai player di rete *Navidrome* e *Music Assistant*.

---

## ⚙️ Gestione Servizi & Backup

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
- **Configurazione Dinamica dell'Host**:
  - Dalle **Impostazioni** (icona ingranaggio) puoi cambiare l'indirizzo IP del server in 1 secondo (es. `192.168.1.100` o dominio personalizzato). Tutti i link si aggiornano all'istante.
- **Aggiunta e Modifica Servizi**:
  - Puoi aggiungere nuovi servizi, modificare porte, nomi, icone e colori direttamente dall'interfaccia.
  - Salvataggio automatico locale con supporto per **Esporta / Importa `services.json`** e ripristino predefiniti.
