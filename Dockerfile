# Utiliser une image Node.js officielle
FROM node:16-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de l'API
EXPOSE 3000

# Commande pour lancer l'API
CMD ["npm", "run", "api-start"]
