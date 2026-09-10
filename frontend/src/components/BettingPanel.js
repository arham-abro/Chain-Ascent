'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, MinusCircle, PlusCircle } from 'lucide-react';

function SingleBetControl({ panelId, title, currentMultiplier, isRunning, isCrashed, isWaiting, ethRate, balanceUsd, onPlaceBet, onCashout }) {
  const [betUsd, setBetUsd] = useState(1.00); // Default $1.00 USD as in screenshot
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashedMultiplier, setCashedMultiplier] = useState(null);
  const [cashedProfitUsd, setCashedProfitUsd] = useState(0);

  const betEth = betUsd / ethRate;
  const liveProfitUsd = (betUsd * currentMultiplier - betUsd).toFixed(2);

  // Auto Reset when game resets to WAITING phase
  useEffect(() => {
    if (isWaiting) {
      setHasBet(false);
      setCashedOut(false);
      setCashedMultiplier(null);
      setCashedProfitUsd(0);
    }
  }, [isWaiting]);

  const handleBetClick = () => {
    if (!betUsd || betUsd <= 0 || betUsd > balanceUsd) return;

    setHasBet(true);
    setCashedOut(false);
    setCashedMultiplier(null);

    if (onPlaceBet) {
      onPlaceBet(panelId, betUsd, betEth, 2.00);
    }
  };

  const handleCancelClick = () => {
    setHasBet(false);
  };

  const handleCashoutClick = () => {
    if (!hasBet || cashedOut || !isRunning || isCrashed) return;

    const profit = parseFloat(liveProfitUsd);
    setCashedOut(true);
    setCashedMultiplier(currentMultiplier);
    setCashedProfitUsd(profit);

    if (onCashout) {
      onCashout(panelId, currentMultiplier, betUsd + profit);
    }
  };

  const adjustBet = (delta) => {
    setBetUsd((prev) => Math.max(0.10, Number((prev + delta).toFixed(2))));
  };

  return (
    <div className="bg-[#14151b] rounded-2xl p-3 sm:p-4 border border-slate-800 flex items-center gap-3 justify-between shadow-xl">
      
      {/* Left Column: Stepper & Quick Pills (1, 2, 5, 10) */}
      <div className="flex-1 space-y-2">
        
        {/* Stepper Input Row (- 1.00 +) */}
        <div className="flex items-center justify-between bg-[#090a0f] border border-slate-800 rounded-xl px-2 py-1.5">
          <button
            onClick={() => adjustBet(-0.50)}
            disabled={hasBet && isRunning}
            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            step="0.50"
            min="0.10"
            disabled={hasBet && isRunning}
            value={betUsd}
            onChange={(e) => setBetUsd(Math.max(0.10, parseFloat(e.target.value) || 0.10))}
            className="w-20 text-center bg-transparent font-bold font-mono text-base text-white focus:outline-none"
          />

          <button
            onClick={() => adjustBet(0.50)}
            disabled={hasBet && isRunning}
            className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Preset Pills: 1, 2, 5, 10 */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 5, 10].map((val) => (
            <button
              key={val}
              onClick={() => setBetUsd(val)}
              disabled={hasBet && isRunning}
              className={`py-1 rounded-lg font-mono text-xs font-bold border transition-colors ${
                betUsd === val
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-[#090a0f] hover:bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

      </div>

      {/* Right Column: Big Prominent Action Button */}
      <div className="flex-1 h-full min-h-[90px] flex items-center">
        {!hasBet ? (
          <button
            onClick={handleBetClick}
            disabled={isRunning && !isWaiting}
            className="w-full h-full min-h-[85px] py-3 rounded-2xl font-black text-lg uppercase tracking-wider bg-[#e50914] hover:bg-[#f40612] text-white shadow-lg shadow-red-600/30 transition-all duration-150 flex flex-col items-center justify-center"
          >
            <span>BET</span>
            <span className="text-xs font-mono font-normal opacity-90">${betUsd.toFixed(2)} USD</span>
          </button>
        ) : isWaiting ? (
          <button
            onClick={handleCancelClick}
            className="w-full h-full min-h-[85px] py-3 rounded-2xl font-bold bg-[#e50914] hover:bg-[#f40612] text-white shadow-lg shadow-red-600/30 transition-all duration-150 flex flex-col items-center justify-center text-center"
          >
            <span className="text-base font-extrabold">Cancel</span>
            <span className="text-[11px] font-mono text-slate-200">Waiting for next round</span>
          </button>
        ) : isRunning && !cashedOut ? (
          <button
            onClick={handleCashoutClick}
            className="w-full h-full min-h-[85px] py-3 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white shadow-lg shadow-amber-500/40 transition-all duration-150 animate-bounce flex flex-col items-center justify-center text-center"
          >
            <span>CASH OUT</span>
            <span className="text-xs font-mono font-extrabold">@{currentMultiplier.toFixed(2)}x (+${liveProfitUsd})</span>
          </button>
        ) : cashedOut ? (
          <div className="w-full h-full min-h-[85px] py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex flex-col items-center justify-center text-center font-extrabold text-xs">
            <span>CASHED OUT</span>
            <span className="text-sm font-mono text-white">@{cashedMultiplier?.toFixed(2)}x</span>
            <span className="text-[10px] text-emerald-300">+${cashedProfitUsd.toFixed(2)} USD</span>
          </div>
        ) : (
          <div className="w-full h-full min-h-[85px] py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex flex-col items-center justify-center text-center font-bold text-xs">
            <span>FLEW AWAY</span>
            <span className="text-[11px] text-slate-400">BET LOST</span>
          </div>
        )}
      </div>

    </div>
  );
}

export default function BettingPanel({ currentMultiplier, isRunning, isCrashed, isWaiting, ethRate, balanceUsd, onPlaceBet, onCashout }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <SingleBetControl
        panelId="panel1"
        title="BET CONTROL #1"
        currentMultiplier={currentMultiplier}
        isRunning={isRunning}
        isCrashed={isCrashed}
        isWaiting={isWaiting}
        ethRate={ethRate}
        balanceUsd={balanceUsd}
        onPlaceBet={onPlaceBet}
        onCashout={onCashout}
      />

      <SingleBetControl
        panelId="panel2"
        title="BET CONTROL #2"
        currentMultiplier={currentMultiplier}
        isRunning={isRunning}
        isCrashed={isCrashed}
        isWaiting={isWaiting}
        ethRate={ethRate}
        balanceUsd={balanceUsd}
        onPlaceBet={onPlaceBet}
        onCashout={onCashout}
      />
    </div>
  );
}
