# 🚀 ChainAscent — Web3 Aviator Crash Game Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js_4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Solidity](https://img.shields.io/badge/Solidity_^0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Provably Fair](https://img.shields.io/badge/HMAC--SHA256-Provably_Fair-emerald?style=for-the-badge&logo=shield)](https://en.wikipedia.org/wiki/Provably_fair)

**ChainAscent** is a production-grade, containerized Web3 crash game ecosystem inspired by Spribe's official Aviator game. Built on a 5-tier microservice architecture, it features a 60+ FPS HTML5 Canvas engine, HMAC-SHA256 provably fair cryptography, dual independent betting controls, native Web Audio synthesis, PostgreSQL state persistence, and a local EVM smart contract node.

---

## 🌟 Key Features

- **🎮 HTML5 Canvas Flight Engine**: 60+ FPS smooth flight curve featuring animated sunburst background rays, glowing vector flight paths, propeller plane graphics, and explosion particle FX.
- **🔐 HMAC-SHA256 Provably Fair**: Cryptographically verifiable crash multipliers generated before round launch using unalterable server and client seeds.
- **⚡ Dual Independent Betting Panels**: Place two separate bets simultaneously per round with auto-cashout and real-time profit tracking.
- **🎵 Web Audio Synthesizer**: Native real-time sound pitch modulation for flight ascent, background synth, cashout chimes, and explosion FX without heavy audio assets.
- **⛓️ Smart Contract Backend**: Solidity `MultiplierGame.sol` smart contract implementing Checks-Effects-Interactions (CEI) reentrancy protection on Hardhat EVM.
- **🐳 1-Command Docker Deployment**: Fully orchestrated multi-container setup (Frontend, Backend, Database, Blockchain, Cloudflare Tunnel).
- **🌐 Global Remote Access**: Built-in Cloudflare Tunnel integration allowing zero-config remote access on mobile devices and remote networks.

---

## 🏗️ Ecosystem Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14 - Port 3000)            │
│          HTML5 Canvas Engine • Dual Betting • Web Audio         │
└───────────────┬─────────────────────────────────┬───────────────┘
                │ REST API (/api/game/status)     │ JSON-RPC (eth_call)
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

## ⚡ Quick Start Guide (For Teacher / Evaluator)

To ensure this project runs seamlessly on any computer, the entire 5-service ecosystem is containerized with Docker.

### Prerequisites
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** installed and running on Windows, macOS, or Linux.

### 1-Step Launch Command
Run the following command in the root folder of the repository:

```bash
docker compose up --build -d
```

> **Note**: Docker will automatically build the images, initialize the PostgreSQL database schema, deploy the local Hardhat blockchain, and launch the Express backend and Next.js frontend.

### 🌐 Accessing the Application
Once the containers are started (give them ~15–30 seconds to initialize):

| Service | Access URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Full Aviator Canvas Game UI |
| **Backend API** | [http://localhost:5000/api/game/status](http://localhost:5000/api/game/status) | Express Health Check & Game State |
| **Provably Fair API** | [http://localhost:5000/api/game/provably-fair](http://localhost:5000/api/game/provably-fair) | Verification Seed Logs |
| **Hardhat EVM Node** | `http://localhost:8545` | Ethereum Local Blockchain RPC |

### Stop the Containers
```bash
docker compose down
```

---

## 🛠️ Tech Stack & Tier Breakdown

| Component | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Tier 1: Frontend** | Next.js 14, Tailwind CSS, HTML5 Canvas | 60 FPS flight animation, dual betting controls, live history ribbon |
| **Tier 2: Backend** | Express.js, Node.js | Game state machine loop, seed generation, REST API endpoints |
| **Tier 3: Database** | PostgreSQL 15, `pg` Pool | Game history, crash multiplier records, and bet logs |
| **Tier 4: Blockchain** | Solidity `^0.8.20`, Hardhat EVM | Smart contract bet placement, multiplier payout verification |
| **Tier 5: Infrastructure** | Docker, Cloudflare `cloudflared` | Multi-container orchestration & public tunnel remote access |

---

## 🔐 Provably Fair Cryptography

ChainAscent uses an **HMAC-SHA256** provably fair algorithm:

1. Before every round, a secret `serverSeed` and `clientSeed` are generated.
2. An HMAC-SHA256 digest is generated from the combined seed.
3. The first 8 hex characters are converted to an integer to calculate the deterministic crash multiplier.
4. Players can verify the multiplier for any past round directly in the **Provably Fair Inspector Modal** in the UI.

---

## 💻 Manual Local Setup (Alternative to Docker)

If you prefer running services individually without Docker:

```bash
# 1. Start Hardhat EVM Blockchain
cd blockchain
npm install
npx hardhat node --hostname 0.0.0.0

# 2. In a new terminal, start Express Backend
cd backend
npm install
npm start

# 3. In a new terminal, start Next.js Frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Repository Structure

```
chainascent/
├── frontend/             # Next.js 14 App Router, Canvas Engine, Web Audio
├── backend/              # Express API, HMAC Provably Fair Engine, DB Models
├── blockchain/           # Hardhat Node, MultiplierGame.sol Smart Contract
├── docker-compose.yml    # 5-tier container orchestration
├── explain.md            # Comprehensive CCP Architecture & Compliance Report
└── README.md             # Project documentation
```

---

## 📜 Project Evaluation & Compliance
Designed and developed for the **Complex Computer Project (CCP) Web3 Aviator Simulation**. Fully compliant with all 5 mandatory tiers (Frontend, Backend, REST API, Relational DB, EVM Smart Contract).

