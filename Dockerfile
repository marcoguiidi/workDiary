# Usa un'immagine di base Node.js
FROM node:14

# Imposta la cartella di lavoro
WORKDIR /app

# Copia i file di configurazione del server
COPY package*.json ./
# Installa le dipendenze del server
RUN npm install

# Copia il resto del codice
COPY . .

# Installa le dipendenze del client e costruisci l'app
WORKDIR /app/client

RUN npm install && npm run build

# Torna alla cartella principale
WORKDIR /app

# Espone la porta del server
EXPOSE 5000

# Comando per avviare il server
CMD ["node", "server.js"]
