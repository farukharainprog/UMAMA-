import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { BIRTHDAY_GIRL, CREATOR_NAME, BIRTHDAY_DATE } from '../../types';
import { audioEngine } from '../../utils/audio';

interface WelcomeSceneProps {
  onLetsCelebrate: () => void;
}

export const WelcomeScene: React.FC<WelcomeSceneProps> = ({ onLetsCelebrate }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);

  const triggerCelebrationConfetti = () => {
    const end = Date.now() + 1800;
    const colors = ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors,
    });
  };

  const handleStartGreeting = () => {
    if (hasStarted || isOpeningAnimation) return;

    setIsOpeningAnimation(true);
    audioEngine.initUserInteraction();

    // 1. Play sweet female voice saying ONLY "Happy Birthday!" once
    audioEngine.playVoiceGreeting();

    // 2. Start premium background instrumental birthday music smoothly
    audioEngine.startBackgroundMusic();

    // 3. Celebratory chime and confetti
    audioEngine.playCelebrationChime();
    triggerCelebrationConfetti();

    setTimeout(() => {
      setHasStarted(true);
      setIsOpeningAnimation(false);
    }, 900);
  };

  const handleCelebrateClick = () => {
    audioEngine.initUserInteraction();
    if (!audioEngine.isMusicActive()) {
      audioEngine.startBackgroundMusic();
    }
    onLetsCelebrate();
  };

  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-12 text-center select-none">
      {/* Luxury Ambient Lighting Glow */}
      <div className="pointer-events-none absolute -top-12 h-[550px] w-[550px] rounded-full bg-pink-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-amber-500/10 blur-[140px]" />

      {/* Main Luxury Header */}
      <div className="relative z-10 mb-6 max-w-2xl animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-pink-950/30 to-amber-950/40 px-5 py-2 text-xs font-bold tracking-[0.2em] text-amber-300 shadow-xl backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>A SPECIAL SURPRISE FOR YOU</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>

        {/* Display: "HAPPY BIRTHDAY UMAMA ❤️" */}
        <h1 className="mt-4 font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          HAPPY BIRTHDAY{' '}
          <span className="shimmer-gold block sm:inline">{BIRTHDAY_GIRL}</span>{' '}
          <span className="text-rose-500">❤️</span>
        </h1>

        <p className="mt-3 font-script text-2xl sm:text-4xl text-pink-300 drop-shadow-[0_2px_12px_rgba(244,63,94,0.4)]">
          A Little Gift Filled With Lots of Love
        </p>

        <p className="mt-2 text-xs sm:text-sm font-medium tracking-wide text-slate-300">
          Celebrating <span className="text-amber-300 font-semibold">{BIRTHDAY_DATE}</span> • Created with love by{' '}
          <span className="text-pink-300 font-bold">{CREATOR_NAME}</span>
        </p>
      </div>

      {/* Realistic 3D Blush Pink Gift Box Showcase */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div
          onClick={handleStartGreeting}
          className={`group relative cursor-pointer transition-all duration-700 ${
            hasStarted ? 'scale-100' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Outer Golden Reflection Halo */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-pink-500/25 via-amber-400/30 to-rose-600/20 blur-2xl group-hover:opacity-100 opacity-60 transition-opacity duration-700" />

          {/* 3D Luxury Box Frame */}
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 overflow-hidden rounded-3xl border-2 border-amber-300/50 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <img
              src="/src/assets/images/luxury_pink_gift_box_1794033672226.jpg"
              alt="Luxury Pink Birthday Gift Box"
              className={`h-full w-full object-cover transition-all duration-700 ${
                hasStarted
                  ? 'brightness-90 filter contrast-105 scale-105'
                  : 'group-hover:scale-102'
              }`}
            />

            {/* Glowing Golden Medallion revealed when opened */}
            {hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 p-6 backdrop-blur-xs animate-in zoom-in-75 duration-500">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-300/80 bg-gradient-to-tr from-amber-400 via-pink-500 to-rose-600 shadow-[0_0_30px_rgba(251,191,36,0.8)]">
                  <Heart className="h-10 w-10 text-white fill-white animate-pulse" />
                </div>
                <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-amber-200 drop-shadow">
                  With Endless Love!
                </h3>
                <p className="font-script text-2xl text-pink-300 mt-1">
                  For Dearest {BIRTHDAY_GIRL}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 mt-1">
                  From {CREATOR_NAME}
                </p>
              </div>
            )}

            {!hasStarted && !isOpeningAnimation && (
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-center">
                <div className="rounded-full border border-amber-300/50 bg-slate-950/80 px-4 py-1.5 text-xs font-bold tracking-wider text-amber-200 shadow-lg backdrop-blur-md">
                  ✨ TAP BOX TO OPEN ✨
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons: Initially Open Box, then "LET'S CELEBRATE ❤️" */}
        {!hasStarted ? (
          <button
            onClick={handleStartGreeting}
            disabled={isOpeningAnimation}
            className="mt-8 flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-9 py-4 text-sm sm:text-base font-extrabold text-white shadow-[0_10px_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
          >
            <Sparkles className="h-5 w-5 text-amber-200" />
            <span>OPEN YOUR GIFT 🎁</span>
            <Sparkles className="h-5 w-5 text-amber-200" />
          </button>
        ) : (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            {/* The exact requested button: "LET'S CELEBRATE ❤️" */}
            <button
              onClick={handleCelebrateClick}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 px-10 py-4 text-base sm:text-lg font-extrabold text-white shadow-[0_10px_35px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
            >
              <span>LET'S CELEBRATE ❤️</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
