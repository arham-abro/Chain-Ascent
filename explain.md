# Complex Computer Project (CCP) Final Technical Report
## Project Title: ChainAscent — Production Web3 Aviator Crash Game Monorepo
**Course / Evaluation**: Final CCP Project Submission  
**Architecture**: 5-Tier Full-Stack Containerized Ecosystem (Frontend + Backend + API Integration + Database + Blockchain)  
**Student Name**: Arham Abro | **Roll No.**: 72532  
**Department**: Cyber Security — Iqra University  
**Instructor**: Muhammad Ahsan Naeem  

---

## 📋 Executive Summary & Compliance Checklist

This technical report details the architecture, cryptographic algorithms, database schema, and smart contract design for **ChainAscent**, a 5-tier Web3 Aviator-style crash game monorepo built for high performance, provable fairness, and containerized deployment.

### CCP Mandatory Components Compliance Matrix:
| Required Component | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Frontend** | ✅ Complete | Next.js 14 (App Router) + React + Tailwind CSS + HTML5 Canvas Engine ([MultiplierCanvas.js](file:///e:/chainascent-monorepo/frontend/src/components/MultiplierCanvas.js)) + Web Audio Synthesizer ([audioEngine.js](file:///e:/chainascent-monorepo/frontend/src/utils/audioEngine.js)) |
| **2. Backend** | ✅ Complete | Express.js REST API Server + HMAC-SHA256/SHA512 Weighted Provably Fair Engine ([index.js](file:///e:/chainascent-monorepo/backend/index.js)) |
| **3. API Integration** | ✅ Complete | End-to-end REST API & JSON-RPC contracts connecting Frontend, Express, PostgreSQL & Hardhat RPC |
| **4. Database (DB)** | ✅ Complete | PostgreSQL 15 container with `games` and `bets` relational schemas & automatic retry loop ([index.js](file:///e:/chainascent-monorepo/backend/index.js#L99-L134)) |
| **5. Blockchain Code** | ✅ Complete | Solidity `^0.8.20` smart contract ([MultiplierGame.sol](file:///e:/chainascent-monorepo/blockchain/contracts/MultiplierGame.sol)), CEI reentrancy guard, Hardhat EVM & unit tests |

---

## 🎨 Component 1: Frontend Architecture (`frontend/`)

The frontend is built using **Next.js 14**, providing a high-performance, Spribe-style user interface.

### Key Frontend Subsystems:
1. **HTML5 Canvas Flight Engine ([MultiplierCanvas.js](file:///e:/chainascent-monorepo/frontend/src/components/MultiplierCanvas.js))**:
   - Uses `requestAnimationFrame` for smooth 60+ FPS rendering.
   - Renders dark sunburst background rays, dynamic quadratic curved flight paths, glowing crimson gradient fills, red propeller airplane animation, and explosive crash particle effects.
   - Features a top **Multiplier History Ribbon** with color-coded pills (Blue `<2.00x`, Purple `2.00x-10.00x`, Magenta `>10.00x`) and an expandable dropdown displaying the **last 25 crash outcomes**.

2. **Dual Independent Betting Controls ([BettingPanel.js](file:///e:/chainascent-monorepo/frontend/src/components/BettingPanel.js))**:
   - Enables placing **two independent bets simultaneously** per round (Panel 1 & Panel 2).
   - Features stepper adjustment controls (`-` `1.00` `+`), quick preset amount pills (`$1`, `$2`, `$5`, `$10`), auto-cashout multiplier settings, and live profit displays.

3. **Live Stats & Player Feed ([LiveStats.js](file:///e:/chainascent-monorepo/frontend/src/components/LiveStats.js))**:
   - Displays online players, active bets, multiplier targets, cashout status, and live total pool payouts.

4. **Web Audio Sound Synthesizer ([audioEngine.js](file:///e:/chainascent-monorepo/frontend/src/utils/audioEngine.js))**:
   - Procedurally synthesizes flight engine sounds, pitch modulation, cashout chimes, and crash blast sounds using the browser-native Web Audio API (`AudioContext`).

5. **Provably Fair Verification Inspector ([ProvablyFairModal.js](file:///e:/chainascent-monorepo/frontend/src/components/ProvablyFairModal.js))**:
   - Inspector window allowing players to verify `Server Seed`, `Client Seed`, `Combined Hash`, and exact crash point formulas, plus developer port diagnostic details (`3000`, `5000`, `5432`, `8545`).

---

## ⚡ Component 2: Backend Architecture (`backend/`)

The backend is an **Express.js API server** ([index.js](file:///e:/chainascent-monorepo/backend/index.js)) executing an authoritative 40ms game clock loop.

### Key Backend Subsystems:
1. **Weighted Provably Fair HMAC-SHA256 Algorithm**:
   - Generates deterministic, weighted crash multipliers matching standard Aviator distribution tiers:
   ```javascript
   function calculateProvablyFairCrash(serverSeed, clientSeed) {
     const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
     const hexSubstring = hash.substring(0, 8);
     const intVal = parseInt(hexSubstring, 16);
     const normalized = intVal / 0xffffffff;

     let crashPoint;
     if (normalized < 0.04) {
       // 4% chance of instant low crash (1.05x - 1.15x)
       crashPoint = 1.05 + normalized * 2.5;
     } else if (normalized < 0.70) {
       // 66% chance of regular crash (1.20x - 4.50x)
       crashPoint = 1.20 + Math.pow(normalized, 1.8) * 4.8;
     } else if (normalized < 0.92) {
       // 22% chance of medium-high crash (4.50x - 18.00x)
       crashPoint = 4.50 + Math.pow(normalized, 2.5) * 16.0;
     } else {
       // 8% chance of high multiplier crash (18.00x - 65.00x)
       crashPoint = 18.00 + Math.pow(normalized, 3.5) * 50.0;
     }

     return { hash, crashPoint: Number(crashPoint.toFixed(2)) };
   }
   ```

2. **Automated State Machine & Tick Loop**:
   - Manages state transitions every 40ms: `WAITING` (5.0s countdown) ➔ `RUNNING` (Flight ascension) ➔ `CRASHED` (Explosion & 2s reset delay).

---

## 🔗 Component 3: API Integration (`REST & RPC`)

All 5 tiers interact seamlessly via REST API endpoints and EVM JSON-RPC:

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

### REST API Endpoints:
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | System health check for Express server, PostgreSQL connection pool, and Ethers RPC provider |
| `/api/game/status` | `GET` | Authoritative game state: `roundId`, `phase`, `countdown`, `currentMultiplier`, `history`, & `livePlayers` |
| `/api/game/provably-fair` | `GET` | Current round seeds (`serverSeed`, `clientSeed`), hash, crash point, and algorithm specs |

---

## 🐘 Component 4: Database Architecture (`database/`)

The database tier runs **PostgreSQL 15** inside a dedicated Docker container with persistent volume storage (`pgdata`).

### Relational Database Schema:
```sql
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  game_id BIGINT UNIQUE NOT NULL,
  crash_multiplier NUMERIC(6, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'WAITING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL,
  player_address VARCHAR(42) NOT NULL,
  amount NUMERIC(20, 8) NOT NULL,
  target_multiplier NUMERIC(6, 2) NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  won BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Connection Resilience & Retry Engine:
`index.js` includes an automated retry loop (`initDb(retries = 5, delay = 3000)`) ensuring table creation automatically succeeds even if PostgreSQL takes several seconds to boot inside Docker Compose.

---

## ⛓️ Component 5: Blockchain Smart Contract (`blockchain/`)

The blockchain tier features a **Solidity 0.8.20** smart contract ([MultiplierGame.sol](file:///e:/chainascent-monorepo/blockchain/contracts/MultiplierGame.sol)) deployed on a local **Hardhat EVM** node.

### Core Smart Contract Methods:
1. **`placeBet(uint256 targetMultiplier) external payable`**:
   - Enforces `minimumBet` (0.001 ETH) and `maximumBet` (10 ETH).
   - Validates `targetMultiplier >= 101` (1.01x minimum multiplier).

2. **`settleGame(uint256 crashMultiplier) external onlyOwner`**:
   - Locks the final crash multiplier for `currentGameId` and increments game state.

3. **`claimPayout(uint256 gameId) external`**:
   - Implements **Checks-Effects-Interactions (CEI)** reentrancy protection:
   ```solidity
   bet.claimed = true;
   bet.won = true;

   uint256 payout = (bet.amount * bet.targetMultiplier) / 100;
   require(address(this).balance >= payout, "Contract insufficient liquidity");

   (bool success, ) = payable(msg.sender).call{value: payout}("");
   require(success, "Transfer failed");
   ```

---

## 🌐 Global Remote Access Setup

To demonstrate or access the live app from **Mobile Data (5G/LTE)** or **any remote Wi-Fi network**:

### Method 1: Instant Tunnel via Localtunnel
```powershell
npx localtunnel --port 3000
```
- Returns a global HTTPS URL (e.g., `https://mystic-aviator-demo.loca.lt`) accessible on any mobile device.

### Method 2: Global Tunnel via ngrok
```powershell
npx ngrok http 3000
```
- Provides a public HTTPS tunnel forwarding directly to `localhost:3000`.

### Method 3: Mobile Hotspot (In-Person Presentation)
- Connect smartphone to PC via Hotspot and open `http://<Hotspot-IP>:3000`.

---

## 🎓 Project Information

| Field | Details |
| :--- | :--- |
| **Student Name** | Arham Abro |
| **Roll Number** | 72532 |
| **Course** | Complex Computer Project (CCP) |
| **Instructor** | Muhammad Ahsan Naeem |
| **Department** | Cyber Security — Iqra University |
| **Repository** | [arham-abro/Chain-Ascent](https://github.com/arham-abro/Chain-Ascent.git) |
| **Date** | September 2026 |

