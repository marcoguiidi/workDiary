# Usa un'immagine di base Node.js
FROM node:14

# Imposta la cartella di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./
# Installa le dipendenze del server
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Installa le dipendenze del client
WORKDIR /app/client
RUN npm install
# Esegui il build del client
RUN npm run build

# Torna alla cartella principale
WORKDIR /app

# Espone la porta del server (assicurati che questa corrisponda alla tua configurazione)
EXPOSE 5000

# Comando per avviare il server
CMD ["npm", "start"]
