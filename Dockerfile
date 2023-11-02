FROM node:18.18.0
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm","run", "dev-docker"]
