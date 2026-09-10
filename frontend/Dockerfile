FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy all local files into the image
COPY . .

# Build the Next.js application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
