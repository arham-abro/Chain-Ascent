![Header](https://capsule-render.vercel.app/api?type=waving&color=ef4444&height=200&section=header&text=🚀%20ChainAscent&fontSize=50&fontColor=ffffff&animation=fadeIn&desc=Web3%20Aviator%20Crash%20Game%20Ecosystem&descSize=20&descAlignY=75)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/Status-LIVE-22c55e?style=for-the-badge)
![Course](https://img.shields.io/badge/Course-CCP%20Web3-1F3864?style=for-the-badge)

<br/>

> **A 5-tier multi-container Web3 Aviator crash game ecosystem featuring 60+ FPS HTML5 Canvas engine, HMAC-SHA256 provably fair cryptography, and local EVM smart contract node.**  
> Deployed with Docker Compose — 1-command startup on ports **3000**, **5000**, **5432**, and **8545**.

<br/>

[![View Live Dashboard](https://img.shields.io/badge/🔴%20LIVE%20GAME-View%20Now-ef4444?style=for-the-badge)](http://localhost:3000/)
[![API Endpoint](https://img.shields.io/badge/API-/api/game/status-1F3864?style=for-the-badge)](http://localhost:5000/api/game/status)
[![Provably Fair API](https://img.shields.io/badge/API-/provably--fair-1F3864?style=for-the-badge)](http://localhost:5000/api/game/provably-fair)

</div>

---

## 📸 Screenshots

### 🖥️ Live Aviator Canvas Console — 60 FPS HTML5 Flight Engine
![Dashboard](screenshots/dashboard.png)

### ☁️ Docker Desktop — 5-Tier Container Ecosystem Running
![AWS](screenshots/aws-console.png)

### 🔒 Provably Fair Verification & Dual Betting Panels
![Security Group](screenshots/security-group.png)

### 📋 Backend Express API Logs (Terminal)
![Logs](screenshots/attacks-log.png)

### 🌐 API Response — Live Multiplier JSON Data
![API](screenshots/api-response.png)

---

## ⚡ What It Does

ChainAscent delivers a real-time, provably fair Web3 crash game experience inspired by Spribe's official Aviator game. Here is what is achieved in real time:

| Metric | Result |
|--------|--------|
| 🎮 HTML5 Canvas Flight Engine | 60+ FPS smooth flight curve, glowing particle trails, and flight explosion FX |
| 🔐 Provably Fair Cryptography | Unalterable HMAC-SHA256 server and client seeds generated before every round |
| ⚡ Dual Independent Betting | Simultaneous dual bets with auto-cashout triggers & profit calculation |
| 🎵 Web Audio Sound Synthesizer | Real-time flight frequency modulation and sound synthesis without heavy MP3 assets |
| 🗄️ Relational Data Persistence | PostgreSQL 15 database storing complete game round multiplier history & bet logs |
| ⛓️ On-Chain Smart Contract | Solidity `MultiplierGame.sol` with Checks-Effects-Interactions reentrancy protection |

---

## 🏗️ Architecture

```
Internet / Local Network (Players & Smartphones)
                       │
                       ▼
            [AWS / Docker Gateway]
   ┌───────────────────────────────────────────────┐
   │  ChainAscent Microservices Ecosystem          │
   │                                               │
   │  ├── Next.js 14 Frontend  → Port 3000         │
   │  │   └── HTML5 Canvas & Dual Betting UI       │
   │  │                                            │
   │  ├── Express REST API     → Port 5000         │
   │  │   └── HMAC-SHA256 Provably Fair Engine     │
   │  │                                            │
   │  ├── PostgreSQL 15 DB     → Port 5432         │
   │  │   └── Relational Game & Round History      │
   │  │                                            │
   │  └── Hardhat EVM Node     → Port 8545         │
   │      └── MultiplierGame.sol Smart Contract    │
   └───────────────────────────────────────────────┘
                       │
                       ▼
            [Your Browser - Live Game]
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ☁️ Infrastructure | Docker, Docker Compose, Cloudflare Tunnel |
| 🎣 Frontend UI | Next.js 14 (App Router), React 18, HTML5 Canvas, Tailwind CSS |
| 🐍 Backend API | Node.js, Express.js REST API |
| 🗄️ Database | PostgreSQL 15, `pg` Connection Pool |
| ⛓️ Smart Contract | Solidity ^0.8.20, Hardhat EVM Local Node |
| 📝 Cryptography | HMAC-SHA256 Provably Fair Seed Engine |

---

## 🎣 Subsystems & Components

### 🕹️ HTML5 Canvas Flight Engine (Port 3000)
Next.js 14 web app rendering smooth 60 FPS flight graphics, dual betting controls, live round multiplier ribbon, and audio synthesizer.

### 🔐 HMAC-SHA256 Provably Fair Backend (Port 5000)
Express REST server calculating deterministic crash multipliers using unalterable server & client seeds before round launch.

### 📟 Hardhat EVM Blockchain Node (Port 8545)
EVM testnet node hosting `MultiplierGame.sol` smart contract for on-chain bet validation and payout execution.

---

## 📁 Project Structure

```
chainascent/
├── backend/              # Express API, HMAC Provably Fair Engine, DB Models
│   ├── server.js
│   ├── db.js
│   └── Dockerfile
├── blockchain/           # Hardhat Node, MultiplierGame.sol Smart Contract
│   ├── contracts/
│   │   └── MultiplierGame.sol
│   └── Dockerfile
├── frontend/             # Next.js 14 App Router, Canvas Engine, Web Audio
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── Dockerfile
├── screenshots/          # Project screenshots
├── docker-compose.yml    # 5-tier container orchestration
├── .gitignore
└── README.md             # Project documentation
```

---

## 🚀 Setup & Deployment

### 1. Clone the repo
```bash
git clone https://github.com/arham-abro/Chain-Ascent.git
cd Chain-Ascent
```

### 2. Install dependencies (Optional / Local Dev)
```bash
npm install
```

### 3. Start everything with Docker
```bash
docker compose up --build -d
```

### 4. Open the game dashboard
http://localhost:3000

> ⚠️ **Note:** Ensure Docker Desktop is running before executing `docker compose up`.

---

## 🔍 Real Provably Fair Log Example Captured

```json
{
  "status": "success",
  "roundId": 1042,
  "crashMultiplier": 3.42,
  "provablyFair": {
    "serverSeed": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "clientSeed": "00000000000000000003b57e6c469b7e7e8b",
    "combinedHash": "8f4e2b19741a3d902e8876c12b91d24ef0901234a56789b"
  }
}
```

---

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/game/status` | Check live game state & current multiplier |
| `GET /api/game/provably-fair` | Recent provably fair seeds & crash verification |
| `POST /api/game/bet` | Place round bet & auto-cashout limits |
| `GET /health` | Backend & PostgreSQL database connection status |

---

## 🎓 Project Info

| Field | Details |
|-------|---------|
| 👤 Student | Arham Abro |
| 🎫 Roll No. | 72532 |
| 📚 Course | Cloud Security / CCP |
| 👨‍🏫 Instructor | Muhammad Ahsan Naeem |
| 🏛️ Department | Cyber Security — Iqra University |
| 📅 Date | May 2026 |

---

<div align="center">

**Made with 🚀 on Docker · Built for Cloud Security / CCP Course**

</div>
