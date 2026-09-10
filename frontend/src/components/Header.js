'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Menu, Plus, RefreshCw, Wallet, ShieldCheck } from 'lucide-react';
import { audioEngine } from '@/utils/audioEngine';
import ProvablyFairModal from '@/components/ProvablyFairModal';

export default function Header({ balanceUsd, balanceEth, walletChange, onTopUpBalance }) {
  const [isMuted, setIsMuted] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showProvablyFairModal, setShowProvablyFairModal] = useState(false);

  const toggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioEngine.startBgMusic();
    }
  };

  return (
    <header className="bg-[#090a0f] border-b border-slate-900 px-4 lg:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Left: Italic Crimson Logo Aviator */}
        <div className="flex items-center gap-2">
          <span className="font-black italic text-2xl tracking-tighter text-[#e50914] font-mono">
            Aviator
          </span>
        </div>

        {/* Right: Green USD Balance Display & Developer / Provably Fair Info Button */}
        <div className="flex items-center gap-3.5">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-slate-300" />}
          </button>

          {/* Balance Container with Floating Pill */}
          <div className="relative flex items-center gap-2 bg-[#14151b] border border-slate-800 rounded-lg px-3 py-1.5">
            
            {/* Floating Notification Pill */}
            {walletChange && (
              <div
                className={`absolute -bottom-7 right-0 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold shadow-lg animate-bounce ${
                  walletChange.type === 'win'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {walletChange.amount}
              </div>
            )}

            <span className="text-emerald-400 font-extrabold font-mono text-sm tracking-tight">
              {balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="text-emerald-400 hover:text-emerald-300 p-0.5 rounded hover:bg-emerald-500/10 transition-colors"
              title="Deposit / Reset Balance"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Provably Fair & Developer Info Button (Top Right as requested) */}
          <button
            onClick={() => setShowProvablyFairModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-mono text-xs font-bold"
            title="Inspect Provably Fair SHA512 & Developer Node Info"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Provably Fair Info</span>
          </button>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setShowTopUpModal(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

        </div>
      </div>

      {/* Balance Reset / Deposit Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151b] rounded-2xl p-6 max-w-md w-full border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Demo Wallet Funds Manager
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    onTopUpBalance(balanceUsd + amount);
                    setShowTopUpModal(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-mono text-xs font-bold transition-colors"
                >
                  +${amount.toLocaleString()} USD
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onTopUpBalance(30000);
                setShowTopUpModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Balance to $30,000.00 USD
            </button>
          </div>
        </div>
      )}

      {/* Official Provably Fair Cryptographic & Developer Node Info Modal */}
      <ProvablyFairModal
        isOpen={showProvablyFairModal}
        onClose={() => setShowProvablyFairModal(false)}
        currentRoundId="11800488"
        crashPoint={18.42}
      />
    </header>
  );
}
