'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Users, AlertTriangle } from 'lucide-react';

export default function MultiplierCanvas({ currentMultiplier, isCrashed, isRunning, isWaiting, countdown, history = [] }) {
  const canvasRef = useRef(null);
  const [expandHistory, setExpandHistory] = useState(false);
  const smoothMultRef = useRef(1.00);

  useEffect(() => {
    let animId;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI display
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    const drawFrame = () => {
      // Smooth linear interpolation (LERP) for 60 FPS buttery motion
      if (isWaiting) {
        smoothMultRef.current = 1.00;
      } else {
        smoothMultRef.current += (currentMultiplier - smoothMultRef.current) * 0.15;
      }

      const activeMult = isRunning || isCrashed ? smoothMultRef.current : 1.00;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Radiating Dark Sunburst Rays (Spribe Aviator Canvas Background)
      const centerX = width * 0.2;
      const centerY = height * 0.9;
      const numRays = 18;

      for (let i = 0; i < numRays; i++) {
        const angle1 = (Math.PI / 2 / numRays) * i;
        const angle2 = (Math.PI / 2 / numRays) * (i + 0.5);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, Math.max(width, height) * 1.5, -angle1, -angle2, true);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? 'rgba(40, 4, 18, 0.45)' : 'rgba(15, 2, 8, 0.45)';
        ctx.fill();
      }

      // 2. Calculate flight curve progress (1.00x -> 10.00x+)
      const progress = Math.min(Math.max((activeMult - 1.0) / 4.5, 0), 1.0);
      
      const startX = 30;
      const startY = height - 20;
      const endX = startX + (width - 70) * progress;
      const endY = startY - (height - 60) * Math.pow(progress, 1.25);

      // 3. Draw Crimson Curved Trajectory & Filled Area
      if (progress > 0) {
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, 'rgba(229, 9, 20, 0.05)');
        gradient.addColorStop(1, isCrashed ? 'rgba(244, 63, 94, 0.4)' : 'rgba(229, 9, 20, 0.45)');

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX + (endX - startX) * 0.35, startY, endX, endY);
        ctx.lineTo(endX, startY);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Curved Red Stroke Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(startX + (endX - startX) * 0.35, startY, endX, endY);
        ctx.strokeStyle = isCrashed ? '#f43f5e' : '#e50914';
        ctx.lineWidth = 4;
        ctx.shadowColor = isCrashed ? '#f43f5e' : '#ff0914';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 4. Draw Official Spribe Red Propeller Airplane Sprite with gentle hovering motion
      if (isRunning && !isCrashed) {
        ctx.save();
        // Subtle floating bobbing physics effect
        const bobbingY = Math.sin(Date.now() / 150) * 2;
        ctx.translate(endX, endY + bobbingY);
        ctx.rotate(-Math.PI / 7);

        // Spinning propeller effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, -6);
        ctx.lineTo(14, 6);
        ctx.stroke();

        // Red Propeller Airplane Fuselage
        ctx.fillStyle = '#e50914';
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-14, -9);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-14, 9);
        ctx.closePath();
        ctx.fill();

        // Wing outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-6, 0);
        ctx.lineTo(0, 6);
        ctx.stroke();

        ctx.restore();
      } else if (isCrashed && progress > 0) {
        // Crash blast particles
        for (let i = 0; i < 16; i++) {
          const angle = (Math.PI * 2 / 16) * i;
          const dist = 16 + Math.random() * 18;
          ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(endX + Math.cos(angle) * dist, endY + Math.sin(angle) * dist, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(drawFrame);
    };

    animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [currentMultiplier, isCrashed, isRunning, isWaiting]);

  // Display top recent 25 history items
  const recentHistory = history.slice(0, 25);

  return (
    <div className="space-y-2">
      
      {/* 1. Top Multiplier History Ribbon (Positioned ABOVE Canvas Screen as in Screenshot) */}
      <div className="flex items-center justify-between bg-[#14151b] border border-slate-800 rounded-xl px-3 py-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 pr-2">
          {recentHistory.slice(0, 15).map((item, idx) => {
            const crash = item.crashPoint;
            const pillStyle =
              crash >= 10.0
                ? 'bg-[#3b1226] text-[#ec4899] border-[#ec4899]/30'
                : crash >= 2.0
                ? 'bg-[#2d1b3d] text-[#c084fc] border-[#c084fc]/30'
                : 'bg-[#1a2c38] text-[#38bdf8] border-[#38bdf8]/30';

            return (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-extrabold border shrink-0 ${pillStyle}`}
              >
                {crash.toFixed(2)}x
              </span>
            );
          })}
        </div>

        {/* Expand History Button (...) */}
        <button
          onClick={() => setExpandHistory(!expandHistory)}
          className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0"
          title="Toggle Full History"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable History Dropdown (Up to 25 Crash Multipliers) */}
      {expandHistory && (
        <div className="bg-[#14151b] border border-slate-800 rounded-xl p-3 shadow-2xl animate-fadeIn">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
            Last 25 Crash Multipliers
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5">
            {recentHistory.map((item, idx) => {
              const crash = item.crashPoint;
              const pillStyle =
                crash >= 10.0
                  ? 'bg-[#3b1226] text-[#ec4899] border-[#ec4899]/30'
                  : crash >= 2.0
                  ? 'bg-[#2d1b3d] text-[#c084fc] border-[#c084fc]/30'
                  : 'bg-[#1a2c38] text-[#38bdf8] border-[#38bdf8]/30';

              return (
                <span
                  key={idx}
                  className={`px-2 py-1 text-center rounded-full text-[11px] font-mono font-extrabold border ${pillStyle}`}
                >
                  {crash.toFixed(2)}x
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Main Game Screen Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090a0f] h-[360px] sm:h-[400px] flex flex-col justify-between shadow-2xl">
        
        {/* Top Gold FUN MODE Banner */}
        <div className="relative z-10 w-full bg-[#f59e0b] text-[#090a0f] font-extrabold text-[11px] font-mono uppercase tracking-widest text-center py-0.5">
          FUN MODE
        </div>

        {/* HTML5 Canvas Surface */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Center Multiplier Text OR Waiting Countdown */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {isWaiting ? (
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 uppercase tracking-wider">
                WAITING FOR NEXT ROUND
              </div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {countdown.toFixed(1)}s
              </div>
              <div className="w-44 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-400 transition-all duration-100"
                  style={{ width: `${(countdown / 5.0) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className={`text-6xl sm:text-7xl font-black font-mono-num tracking-tighter transition-all duration-75 ${
                isCrashed ? 'text-[#e50914]' : 'text-white'
              }`}>
                {currentMultiplier.toFixed(2)}x
              </div>

              {isCrashed && (
                <div className="mt-2 text-rose-500 font-extrabold font-mono text-sm tracking-wider uppercase flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  FLEW AWAY!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Right: Online Players Pill */}
        <div className="relative z-10 flex justify-end p-3">
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-full px-2.5 py-1 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">36</span>
          </div>
        </div>

      </div>

    </div>
  );
}
