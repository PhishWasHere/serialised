FROM node:18.18.0
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build 
COPY .env ./dist
WORKDIR ./dist
EXPOSE 3000
CMD ["npm", "run", "start"]
