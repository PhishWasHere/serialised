FROM node:18.18.0
WORKDIR /src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm i
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
