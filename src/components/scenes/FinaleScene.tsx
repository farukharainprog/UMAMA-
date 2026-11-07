import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  RotateCcw,
  Download,
  Share2,
  Check,
  Volume2,
} from 'lucide-react';
import { BIRTHDAY_GIRL, CREATOR_NAME, BIRTHDAY_DATE } from '../../types';
import { downloadElementAsPng } from '../../utils/download';
import { audioEngine } from '../../utils/audio';

interface FinaleSceneProps {
  onReplay: () => void;
  onDownloadSuccess: (filename: string) => void;
}

export const FinaleScene: React.FC<FinaleSceneProps> = ({
  onReplay,
  onDownloadSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const posterRef = useRef<HTMLDivElement | null>(null);

  // Trigger continuous celebratory fireworks and celebration music
  useEffect(() => {
    audioEngine.initUserInteraction();
    audioEngine.playCelebrationChime();

    const interval = setInterval(() => {
      audioEngine.playFireworkSound();
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#ffffff'],
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#ffffff'],
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-izcior7bqc3utice7yebkr-798714906311.asia-east1.run.app';
    const customUrl = `${origin}/?to=UMAMA-HAPPY-BIRTHDAY`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${BIRTHDAY_GIRL}!`,
          text: `A grand luxury birthday surprise for ${BIRTHDAY_GIRL} from ${CREATOR_NAME}!`,
          url: customUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(customUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // fallback
      }
    }
  };

  const handleDownloadPoster = async () => {
    if (!posterRef.current || isExporting) return;
    setIsExporting(true);
    const filename = `Umama_Grand_Finale_Birthday_Poster.png`;
    const res = await downloadElementAsPng(posterRef.current, filename, 2.5);
    setIsExporting(false);
    if (res.success) {
      onDownloadSuccess(filename);
    }
  };

  const handleReplayVoice = () => {
    audioEngine.initUserInteraction();
    audioEngine.playVoiceGreeting();
  };

  return (
    <div className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 py-12 text-center select-none overflow-hidden">
      {/* Deep Radial Luxury Atmosphere */}
      <div className="pointer-events-none absolute -top-10 h-[650px] w-[650px] rounded-full bg-pink-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-10 h-[650px] w-[650px] rounded-full bg-amber-500/15 blur-[150px]" />

      {/* Realistic Floating Balloons Assembly (Left & Right) */}
      <div className="pointer-events-none absolute top-12 left-4 sm:left-12 flex flex-col items-center animate-float opacity-80">
        <div className="h-16 w-12 sm:h-20 sm:w-16 rounded-full bg-gradient-to-tr from-pink-600 via-rose-400 to-amber-200 shadow-[0_8px_20px_rgba(244,63,94,0.5)] border border-pink-300/40" />
        <div className="h-10 w-0.5 bg-gradient-to-b from-amber-300 to-transparent" />
      </div>

      <div className="pointer-events-none absolute top-20 right-4 sm:right-12 flex flex-col items-center animate-float opacity-80" style={{ animationDelay: '1.5s' }}>
        <div className="h-16 w-12 sm:h-20 sm:w-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-pink-200 shadow-[0_8px_20px_rgba(251,191,36,0.5)] border border-amber-300/40" />
        <div className="h-12 w-0.5 bg-gradient-to-b from-amber-300 to-transparent" />
      </div>

      {/* Grand Finale Keepsake Poster Container */}
      <div className="relative z-10 w-full max-w-2xl my-2">
        <div
          ref={posterRef}
          className="group relative mx-auto overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl text-center"
        >
          {/* Double Golden Decorative Filigree Border */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-400/40" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-pink-500/25" />

          {/* Corner flourish ornaments */}
          <div className="absolute top-5 left-5 text-amber-300/70 text-base">✦</div>
          <div className="absolute top-5 right-5 text-amber-300/70 text-base">✦</div>
          <div className="absolute bottom-5 left-5 text-amber-300/70 text-base">✦</div>
          <div className="absolute bottom-5 right-5 text-amber-300/70 text-base">✦</div>

          {/* Header Golden Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-pink-950/30 to-amber-950/40 px-5 py-2 text-xs font-bold tracking-[0.2em] text-amber-300 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>GRAND CINEMATIC FINALE</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>

          {/* Main Title - Exact requested text */}
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            HAPPY BIRTHDAY{' '}
            <span className="shimmer-gold block sm:inline">{BIRTHDAY_GIRL}!</span>{' '}
            <span className="text-rose-500">❤️</span>
          </h1>

          {/* Realistic Three-Tier Cake Feature in Poster */}
          <div className="my-6 flex items-center justify-center">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-2xl border-2 border-amber-300/60 shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              <img
                src="/src/assets/images/luxury_3tier_cake_1794033671278.jpg"
                alt="Luxury Birthday Cake"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-1 inset-x-1 rounded bg-slate-950/80 text-[10px] font-bold text-amber-300 py-0.5">
                {BIRTHDAY_DATE} • {BIRTHDAY_GIRL}
              </div>
            </div>
          </div>

          {/* Blessing Prose */}
          <p className="mx-auto max-w-lg font-serif text-lg sm:text-2xl font-medium leading-relaxed text-slate-100 drop-shadow">
            "May Allah bless you with a beautiful life, a happy marriage, good health, success and countless reasons to smile."
          </p>

          {/* Signature Block */}
          <div className="mt-8 border-t border-pink-500/25 pt-6">
            <p className="text-xs font-semibold tracking-widest text-pink-300 uppercase">
              With lots of love and best wishes,
            </p>
            <p className="font-serif text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-wider mt-1 drop-shadow">
              {CREATOR_NAME.toUpperCase()} ❤️
            </p>
            <p className="mt-2 font-script text-2xl sm:text-3xl text-pink-300">
              For my dearest friend {BIRTHDAY_GIRL} • {BIRTHDAY_DATE}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
        {/* Replay Entire Experience */}
        <button
          onClick={onReplay}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Replay Birthday Experience</span>
        </button>

        {/* Replay Voice Greeting */}
        <button
          onClick={handleReplayVoice}
          className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-amber-200 shadow-lg backdrop-blur-md transition-all hover:bg-amber-950/50 hover:text-white"
        >
          <Volume2 className="h-4 w-4 text-amber-400" />
          <span>Hear Birthday Voice Again</span>
        </button>

        {/* Download Finale Poster */}
        <button
          onClick={handleDownloadPoster}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-full border border-pink-400/40 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-pink-200 shadow-lg backdrop-blur-md transition-all hover:bg-pink-950/50 hover:text-white"
        >
          <Download className="h-4 w-4 text-pink-400" />
          <span>{isExporting ? 'Exporting...' : 'Download Keepsake Poster (PNG)'}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-amber-200 shadow-lg backdrop-blur-md transition-all hover:bg-amber-950/50 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-amber-400" />
              <span>Share Surprise</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
