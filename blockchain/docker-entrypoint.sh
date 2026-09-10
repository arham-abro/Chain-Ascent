#!/bin/sh

# Start hardhat node in background listening on 0.0.0.0
npx hardhat node --hostname 0.0.0.0 &
HARDHAT_PID=$!

echo "[Blockchain Entrypoint] Waiting for Hardhat node RPC to initialize on 127.0.0.1:8545..."
until nc -z 127.0.0.1 8545 2>/dev/null || wget -qO- http://127.0.0.1:8545 >/dev/null 2>&1; do
  sleep 1
done

echo "[Blockchain Entrypoint] Hardhat RPC is online! Deploying MultiplierGame smart contract..."
npx hardhat run scripts/deploy.js --network localhost

# Keep process alive
wait $HARDHAT_PID
