# Lånekortet i en container. Byggd på en kväll, "funkar hos mig" /byrån
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "--port", "4173"]
