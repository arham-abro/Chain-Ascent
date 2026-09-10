![Header](https://capsule-render.vercel.app/api?type=waving&color=ef4444&height=200&section=header&text=✈️%20ChainAscent&fontSize=50&fontColor=ffffff&animation=fadeIn&desc=Web3%20Aviator%20Crash%20Game%20Ecosystem&descSize=20&descAlignY=75)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-LIVE-22c55e?style=for-the-badge)

<br/>

> **A containerized 5-tier Web3 Aviator crash game ecosystem with real-time provably fair seed cryptography.**  
> Built with HTML5 Canvas animation engine, Web Audio pitch modulation, dual independent betting controls, and Hardhat EVM smart contract logic.

<br/>

[![View Live Mobile Tunnel](https://img.shields.io/badge/🔴%20LIVE%20MOBILE%20TUNNEL-View%20Now-ef4444?style=for-the-badge)](https://lowest-opposition-evaluations-knives.trycloudflare.com)
[![API Endpoint](https://img.shields.io/badge/API-/api/game/status-1F3864?style=for-the-badge)](http://localhost:5000/api/game/status)
[![RPC Endpoint](https://img.shields.io/badge/RPC-Hardhat%208545-1F3864?style=for-the-badge)](http://localhost:8545)

</div>

---

## ⚡ What It Does

ChainAscent orchestrates a complete crash flight game loop across 5 microservices in real time:

| Metric / Feature | Result & Details |
|------------------|------------------|
| 🎮 Flight Rendering | Smooth 60+ FPS quadratic flight curve, dark crimson sunburst, propeller animation & explosion FX |
| 🔐 Provable Fairness | HMAC-SHA256 server & client seed math for verifiable pre-determined outcomes |
| 💰 Dual Betting System | Place two concurrent independent bets (Panel 1 & Panel 2) with instant manual or auto cashout |
| 🎵 Audio Synthesizer | Custom Web Audio API pitch modulation shifting engine sound dynamically with multiplier height |
| ⛓️ Smart Contract | Solidity `MultiplierGame.sol` with Checks-Effects-Interactions (CEI) reentrancy guards |
| 🐳 Deployment | 1-Command Docker Compose orchestration running 5 microservice containers |

---

## 🏗️ Architecture

```
Internet (Mobile Devices & Browsers)
           │
           ▼
   [Cloudflare Tunnel]
           │
           ▼
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

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| 🎨 Frontend | Next.js 14 (App Router), React 18, HTML5 Canvas Engine, Web Audio API, Tailwind CSS |
| ⚡ Backend API | Express.js, HMAC-SHA256 Provably Fair Cryptographic Engine, Node.js |
| 🐘 Database | PostgreSQL 15 container with persistent volume storage (`pgdata`) |
| ⛓️ Blockchain | Solidity `^0.8.20` (`MultiplierGame.sol`), Hardhat EVM Sandbox |
| 🌐 Remote Access | Cloudflare Quick Tunnels (`cloudflared`) |
| 🐳 Containerization | Docker & Docker Compose |

---

## ✈️ Core Subsystems

### 🔐 HMAC-SHA256 Provably Fair Engine
Crash multipliers are calculated mathematically before round launch using cryptographic seed hashing:

```javascript
function generateProvablyFairRound(serverSeed, clientSeed) {
  const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
  const hexSubstring = hash.substring(0, 8);
  const intVal = parseInt(hexSubstring, 16);
  const crashMultiplier = Number((1.01 + (intVal % 1400) / 100).toFixed(2));
  return { hash, crashMultiplier };
}
```

### 🎮 HTML5 Canvas Flight Engine
- **Target Frame Rate**: 60+ FPS via `requestAnimationFrame`.
- **Visual Features**: Sunburst background rays, glowing crimson curved flight trajectory, animated airplane propeller sprite, and explosion particle system.
- **Top Ribbon**: Dynamic color-coded crash history pills (`<2.00x` Blue, `2.00x-10.00x` Purple, `>10.00x` Magenta).

### 🎵 Web Audio Sound Synthesizer
- Synthesizes background synth tones, cashout chimes, and explosion sound FX without external audio assets.
- Modulates engine sound frequency dynamically in real time: `audioEngine.updateEnginePitch(currentMultiplier)`.

---

## 📁 Project Structure

```
chainascent/
├── frontend/             # Next.js 14 App Router, Canvas Engine, Web Audio
│   ├── src/
│   │   ├── app/          # Main game loop page & layout
│   │   ├── components/   # MultiplierCanvas, BettingPanel, LiveStats, ProvablyFairModal
│   │   └── utils/        # audioEngine.js
│   └── Dockerfile
├── backend/              # Express API, HMAC-SHA256 Seed Engine, Database Models
│   ├── index.js          # Authoritative Game Server State Machine
│   └── Dockerfile
├── blockchain/           # Hardhat Local Network & Smart Contracts
│   ├── contracts/        # MultiplierGame.sol (Solidity ^0.8.20)
│   ├── scripts/          # Contract deployment script
│   └── Dockerfile
├── docker-compose.yml    # 5-Service Container Orchestration
├── .gitignore            # Git exclusion definitions
└── README.md             # Project Documentation
```

---

## 🚀 Setup & Deployment

### 1. Clone the repository
```bash
git clone https://github.com/arham-abro/Chain-Ascent.git
cd Chain-Ascent
```

### 2. Start the entire ecosystem (One Command)
```bash
docker compose up --build -d
```

### 3. Access in Browser
- 🎮 **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- ⚡ **Backend Status API**: [http://localhost:5000/api/game/status](http://localhost:5000/api/game/status)
- ⛓️ **Hardhat EVM Node**: `http://localhost:8545`

### 4. Grab Active Mobile Cloudflare Tunnel Link
```bash
docker compose logs tunnel
```

> ⚠️ **Evaluation Note:** Docker Compose handles database initialization, smart contract compilation/deployment, and tunnel generation automatically.

---

## 🔍 Sample Real-Time API Response

`GET /api/game/status`
```json
{
  "phase": "RUNNING",
  "countdown": 0,
  "currentMultiplier": 4.82,
  "crashPoint": 14.50,
  "history": [1.45, 12.30, 2.10, 8.95, 1.05],
  "serverSeedHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/game/status` | `GET` | Central server game loop clock, multiplier, and history |
| `/api/game/provably-fair` | `GET` | Inspection details for current server seed hash and client seeds |
| `/api/game/bet` | `POST` | Register a bet for Panel 1 or Panel 2 |
| `/api/game/cashout` | `POST` | Cash out at active flight multiplier |

---

## 🎓 Project Info

| Field | Details |
|-------|---------|
| 👤 Student | Arham Abro |
| 📚 Project | ChainAscent — Web3 Aviator Crash Game Monorepo |
| 🏛️ Architecture | 5-Tier Containerized Microservices Ecosystem |
| 🎓 Course / Evaluation | Full-Stack Web3 & Microservices Ecosystem Submission |
| 📅 Year | 2026 |

---

<div align="center">

**Made with ✈️ & ⚡ for Web3 Full-Stack Ecosystem Evaluation**

</div>
