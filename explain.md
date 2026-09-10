# Complex Computer Project (CCP) Final Technical Report
## Project Title: ChainAscent — Production Web3 Aviator Crash Game Monorepo
**Course / Evaluation**: Final CCP Project Submission  
**Architecture**: 5-Tier Full-Stack Containerized Ecosystem (Frontend + Backend + API Integration + Database + Blockchain)

---

## 📋 Executive Summary & Compliance Checklist

This technical report details the design, implementation, and integration of **ChainAscent**, a Web3 Aviator-style crash game built as a containerized microservice ecosystem.

### CCP Mandatory Components Compliance Matrix:
| Required Component | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Frontend** | ✅ Complete | Next.js 14 (App Router) + React + Tailwind CSS + HTML5 Canvas Engine + Web Audio Synthesizer |
| **2. Backend** | ✅ Complete | Express.js REST API Server + HMAC-SHA512/SHA256 Provably Fair Cryptographic Engine |
| **3. API Integration** | ✅ Complete | End-to-end REST API communication connecting Frontend, Express Server, PostgreSQL & Hardhat RPC |
| **4. Database (DB)** | ✅ Complete | PostgreSQL 15 container with `games` and `bets` relational schemas & connection resilience retries |
| **5. Blockchain Code** | ✅ Complete | Solidity `^0.8.20` smart contract (`MultiplierGame.sol`), CEI reentrancy guard, Hardhat EVM & unit tests |

---

## 🎨 Component 1: Frontend Architecture (`frontend/`)

The frontend is built using **Next.js 14**, providing a responsive, high-performance user interface modeled after Spribe's official Aviator game.

### Key Frontend Subsystems:
1. **HTML5 Canvas Flight Engine ([MultiplierCanvas.js](file:///e:/chainascent-monorepo/frontend/src/components/MultiplierCanvas.js))**:
   - Uses `requestAnimationFrame` for 60+ FPS smooth rendering.
   - Renders dark sunburst background rays, dynamic quadratic curved flight paths, glowing crimson gradient fills, red propeller airplane sprites, and crash particle explosions.
   - Features a top **Multiplier History Ribbon** with color-coded pills (Blue `<2.00x`, Purple `2.00x-10.00x`, Magenta `>10.00x`) and an expandable dropdown displaying the **last 25 crash outcomes**.

2. **Dual Betting Controls ([BettingPanel.js](file:///e:/chainascent-monorepo/frontend/src/components/BettingPanel.js))**:
   - Enables placing **two independent bets simultaneously** per round (Panel 1 & Panel 2).
   - Features stepper adjustment controls (`-` `1.00` `+`), quick preset amount pills (`1`, `2`, `5`, `10` USD), and cashout buttons with live profit calculation.

3. **Web Audio Sound Synthesizer ([audioEngine.js](file:///e:/chainascent-monorepo/frontend/src/utils/audioEngine.js))**:
   - Synthesizes background synth music, engine flight pitch modulation, cashout chimes, and crash blast sounds using the browser-native Web Audio API (`AudioContext`).

4. **Cryptographic Verification Modal ([ProvablyFairModal.js](file:///e:/chainascent-monorepo/frontend/src/components/ProvablyFairModal.js))**:
   - Line-by-line implementation of the official Spribe Provably Fair inspector:
     - Displays `ROUND ID`, `Server Seed` (`8JROQj...`), `Client Seed` (`Player N1, N2, N3`), `Combined SHA512 Hash`, `Hex`, `Decimal`, and `Result`.
     - Includes a **Developer Node Info Tab** displaying container ports (`Hardhat: 8545`, `Express: 5000`, `Postgres: 5432`).

---

## ⚡ Component 2: Backend Architecture (`backend/`)

The backend is an **Express.js API server** responsible for game orchestration, provably fair seed generation, and database interactions.

### Key Backend Subsystems:
1. **HMAC-SHA512 / SHA256 Provably Fair Algorithm**:
   - Crash multipliers are predetermined mathematically before round launch:
     ```javascript
     function generateProvablyFairRound(serverSeed, clientSeed) {
       const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
       const hexSubstring = hash.substring(0, 8);
       const intVal = parseInt(hexSubstring, 16);
       const crashMultiplier = Number((1.01 + (intVal % 1400) / 100).toFixed(2));
       return { hash, crashMultiplier };
     }
     ```
2. **Automated Round Loop & State Management**:
   - Manages state transitions: `WAITING` (5s countdown) ➔ `RUNNING` (Flight ascension) ➔ `CRASHED` (Explosion).

---

## 🔗 Component 3: API Integration (`REST & RPC`)

All components communicate through structured REST API contracts and RPC methods:

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js - Port 3000)              │
└───────────────┬─────────────────────────────────┬───────────────┘
                │ GET /api/game/status            │ JSON-RPC (eth_call)
                │ GET /api/game/provably-fair     │ Port 8545
                ▼                                 ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│     BACKEND (Express API)     │ │   BLOCKCHAIN (Hardhat EVM)    │
│         Port 5000             │ │         Port 8545             │
└───────────────┬───────────────┘ └───────────────────────────────┘
                │ SQL Connection Pool
                ▼
┌───────────────────────────────┐
│   DATABASE (PostgreSQL 15)    │
│         Port 5432             │
└───────────────────────────────┘
```

---

## 🐘 Component 4: Database Architecture (`database/`)

The database tier runs **PostgreSQL 15** inside a dedicated container with persistent volume storage (`pgdata`).

### Connection Resilience Algorithm:
`index.js` implements a connection retry loop (`initDb(retries = 5, delay = 3000)`) ensuring that table initialization retries automatically if PostgreSQL is starting up in Docker Compose.

---

## ⛓️ Component 5: Blockchain Smart Contract (`blockchain/`)

The blockchain tier features a **Solidity 0.8.20** smart contract ([MultiplierGame.sol](file:///e:/chainascent-monorepo/blockchain/contracts/MultiplierGame.sol)) running on a local **Hardhat EVM** node.

### Core Smart Contract Logic:
1. **`placeBet(uint256 targetMultiplier) external payable`**:
   - Enforces `minimumBet` (0.001 ETH) and `maximumBet` (10 ETH).

2. **`claimPayout(uint256 gameId) external`**:
   - Implements **Checks-Effects-Interactions (CEI)** pattern to prevent reentrancy attacks.

---

## 🌐 Global Remote Access (Mobile Data & Remote Wi-Fi)

To access your app from **Mobile Data (5G/LTE)** or **any remote Wi-Fi network** while your PC runs at home, use one of the two free tunneling options below:

### Method 1: Instant Tunnel via Localtunnel (Free & Zero-Install)
1. Open PowerShell on your PC and run:
   ```powershell
   npx localtunnel --port 3000
   ```
2. Localtunnel will output a global HTTPS URL:
   ```text
   your url is: https://mystic-aviator-demo.loca.lt
   ```
3. Open `https://mystic-aviator-demo.loca.lt` on your mobile phone anywhere in the world!

### Method 2: Global Tunnel via ngrok (Recommended)
1. Run in PowerShell:
   ```powershell
   npx ngrok http 3000
   ```
2. ngrok will output a secure public HTTPS URL:
   ```text
   Forwarding   https://abc1234.ngrok-free.app -> http://localhost:3000
   ```
3. Open `https://abc1234.ngrok-free.app` on your smartphone on Mobile Data or school Wi-Fi!

### Method 3: Mobile Hotspot (When presenting in person)
1. Turn on **Mobile Hotspot** on your smartphone.
2. Connect your laptop to your smartphone's Mobile Hotspot.
3. Open `http://<Hotspot-IP>:3000` on your mobile phone!
