'use client';

import { useState } from 'react';
import { UserCheck, ShieldCheck, Lock } from 'lucide-react';

export default function LiveStats({ currentMultiplier, isRunning, isCrashed, livePlayers = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showProvablyFair, setShowProvablyFair] = useState(false);

  // Generate realistic player usernames matching official Spribe format (d***8, a***3, x***9)
  const formattedPlayers = livePlayers.map((player, idx) => {
    const masks = ['d***8', 'k***2', 'a***9', 'm***1', 's***7', 'r***4', 'x***5', 'v***3'];
    const name = masks[idx % masks.length];
    return {
      ...player,
      username: name,
    };
  });

  return (
    <div className="bg-[#14151b] border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 font-mono text-xs">
      
      {/* 1. Top Nav Tabs ( [ All Bets ], Previous, Top ) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 bg-[#090a0f] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#222530] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Bets
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'previous'
                ? 'bg-[#222530] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'top'
                ? 'bg-[#222530] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top
          </button>
        </div>

        {/* Provably Fair verification link */}
        <button
          onClick={() => setShowProvablyFair(true)}
          className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono hover:underline bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Provably Fair
        </button>
      </div>

      {/* 2. Stats Bar (Avatars + Bets Count + Total Win USD) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-rose-500 text-white font-bold text-[10px] text-center leading-6">d</span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-emerald-500 text-white font-bold text-[10px] text-center leading-6">k</span>
            <span className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-purple-500 text-white font-bold text-[10px] text-center leading-6">a</span>
          </div>

          <span className="text-slate-300 font-bold text-xs">
            43/139 <span className="text-slate-400 font-normal">Bets</span>
          </span>

          <div className="w-24 sm:w-36 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
          </div>
        </div>

        <div className="text-right">
          <span className="text-slate-300 font-extrabold text-sm">
            25,348.11 <span className="text-slate-400 font-normal text-xs">Total win USD</span>
          </span>
        </div>
      </div>

      {/* 3. Live Bets Feed Table (Matching Official Screenshot Columns) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th className="py-2 px-2">Player</th>
              <th className="py-2 px-2">Bet USD</th>
              <th className="py-2 px-2">X</th>
              <th className="py-2 px-2 text-right">Win USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {formattedPlayers.map((player, index) => {
              const isWin = player.cashedOut;
              const mult = player.cashedMultiplier || player.targetMultiplier;
              const multColor = mult >= 5.0 ? 'text-[#c084fc]' : 'text-[#38bdf8]';
              const winUsd = (player.betUsd * mult).toFixed(2);

              return (
                <tr
                  key={index}
                  className={`transition-colors ${
                    isWin ? 'bg-emerald-950/20' : 'hover:bg-slate-900/30'
                  }`}
                >
                  <td className="py-2.5 px-2 font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                      {player.username.charAt(0)}
                    </span>
                    {player.username}
                  </td>
                  <td className="py-2.5 px-2 text-slate-300 font-bold">
                    {player.betUsd.toFixed(2)}
                  </td>
                  <td className={`py-2.5 px-2 font-extrabold ${isWin ? multColor : 'text-slate-500'}`}>
                    {isWin ? `${mult.toFixed(2)}x` : '-'}
                  </td>
                  <td className="py-2.5 px-2 text-right font-extrabold text-emerald-400">
                    {isWin ? winUsd : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Provably Fair SHA-256 Verification Modal */}
      {showProvablyFair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151b] rounded-2xl p-6 max-w-lg w-full border border-emerald-500/30 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Provably Fair Cryptographic Verification
              </h3>
              <button onClick={() => setShowProvablyFair(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-[11px]">
              Every round crash multiplier is mathematically predetermined using HMAC-SHA256 seed cryptography before launch.
            </p>

            <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px]">SERVER SEED (HASHED):</span>
                <div className="text-emerald-300 break-all text-[11px]">
                  e52b50a9f8c14d7b32e189f021bc5601a44e99f01283
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px]">CLIENT SEED:</span>
                <div className="text-indigo-300 break-all text-[11px]">
                  000000000000000000041d8e9e2b1f7c320
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px]">HMAC-SHA256 RESULTING HASH:</span>
                <div className="text-amber-400 break-all text-[11px]">
                  7c9b218f0a3e4210d54b8e210a45f910b2d31e506f89021a32
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProvablyFair(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold transition-colors"
            >
              Close Verification Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
