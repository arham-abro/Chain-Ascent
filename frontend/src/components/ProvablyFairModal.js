'use client';

import { useState } from 'react';
import { ShieldCheck, Server, Laptop, Cpu, Database, Network } from 'lucide-react';

export default function ProvablyFairModal({ isOpen, onClose, currentRoundId = "11800488", crashPoint = 18.42 }) {
  const [activeTab, setActiveTab] = useState('crypto'); // 'crypto' or 'devInfo'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181920] border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 font-mono text-xs text-slate-200 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">
              ROUND {currentRoundId}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#3b1226] text-[#ec4899] border border-[#ec4899]/30">
              {crashPoint.toFixed(2)}x
            </span>
            <span className="text-slate-400 text-[11px]">04:47:44</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Cryptographic Provably Fair vs Developer Node Info */}
        <div className="flex bg-[#090a0f] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
              activeTab === 'crypto'
                ? 'bg-[#282a36] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Provably Fair Cryptography
          </button>
          <button
            onClick={() => setActiveTab('devInfo')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
              activeTab === 'devInfo'
                ? 'bg-[#282a36] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Developer Node Info
          </button>
        </div>

        {activeTab === 'crypto' ? (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            
            {/* Section 1: Server Seed */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                <Server className="w-4 h-4 text-emerald-400" />
                Server Seed:
              </div>
              <p className="text-[10px] text-slate-400">Generated on our side</p>
              <div className="bg-[#0c0d12] p-2.5 rounded-xl border border-slate-800 break-all text-[11px] font-mono text-emerald-400">
                8JROQjKBKDxE6FLZtMAnWFgdienar09PRbTYhKui
              </div>
            </div>

            {/* Section 2: Client Seed */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                <Laptop className="w-4 h-4 text-sky-400" />
                Client Seed:
              </div>
              <p className="text-[10px] text-slate-400">Generated on players side</p>

              <div className="bg-[#0c0d12] p-2.5 rounded-xl border border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Player N1: <span className="text-white font-bold">d***1</span></span>
                  <span className="text-sky-300 font-mono">glS0FtPJb9XakGCF1nU6</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">Player N2: <span className="text-white font-bold">d***8</span></span>
                  <span className="text-sky-300 font-mono">5qdY2endJjSAALHZ7sEC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Player N3: <span className="text-white font-bold">d***5</span></span>
                  <span className="text-sky-300 font-mono">dFBh7JXjfBWM5rOU2UaW</span>
                </div>
              </div>
            </div>

            {/* Section 3: Combined SHA512 Hash */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Combined SHA512 Hash:
              </div>
              <p className="text-[10px] text-slate-400">
                Above seeds combined and converted to SHA512 Hash. This is your game result
              </p>

              <div className="bg-[#0c0d12] p-2.5 rounded-xl border border-slate-800 break-all text-[11px] text-amber-400">
                f2868c9116e7389b234d7689f13a7f18884a79c8afa3ff8f4be6d7
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Hex:</span>
                  <div className="bg-[#0c0d12] p-2 rounded-lg border border-slate-800 text-slate-200">
                    f2868c9116e73
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Decimal:</span>
                  <div className="bg-[#0c0d12] p-2 rounded-lg border border-slate-800 text-slate-200">
                    4266555165732467
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Result:</span>
                  <div className="bg-[#0c0d12] p-2 rounded-lg border border-slate-800 font-extrabold text-emerald-400">
                    {crashPoint.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-800">
              For instructions check <span className="text-rose-500 font-bold underline cursor-pointer">What is Provably Fair</span>
            </div>

          </div>
        ) : (
          <div className="space-y-3 bg-[#0c0d12] p-3.5 rounded-xl border border-slate-800 text-slate-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Cpu className="w-4 h-4" /> Hardhat EVM RPC
              </span>
              <span className="font-mono text-white">http://localhost:8545</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Network className="w-4 h-4" /> Express Backend API
              </span>
              <span className="font-mono text-white">http://localhost:5000</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Database className="w-4 h-4" /> PostgreSQL Database
              </span>
              <span className="font-mono text-white">localhost:5432</span>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400">DEPLOYED CONTRACT ADDRESS:</span>
              <div className="bg-[#181920] p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-400 break-all">
                0x5FbDB2315678afecb367f032d93F642f64180aa3
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
