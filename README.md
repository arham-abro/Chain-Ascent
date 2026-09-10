# ✈️ ChainAscent — Web3 Aviator Crash Game Ecosystem

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity_^0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)

ChainAscent is a full-stack, containerized Web3 crash game ecosystem inspired by Spribe's official Aviator game. Built with a 5-tier architecture, it features a 60+ FPS HTML5 Canvas engine, HMAC-SHA256 provably fair seed cryptography, dual betting controls, synthesized web audio, real-time backend orchestration, PostgreSQL state persistence, and a local Ethereum EVM smart contract backend.

---

## 🌟 Key Features

- **🎮 HTML5 Canvas Flight Engine**: Smooth 60+ FPS flight curve animation featuring crimson sunburst rays, glowing vector flight paths, propeller animations, and explosion particle FX.
- **🔐 HMAC-SHA256 Provably Fair Engine**: Mathematically verified crash multipliers calculated using unalterable server and client seed cryptography.
- **⚡ Dual Independent Betting Panels**: Place two separate bets per flight round with automated or instant manual cashout controls.
- **🎵 Native Web Audio Synthesizer**: Custom real-time audio pitch modulation for engine noise, background music, cashout chimes, and explosion FX without external audio assets.
- **⛓️ Smart Contract Integration**: Solidity `MultiplierGame.sol` smart contract implementing Checks-Effects-Interactions (CEI) reentrancy guards on Hardhat EVM.
- **🌐 Global Mobile Remote Access**: Cloudflare Tunnel integration allowing zero-config remote access on mobile devices.

---

## 🏗️ Ecosystem Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14 - Port 3000)           │
│           HTML5 Canvas Engine • Dual Betting • Web Audio        │
└───────────────┬─────────────────────────────────┬───────────────┘
                │ GET /api/game/status            │ JSON-RPC (eth_call)
                │ GET /api/game/provably-fair     │ Port 8545
                ▼                                 ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│     BACKEND (Express API)     │ │   BLOCKCHAIN (Hardhat EVM)    │
│    Port 5000 (Provably Fair)  │ │      Port 8545 (Solidity)     │
└───────────────┬───────────────┘ └───────────────────────────────┘
                │ SQL Connection Pool
                ▼
┌───────────────────────────────┐
│   DATABASE (PostgreSQL 15)    │
│          Port 5432            │
└───────────────────────────────┘
```

---

## 🚀 Quick Start Guide (For Evaluation / Running on Teacher's PC)

### Prerequisites
Make sure **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (or Docker Engine) is installed on your computer.

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/chainascent.git
cd chainascent
```

### Step 2: Launch the Entire Stack with One Command
```bash
docker compose up --build -d
```
*Docker will automatically build and launch all 5 services: Frontend, Backend API, PostgreSQL DB, Hardhat EVM Node, and Cloudflare Tunnel.*

### Step 3: Open in Browser
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:5000/api/game/status](http://localhost:5000/api/game/status)
- **Hardhat Blockchain RPC**: `http://localhost:8545`

### Step 4: Access on Mobile / Share Remote Link
To grab the active Cloudflare Tunnel URL:
```bash
docker compose logs tunnel
```
Look for the link printed in logs: `https://xxxx.trycloudflare.com`.

### Stop the Application
```bash
docker compose down
```

---

## 📁 Repository Structure

```
chainascent/
├── frontend/             # Next.js 14 App Router, Canvas Flight Engine, Audio Engine
│   ├── src/
│   │   ├── components/   # Canvas, Dual Betting Controls, Live Stats, Provably Fair Modal
│   │   └── utils/        # Web Audio Synthesizer
│   └── Dockerfile
├── backend/              # Express API, HMAC Provably Fair Engine, Database Models
│   ├── index.js          # Game Loop State Machine
│   └── Dockerfile
├── blockchain/           # Hardhat Node, Solidity Smart Contract, Deploy Scripts
│   ├── contracts/        # MultiplierGame.sol
│   └── Dockerfile
├── docker-compose.yml    # Multi-container orchestration (Frontend, Backend, DB, Blockchain, Tunnel)
└── README.md             # Technical Documentation
```

---

## 💻 Manual Setup (Without Docker)

If you prefer running services individually using Node.js:

1. **Start Blockchain**:
   ```bash
   cd blockchain
   npm install
   npx hardhat node --hostname 0.0.0.0
   ```
2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📜 License & Compliance
Built as part of the CCP (Complex Computer Project) Web3 Aviator Simulation submission. All cryptographic seed logic follows industry-standard HMAC-SHA256 provably fair specifications.
