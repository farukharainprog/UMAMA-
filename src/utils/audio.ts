/**
 * Master Ultra-Realistic Audio & Voice Synthesizer for UMAMA's Birthday Experience
 * Features:
 * - Lush cinematic orchestral/harp/celesta birthday arrangement
 * - Auto-ducking for crystal-clear narration
 * - Natural female voice greeting matching exact script
 * - Realistic knife slicing, candle blow, fireworks, and celebration fanfare
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicIntervalId: number | null = null;
  private currentVolume = 0.85;
  private isMuted = false;
  private isSpeaking = false;

  // Exact frequencies for multi-octave acoustic arrangement in C Major
  private readonly NOTE_FREQS: Record<string, number> = {
    'C3': 130.81,
    'E3': 164.81,
    'F3': 174.61,
    'G3': 196.00,
    'A3': 220.00,
    'B3': 246.94,
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'F5': 698.46,
    'G5': 783.99,
    'A5': 880.00,
    'C6': 1046.50,
  };

  // Orchestral Birthday Score: [melodyNote, durationSec, bassNote, chordTriad]
  private readonly SCORE: [string, number, string, string[]][] = [
    // Phrase 1: "Happy Birthday to you"
    ['G4', 0.5, 'C3', ['E4', 'G4']],
    ['G4', 0.5, 'C3', []],
    ['A4', 1.0, 'F3', ['C4', 'F4']],
    ['G4', 1.0, 'C3', ['E4', 'G4']],
    ['C5', 1.0, 'C3', ['G4', 'C5']],
    ['B4', 2.0, 'G3', ['D4', 'G4', 'B4']],

    // Phrase 2: "Happy Birthday to you"
    ['G4', 0.5, 'G3', ['B3', 'D4']],
    ['G4', 0.5, 'G3', []],
    ['A4', 1.0, 'D3', ['F#4', 'A4']],
    ['G4', 1.0, 'G3', ['D4', 'G4']],
    ['D5', 1.0, 'G3', ['F4', 'B4']],
    ['C5', 2.0, 'C3', ['E4', 'G4', 'C5']],

    // Phrase 3: "Happy Birthday Dear UMAMA"
    ['G4', 0.5, 'C3', ['E4', 'G4']],
    ['G4', 0.5, 'C3', []],
    ['G5', 1.0, 'C3', ['E4', 'G4', 'C5', 'E5']],
    ['E5', 1.0, 'A3', ['C4', 'E4']],
    ['C5', 1.0, 'F3', ['A3', 'C4', 'F4']],
    ['B4', 1.0, 'D3', ['F4', 'B4']],
    ['A4', 2.0, 'F3', ['C4', 'F4', 'A4']],

    // Phrase 4: "Happy Birthday to you!"
    ['F5', 0.5, 'F3', ['A4', 'C5']],
    ['F5', 0.5, 'F3', []],
    ['E5', 1.0, 'C3', ['G4', 'C5']],
    ['C5', 1.0, 'A3', ['E4', 'A4']],
    ['D5', 1.0, 'G3', ['F4', 'B4']],
    ['C5', 2.6, 'C3', ['E4', 'G4', 'C5', 'G5']],
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.musicGainNode = this.ctx.createGain();
        this.sfxGainNode = this.ctx.createGain();

        this.updateGainLevels();

        this.musicGainNode.connect(this.masterGain);
        this.sfxGainNode.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private updateGainLevels(): void {
    if (!this.ctx || !this.masterGain || !this.musicGainNode || !this.sfxGainNode) return;
    const baseVol = this.isMuted ? 0 : this.currentVolume;
    const musicDucking = this.isSpeaking ? 0.22 : 1.0;

    const t = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(baseVol, t);
    this.musicGainNode.gain.setValueAtTime(0.38 * musicDucking, t);
    this.sfxGainNode.gain.setValueAtTime(0.7, t);
  }

  public initUserInteraction(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Generates a warm, natural acoustic piano / harp timbre with multiple harmonics
   */
  private playAcousticNote(freq: number, startTime: number, duration: number, volume: number): void {
    const ctx = this.getContext();
    if (!ctx || !this.musicGainNode) return;

    // Harmonic 1 (Fundamental Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic 2 (Warm Triangle overtone)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Harmonic 3 (Sparkling fifth)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, startTime);

    // Envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    // Expressive attack
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.025);
    // Smooth natural acoustic decay
    gain.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.musicGainNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);

    const stopTime = startTime + duration + 0.15;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);
  }

  public startBackgroundMusic(): void {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    let scoreIndex = 0;
    let nextNoteTime = ctx.currentTime + 0.05;

    const schedule = () => {
      if (!this.isMusicPlaying || !ctx) return;

      while (nextNoteTime < ctx.currentTime + 1.8) {
        const [melodyNote, dur, bassNote, chordNotes] = this.SCORE[scoreIndex];

        // 1. Play melody (Warm celesta/bell register)
        const melodyFreq = this.NOTE_FREQS[melodyNote] || 440;
        this.playAcousticNote(melodyFreq, nextNoteTime, dur * 0.96, 0.22);

        // 2. Play warm deep bass note
        if (bassNote) {
          const bassFreq = this.NOTE_FREQS[bassNote] || 130;
          this.playAcousticNote(bassFreq, nextNoteTime, dur * 1.5, 0.15);
        }

        // 3. Play soft harp chord accompaniment
        chordNotes.forEach((cNote, idx) => {
          const chordFreq = this.NOTE_FREQS[cNote] || 330;
          const stagger = idx * 0.035; // gentle harp strum effect
          this.playAcousticNote(chordFreq, nextNoteTime + stagger, dur * 1.2, 0.07);
        });

        nextNoteTime += dur * 0.85; // Natural celebratory tempo
        scoreIndex = (scoreIndex + 1) % this.SCORE.length;

        // Brief cinematic breathe between loops
        if (scoreIndex === 0) {
          nextNoteTime += 1.8;
        }
      }
    };

    schedule();
    this.musicIntervalId = window.setInterval(schedule, 200);
  }

  public stopBackgroundMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public toggleBackgroundMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public isMusicActive(): boolean {
    return this.isMusicPlaying;
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    this.updateGainLevels();
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.updateGainLevels();
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- REALISTIC SOUND EFFECTS ---

  /**
   * Realistic pastry knife slicing sound
   */
  public playSliceSound(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode || this.isMuted) return;

    const t = ctx.currentTime;

    // Filtered noise swoosh (friction of blade parting cream)
    const bufSize = ctx.sampleRate * 0.22;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + 0.2);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    noise.start(t);

    // Subtle metallic resonance of the golden blade
    const metalOsc = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalOsc.type = 'sine';
    metalOsc.frequency.setValueAtTime(820, t);
    metalOsc.frequency.exponentialRampToValueAtTime(540, t + 0.18);
    metalGain.gain.setValueAtTime(0.08, t);
    metalGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    metalOsc.connect(metalGain);
    metalGain.connect(this.sfxGainNode);
    metalOsc.start(t);
    metalOsc.stop(t + 0.2);
  }

  /**
   * Grand celebratory crystal fanfare
   */
  public playCelebrationChime(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode || this.isMuted) return;

    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 to G6
    arpeggio.forEach((freq, idx) => {
      const t = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  /**
   * Candle blow sound effect
   */
  public playCandleBlowSound(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode || this.isMuted) return;

    const bufSize = ctx.sampleRate * 0.35;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    noise.start();
  }

  /**
   * Realistic firework boom + sparkle pop
   */
  public playFireworkSound(): void {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode || this.isMuted) return;

    const t = ctx.currentTime;
    // Deep thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.45);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.52);

    // Crackle sparkles
    setTimeout(() => {
      if (!ctx || !this.sfxGainNode || this.isMuted) return;
      const chimeTime = ctx.currentTime;
      [880, 1174, 1396, 1760].forEach((freq, idx) => {
        const cOsc = ctx.createOscillator();
        const cGain = ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(freq, chimeTime + idx * 0.04);
        cGain.gain.setValueAtTime(0.06, chimeTime + idx * 0.04);
        cGain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + idx * 0.04 + 0.25);
        cOsc.connect(cGain);
        cGain.connect(this.sfxGainNode!);
        cOsc.start(chimeTime + idx * 0.04);
        cOsc.stop(chimeTime + idx * 0.04 + 0.3);
      });
    }, 180);
  }

  // --- SWEET NATURAL FEMALE VOICE GREETING ---

  /**
   * Speaks ONE sweet, natural, cheerful young female voice saying ONLY:
   * "Happy Birthday!"
   * - Said only once
   * - No UMAMA pronounced
   * - No additional sentences
   */
  public playVoiceGreeting(onComplete?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      this.isSpeaking = true;
      this.updateGainLevels();

      const pickBestFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
        // Preferred natural, cheerful, young female voices
        const naturalOrder = [
          'Microsoft Jenny Online (Natural)',
          'Microsoft Aria Online (Natural)',
          'Google US English',
          'Samantha',
          'Victoria',
          'Karen',
          'Serena',
          'Moira',
          'Zira',
          'Google UK English Female',
        ];

        for (const name of naturalOrder) {
          const match = voices.find((v) => v.name.includes(name));
          if (match) return match;
        }

        return (
          voices.find((v) => v.name.toLowerCase().includes('female') && v.lang.startsWith('en')) ||
          voices.find((v) => v.lang.startsWith('en-US')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0]
        );
      };

      const executeSpeech = () => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = pickBestFemaleVoice(voices);

        const utterance = new SpeechSynthesisUtterance("Happy Birthday!");
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 0.95; // natural cheerful young cadence
        utterance.pitch = 1.15; // sweet, bright natural tone
        utterance.volume = this.isMuted ? 0 : this.currentVolume;

        utterance.onend = () => {
          this.isSpeaking = false;
          this.updateGainLevels();
          onComplete?.();
        };

        utterance.onerror = () => {
          this.isSpeaking = false;
          this.updateGainLevels();
          onComplete?.();
        };

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        executeSpeech();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          executeSpeech();
        };
      }
    } catch {
      this.isSpeaking = false;
      this.updateGainLevels();
      onComplete?.();
    }
  }

  public stopVoiceGreeting(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.updateGainLevels();
    }
  }

  public isVoiceSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }
}

export const audioEngine = new BirthdayAudioEngine();
