FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8545

# Start local Hardhat node & deploy contracts automatically
CMD ["./docker-entrypoint.sh"]
