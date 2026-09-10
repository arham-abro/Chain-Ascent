const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");
const { ethers } = require("ethers");

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/chainascent";
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";

app.use(cors());
app.use(express.json());

// PostgreSQL pool initialization
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Ethers provider initialization
let provider;
try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
} catch (err) {
  console.warn("[Ethers RPC] Connection warning:", err.message);
}

// Provably Fair SHA-512 / SHA-256 Weighted Crash Generator
function calculateProvablyFairCrash(serverSeed, clientSeed) {
  const hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
  const hexSubstring = hash.substring(0, 8);
  const intVal = parseInt(hexSubstring, 16);
  const normalized = intVal / 0xffffffff;

  // Weighted Aviator crash distribution (1.15x -> 65.00x range)
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

  return {
    hash,
    crashPoint: Number(crashPoint.toFixed(2)),
  };
}

// Helper to generate simulated online hash players for a round
function generateLivePlayers() {
  return [
    { address: 'd***8', betUsd: 100.00, betEth: 0.033, targetMultiplier: 9.09, cashedOut: false, cashedMultiplier: null },
    { address: 'd***8', betUsd: 100.00, betEth: 0.033, targetMultiplier: 2.50, cashedOut: false, cashedMultiplier: null },
    { address: 'd***8', betUsd: 100.00, betEth: 0.033, targetMultiplier: 1.77, cashedOut: false, cashedMultiplier: null },
    { address: 'k***2', betUsd: 50.00, betEth: 0.016, targetMultiplier: 3.20, cashedOut: false, cashedMultiplier: null },
    { address: 'a***9', betUsd: 250.00, betEth: 0.083, targetMultiplier: 1.50, cashedOut: false, cashedMultiplier: null },
    { address: 'm***1', betUsd: 15.00, betEth: 0.005, targetMultiplier: 12.40, cashedOut: false, cashedMultiplier: null },
    { address: 's***7', betUsd: 500.00, betEth: 0.166, targetMultiplier: 2.00, cashedOut: false, cashedMultiplier: null },
  ];
}

// Central Authoritative Global Server Game Clock & State (Synced across ALL connected devices!)
let serverSeed = crypto.randomBytes(16).toString('hex');
let clientSeed = "000000000000000000041d8e9e2b1f7c320";
let roundData = calculateProvablyFairCrash(serverSeed, clientSeed);

let gameServerState = {
  roundId: 11800488,
  phase: "WAITING", // 'WAITING', 'RUNNING', 'CRASHED'
  countdown: 5.0,
  currentMultiplier: 1.00,
  crashPoint: roundData.crashPoint,
  provablyFair: {
    serverSeed,
    clientSeed,
    hash: roundData.hash,
  },
  history: [
    { crashPoint: 1.21 }, { crashPoint: 1.59 }, { crashPoint: 3.27 }, { crashPoint: 1.03 },
    { crashPoint: 1.03 }, { crashPoint: 1.31 }, { crashPoint: 1.10 }, { crashPoint: 1.80 },
    { crashPoint: 1.67 }, { crashPoint: 2.02 }, { crashPoint: 1.08 }, { crashPoint: 1.79 },
    { crashPoint: 1.73 }, { crashPoint: 18.42 }, { crashPoint: 2.16 }, { crashPoint: 60.84 },
    { crashPoint: 1.45 }, { crashPoint: 2.90 }, { crashPoint: 1.15 }, { crashPoint: 4.10 },
    { crashPoint: 1.02 }, { crashPoint: 3.80 }, { crashPoint: 2.50 }, { crashPoint: 1.75 },
    { crashPoint: 6.20 }
  ],
  livePlayers: generateLivePlayers(),
};

// Database Table Auto-Initialization with Retry Loop
async function initDb(retries = 5, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query(`
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
      `);
      console.log("[PostgreSQL] Database tables initialized successfully.");
      client.release();
      return;
    } catch (err) {
      console.warn(`[PostgreSQL] Table initialization attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
}

initDb();

// Save settled game outcome into PostgreSQL
async function saveGameToDb(gameId, crashMultiplier) {
  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO games (game_id, crash_multiplier, status, settled_at)
       VALUES ($1, $2, 'CRASHED', NOW())
       ON CONFLICT (game_id) DO UPDATE SET crash_multiplier = $2, status = 'CRASHED', settled_at = NOW()`,
      [gameId, crashMultiplier]
    );
    client.release();
  } catch (err) {
    console.warn("[PostgreSQL] Save game record deferred:", err.message);
  }
}

// -------------------------------------------------------------
// Central Synchronized Background Game Clock Loop (40ms ticks)
// Slow, gentle Spribe flight physics takeoff
// -------------------------------------------------------------
setInterval(() => {
  if (gameServerState.phase === "WAITING") {
    gameServerState.countdown = Math.max(0, gameServerState.countdown - 0.04);
    if (gameServerState.countdown <= 0) {
      gameServerState.phase = "RUNNING";
      gameServerState.currentMultiplier = 1.00;
    }
  } else if (gameServerState.phase === "RUNNING") {
    // Gentle takeoff incrementing smoothly
    gameServerState.currentMultiplier += 0.005 + Math.pow(gameServerState.currentMultiplier - 1.0, 1.12) * 0.006;

    // Update live players cashout states
    gameServerState.livePlayers = gameServerState.livePlayers.map((player) => {
      if (!player.cashedOut && gameServerState.currentMultiplier >= player.targetMultiplier) {
        return { ...player, cashedOut: true, cashedMultiplier: player.targetMultiplier };
      }
      return player;
    });

    // Check crash target
    if (gameServerState.currentMultiplier >= gameServerState.crashPoint) {
      gameServerState.currentMultiplier = gameServerState.crashPoint;
      gameServerState.phase = "CRASHED";
      gameServerState.history = [
        { crashPoint: gameServerState.crashPoint },
        ...gameServerState.history.slice(0, 24)
      ];

      saveGameToDb(gameServerState.roundId, gameServerState.crashPoint);

      // Transition to next round after 2 second pause
      setTimeout(() => {
        const nextServerSeed = crypto.randomBytes(16).toString('hex');
        const nextRound = calculateProvablyFairCrash(nextServerSeed, clientSeed);

        gameServerState.roundId += 1;
        gameServerState.phase = "WAITING";
        gameServerState.countdown = 5.0;
        gameServerState.currentMultiplier = 1.00;
        gameServerState.crashPoint = nextRound.crashPoint;
        gameServerState.provablyFair = {
          serverSeed: nextServerSeed,
          clientSeed,
          hash: nextRound.hash,
        };
        gameServerState.livePlayers = generateLivePlayers();
      }, 2000);
    }
  }
}, 40);

// -------------------------------------------------------------
// REST API Endpoints
// -------------------------------------------------------------

// Healthcheck endpoint
app.get("/health", async (req, res) => {
  let dbStatus = "disconnected";
  let rpcStatus = "disconnected";

  try {
    const client = await pool.connect();
    const dbRes = await client.query("SELECT NOW()");
    dbStatus = `connected (server time: ${dbRes.rows[0].now})`;
    client.release();
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  try {
    if (provider) {
      const blockNumber = await provider.getBlockNumber();
      rpcStatus = `connected (block #${blockNumber})`;
    }
  } catch (err) {
    rpcStatus = `error: ${err.message}`;
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      backend: "running",
      database: dbStatus,
      blockchain: rpcStatus,
    },
  });
});

// Single Authoritative Live Game Status Endpoint
app.get("/api/game/status", (req, res) => {
  res.json(gameServerState);
});

// Provably Fair Cryptographic Inspector Endpoint
app.get("/api/game/provably-fair", (req, res) => {
  res.json({
    roundId: gameServerState.roundId,
    serverSeed: gameServerState.provablyFair.serverSeed,
    clientSeed: gameServerState.provablyFair.clientSeed,
    hash: gameServerState.provablyFair.hash,
    crashPoint: gameServerState.crashPoint,
    algorithm: "HMAC-SHA256",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[ChainAscent Backend] Authoritative Aviator Server running on http://0.0.0.0:${PORT}`);
  console.log(`Connected RPC: ${RPC_URL}`);
  console.log(`Connected DB: ${DATABASE_URL}`);
});
