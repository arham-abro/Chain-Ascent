'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import MultiplierCanvas from '@/components/MultiplierCanvas';
import BettingPanel from '@/components/BettingPanel';
import LiveStats from '@/components/LiveStats';
import { audioEngine } from '@/utils/audioEngine';

export default function Home() {
  const ETH_RATE = 3000; // 1 ETH = $3,000 USD
  const [balanceUsd, setBalanceUsd] = useState(30000.00); // $30,000.00 USD default
  const [balanceEth, setBalanceEth] = useState(10.00);
  const [walletChange, setWalletChange] = useState(null); // Floating balance notification pill

  // Authoritative Synced Game Server State
  const [phase, setPhase] = useState('WAITING');
  const [countdown, setCountdown] = useState(5.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [targetCrash, setTargetCrash] = useState(31.85);
  const [history, setHistory] = useState([]);
  const [livePlayers, setLivePlayers] = useState([]);

  const activeBetsRef = useRef({});
  const lastPhaseRef = useRef('WAITING');

  // Trigger floating balance notification pill (+ $122.50 / - $50.00)
  const showWalletNotification = (amountStr, type) => {
    setWalletChange({ amount: amountStr, type });
    setTimeout(() => {
      setWalletChange(null);
    }, 2500);
  };

  // Top-Up / Reset Balance Manager
  const handleTopUpBalance = (newUsdAmount) => {
    setBalanceUsd(newUsdAmount);
    setBalanceEth(newUsdAmount / ETH_RATE);
    showWalletNotification(`+$${(newUsdAmount - balanceUsd).toFixed(0)} USD`, 'win');
  };

  // Place Bet handler for Panel 1 / Panel 2
  const handlePlaceBet = (panelId, usdAmount, ethAmount, targetMult) => {
    if (balanceUsd < usdAmount) return;

    setBalanceUsd((prev) => prev - usdAmount);
    setBalanceEth((prev) => (prev * ETH_RATE - usdAmount) / ETH_RATE);
    showWalletNotification(`-$${usdAmount.toFixed(2)} USD`, 'loss');

    activeBetsRef.current[panelId] = {
      usdAmount,
      targetMult,
      cashed: false,
    };

    audioEngine.startBgMusic();
  };

  // Cashout handler for Panel 1 / Panel 2 (Can cash out ANYTIME during flight)
  const handleCashout = (panelId, multiplier, totalPayoutUsd) => {
    setBalanceUsd((prev) => prev + totalPayoutUsd);
    setBalanceEth((prev) => (prev * ETH_RATE + totalPayoutUsd) / ETH_RATE);
    showWalletNotification(`+$${totalPayoutUsd.toFixed(2)} USD`, 'win');

    if (activeBetsRef.current[panelId]) {
      activeBetsRef.current[panelId].cashed = true;
    }

    audioEngine.playCashoutChime();
  };

  // Sync Game State directly with Central Express Server Clock (/api/game/status)
  useEffect(() => {
    const syncServerState = async () => {
      try {
        // Dynamically resolve hostname so mobile phones on local network connect to PC server
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        const primaryUrl = `/api/game/status`;
        const fallbackUrl = `http://${host}:5000/api/game/status`;

        let res;
        try {
          res = await fetch(primaryUrl, { cache: 'no-store' });
        } catch (e) {
          res = await fetch(fallbackUrl, { cache: 'no-store' });
        }

        if (!res.ok) return;

        const data = await res.json();
        if (data && data.phase) {
          setPhase(data.phase);
          setCountdown(data.countdown !== undefined ? data.countdown : 0);
          setCurrentMultiplier(data.currentMultiplier || 1.00);
          setTargetCrash(data.crashPoint || 2.00);

          if (data.history) setHistory(data.history);
          if (data.livePlayers) setLivePlayers(data.livePlayers);

          // Trigger audio effects on phase transitions
          if (lastPhaseRef.current !== data.phase) {
            if (data.phase === 'RUNNING') {
              audioEngine.startEngineSound();
            } else if (data.phase === 'CRASHED') {
              audioEngine.playCrashExplosion();
            } else if (data.phase === 'WAITING') {
              audioEngine.stopEngineSound();
              activeBetsRef.current = {};
            }
            lastPhaseRef.current = data.phase;
          }

          if (data.phase === 'RUNNING') {
            audioEngine.updateEnginePitch(data.currentMultiplier);
          }
        }
      } catch (err) {
        // Suppress fetch glitches
      }
    };

    const interval = setInterval(syncServerState, 80); // Fast 80ms server synchronization
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100">
      
      {/* 1. Official Header (Italic Crimson Logo Aviator, $30,000.00 USD, Sound toggle, Menu) */}
      <Header
        balanceUsd={balanceUsd}
        balanceEth={balanceEth}
        walletChange={walletChange}
        onTopUpBalance={handleTopUpBalance}
      />

      {/* Main Container - Stacked Layout matching official screenshot */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        
        {/* 2. Top History Ribbon & Main Flight Canvas */}
        <MultiplierCanvas
          currentMultiplier={currentMultiplier}
          isCrashed={phase === 'CRASHED'}
          isRunning={phase === 'RUNNING'}
          isWaiting={phase === 'WAITING'}
          countdown={countdown}
          history={history}
        />

        {/* 3. Dual Betting Controls Panel (Panel 1 and Panel 2) */}
        <BettingPanel
          currentMultiplier={currentMultiplier}
          isRunning={phase === 'RUNNING'}
          isCrashed={phase === 'CRASHED'}
          isWaiting={phase === 'WAITING'}
          ethRate={ETH_RATE}
          balanceUsd={balanceUsd}
          onPlaceBet={handlePlaceBet}
          onCashout={handleCashout}
        />

        {/* 4. Full Width Live Bets Feed Panel */}
        <LiveStats
          currentMultiplier={currentMultiplier}
          isRunning={phase === 'RUNNING'}
          isCrashed={phase === 'CRASHED'}
          livePlayers={livePlayers}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-3 px-6 text-center text-xs text-slate-500 font-mono">
        Official Aviator Web3 Ecosystem • Provably Fair SHA-256 Seed Cryptography
      </footer>

    </div>
  );
}
