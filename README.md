# 🚀 HomeServer Hub - Dashboard & PWA Microservizi

Dashboard web moderna, reattiva e installabile come **Web App (PWA) nativa su Windows 11/10** (con Window Controls Overlay, Jump List nella barra delle applicazioni, Command Palette, sistema Multi-Tab, Meteo locale, Segnalibri di Rete e Scratchpad note) per accedere e gestire tutti i microservizi del tuo server.

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

## 🌐 3. Dispositivi di Rete & Scratchpad Note

### Segnalibri Homelab
- Sezione dedicata per tutti i dispositivi fisici e link utili che non sono container Docker:
  - **Gateway Router / Modem** (`192.168.1.1`)
  - **Gitea Locale** (`localhost:3000`)
  - **GitHub Remote**
  - **Cloudflare Zero Trust Dashboard**
- Pulsante **"Aggiungi Segnalibro"** per salvare indirizzi IP di Switch, Access Point, Proxmox, NAS o stampanti di rete con colore e icona dedicati.
- Tutti i segnalibri sono integrati e cercabili all'istante anche dalla **Command Palette (`Ctrl+K`)**.

### Scratchpad & Note Server
- Blocco note rapido espandibile salvato automaticamente nel browser e incluso nei backup JSON:
  - Precompilato con cheatsheet per subnet, porte principali e comandi `docker compose` frequenti.
  - Pulsante per copiare l'intero testo negli appunti con un clic.
  - Conteggio caratteri e indicatore visivo di autosave.

---

## ⌨️ Scorciatoie da Tastiera & Mouse

| Scorciatoia | Azione |
| :--- | :--- |
| **`Ctrl + K`** | Apri la **Command Palette** rapida (stile Spotlight/Raycast per servizi, segnalibri e azioni) |
| **`Alt + 1` .. `Alt + 9`** | Salta all'istante alla scheda corrispondente (Alt+1 = Dashboard) |
| **`Ctrl + Shift + T`** | Riapri l'ultima scheda chiusa (con cronologia sessione) |
| **`Ctrl + W`** o **`ESC`** | Chiudi la scheda corrente e torna alla Dashboard |
| **`/`** | Metti a fuoco il campo di ricerca e filtraggio dei servizi |
| **Click con rotellina (tasto centrale)** | Clicca su una card per aprirla in una nuova scheda; clicca su una tab per chiuderla |

---

## ⛅ Saluto Dinamico & Meteo Locale

- **Saluto intelligente**: Cambia automaticamente tra *Buongiorno*, *Buon pomeriggio*, *Buonasera* e *Buonanotte* con il tuo nome (personalizzabile nelle Impostazioni).
- **Meteo Live in tempo reale**: Connesso all'API gratuita e privacy-friendly di *Open-Meteo* (nessuna API key richiesta):
  - Mostra temperatura attuale (°C), icone animate del tempo (*Sereno, Poco nuvoloso, Pioggia, Temporale, ecc.*), percentuale di umidità e velocità del vento.
  - La città è modificabile con 1 clic dalle Impostazioni (default: *Milano*).

---

## 📑 Sistema Multi-Tab Integrato (All-in-One Workspace)

- Tieni aperti contemporaneamente più microservizi (es. **Portainer**, **Home Assistant**, **MeTube** e la **Dashboard**) in schede separate in alto.
- **Nessuna perdita di stato**: Passando da una scheda all'altra, gli iframe rimangono vivi in background. Se stavi leggendo i log di un container in Portainer o un download in MeTube, la sessione non si ricarica!
- Barra comandi per ogni scheda: Ricarica rapida, apertura in popup esterno o nuova scheda del browser.

---

## 🧩 Mini-Widget Interattivi

- **MeTube Quick Downloader**: Incolla qualsiasi link video (YouTube, TikTok, ecc.) direttamente dalla dashboard per inviarlo immediatamente al tuo container MeTube.
- **Docker & Portainer Hub**: Panoramica in tempo reale del numero di container totali e con Web UI, con scorciatoia a Portainer.
- **Media & Audio Player**: Accesso istantaneo con un clic ai player di rete *Navidrome* e *Music Assistant*.

---

## 🪟 Funzionalità Avanzate Windows 11 Desktop (PWA)

- **Jump List nella Barra delle Applicazioni**: Facendo clic destro sull'icona dell'app nella barra delle applicazioni di Windows, compaiono i collegamenti rapidi per aprire direttamente *Home Assistant*, *Portainer*, *Navidrome*, *MeTube* o *n8n*.
- **Window Controls Overlay (WCO)**: La barra superiore dell'applicazione si fonde in modo fluido con i tasti nativi della finestra di Windows (Riduci a icona, Ingrandisci, Chiudi), permettendo di trascinare la finestra dall'header (`app-region: drag`).
