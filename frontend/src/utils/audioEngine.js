// Web Audio API Synthesizer Engine for Aviator Game
// Zero external assets required - pure browser AudioContext synthesis

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgOsc1 = null;
    this.bgOsc2 = null;
    this.bgGain = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.isPlayingBg = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgGain && this.ctx) {
      this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    }
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  startBgMusic() {
    if (this.isMuted || this.isPlayingBg) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.bgGain.connect(this.ctx.destination);

      // Soft ambient chord synth (A minor / C major feel)
      this.bgOsc1 = this.ctx.createOscillator();
      this.bgOsc1.type = 'sine';
      this.bgOsc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

      this.bgOsc2 = this.ctx.createOscillator();
      this.bgOsc2.type = 'triangle';
      this.bgOsc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3

      this.bgOsc1.connect(this.bgGain);
      this.bgOsc2.connect(this.bgGain);

      this.bgOsc1.start();
      this.bgOsc2.start();
      this.isPlayingBg = true;
    } catch (e) {
      console.warn("Bg music audio init deferred:", e.message);
    }
  }

  startEngineSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopEngineSound();

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(130, this.ctx.currentTime); // Base engine tone
      this.engineOsc.connect(this.engineGain);
      this.engineOsc.start();
    } catch (e) {
      console.warn("Engine audio init deferred:", e.message);
    }
  }

  updateEnginePitch(multiplier) {
    if (!this.engineOsc || !this.ctx || this.isMuted) return;
    try {
      // Frequency ramps up smoothly as multiplier increases (1.00x -> 10.00x+)
      const targetFreq = 130 + Math.pow(multiplier, 1.4) * 45;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    } catch (e) {
      // Ignore audio sync glitches
    }
  }

  stopEngineSound() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
        this.engineOsc = null;
    }
  }

  playCashoutChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      gain.connect(this.ctx.destination);

      // Two-tone arpeggio success chime (E5 -> B5)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.setValueAtTime(987.77, now + 0.12); // B5
      osc1.connect(gain);
      osc1.start(now);
      osc1.stop(now + 0.6);
    } catch (e) {}
  }

  playCrashExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopEngineSound();

      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      gain.connect(this.ctx.destination);

      // Low frequency noise / blast impact
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }
}

export const audioEngine = new AudioEngine();
