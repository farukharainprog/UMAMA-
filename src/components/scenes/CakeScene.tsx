import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Flame, ArrowRight, RotateCcw } from 'lucide-react';
import { BIRTHDAY_GIRL, CREATOR_NAME } from '../../types';
import { audioEngine } from '../../utils/audio';
import cakeImg from '../../assets/images/luxury_3tier_cake_1794033671278.jpg';
import sliceImg from '../../assets/images/luxury_cake_slice_1794033671889.jpg';

interface CakeSceneProps {
  onProceedToFinale: () => void;
}

export const CakeScene: React.FC<CakeSceneProps> = ({ onProceedToFinale }) => {
  const [isCut, setIsCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [knifePos, setKnifePos] = useState({ x: 0, y: 0 });
  const [isDraggingKnife, setIsDraggingKnife] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);

  const cakeAreaRef = useRef<HTMLDivElement | null>(null);

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#ffffff'],
    });
  };

  const executeCakeCut = () => {
    if (isCut || isCutting) return;
    setIsCutting(true);
    audioEngine.initUserInteraction();
    audioEngine.playSliceSound();

    // Slicing animation progression
    setTimeout(() => {
      setIsCut(true);
      setIsCutting(false);
      audioEngine.playCelebrationChime();
      triggerCelebrationConfetti();
    }, 700);
  };

  const handleBlowCandles = () => {
    audioEngine.initUserInteraction();
    audioEngine.playCandleBlowSound();
    setCandlesLit(!candlesLit);
  };

  const handleResetCut = () => {
    setIsCut(false);
    setIsCutting(false);
    setKnifePos({ x: 0, y: 0 });
    setCutProgress(0);
  };

  // Touch and Mouse pointer dragging for knife
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCut) return;
    audioEngine.initUserInteraction();
    setIsDraggingKnife(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingKnife || isCut || !cakeAreaRef.current) return;

    const rect = cakeAreaRef.current.getBoundingClientRect();
    const currentX = e.clientX;
    const currentY = e.clientY;

    const relativeX = currentX - (rect.left + rect.width / 2);
    const relativeY = currentY - (rect.top + rect.height / 2);

    setKnifePos({ x: relativeX, y: relativeY });

    // Check if dragging across cake surface
    if (
      currentX >= rect.left + 40 &&
      currentX <= rect.right - 40 &&
      currentY >= rect.top &&
      currentY <= rect.bottom + 40
    ) {
      const progress = Math.min(1, Math.max(0, (currentY - rect.top) / (rect.height * 0.75)));
      setCutProgress(progress);

      if (progress > 0.5) {
        setIsDraggingKnife(false);
        executeCakeCut();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingKnife) {
      setIsDraggingKnife(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      if (cutProgress > 0.35 && !isCut) {
        executeCakeCut();
      } else {
        setKnifePos({ x: 0, y: 0 });
        setCutProgress(0);
      }
    }
  };

  return (
    <div className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 py-12 text-center select-none overflow-hidden">
      {/* Ambient Lighting Atmosphere */}
      <div className="pointer-events-none absolute -top-10 h-[600px] w-[600px] rounded-full bg-pink-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 h-[600px] w-[600px] rounded-full bg-amber-500/15 blur-[140px]" />

      {/* Header */}
      <div className="relative z-10 mb-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-pink-950/30 to-amber-950/40 px-5 py-2 text-xs font-bold tracking-[0.2em] text-amber-300 shadow-xl backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>ROYAL CAKE CUTTING CEREMONY</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>

        <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          IT'S TIME TO CUT THE CAKE! 🎂
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-pink-200">
          {isCut
            ? 'The slice is served! Savor the sweet blessings of this special day.'
            : 'Drag the golden knife downwards across the cake with your finger or mouse, or tap Cut The Cake!'}
        </p>

        {/* Candle Toggle Pill */}
        <button
          onClick={handleBlowCandles}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-pink-200 shadow-md hover:bg-pink-950/50 transition-colors"
        >
          <Flame className={`h-4 w-4 ${candlesLit ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
          <span>{candlesLit ? 'Tap to blow out candles 💨' : 'Tap to relight candles ✨'}</span>
        </button>
      </div>

      {/* Grand 3-Tier Luxury Cake Arena */}
      <div className="relative z-10 my-2 flex flex-col items-center justify-center w-full max-w-3xl">
        {/* Knife Drag Guidance */}
        {!isCut && (
          <div className="mb-2 text-xs font-bold text-amber-300 drop-shadow animate-pulse">
            {isDraggingKnife
              ? '✨ Cutting through the velvet frosting... slide down!'
              : '👇 Touch & drag the knife across the cake or use the button'}
          </div>
        )}

        <div
          ref={cakeAreaRef}
          className="relative w-full max-w-xl sm:max-w-2xl rounded-3xl border-2 border-amber-300/50 bg-slate-950 p-2 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Main 3-Tier Grand Cake Display Container */}
          <div className="relative aspect-square w-full max-h-[500px] overflow-hidden rounded-2xl">
            {/* The Ultra-Realistic Three-Tier Cake Image */}
            <img
              src={cakeImg || '/assets/images/luxury_3tier_cake.jpg'}
              alt="Grand Luxury Three-Tier Birthday Cake"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackApplied) {
                  target.dataset.fallbackApplied = 'true';
                  target.src = '/assets/images/luxury_3tier_cake.jpg';
                }
              }}
              className="h-full w-full object-cover object-center"
            />

            {/* Glowing Golden Cake Topper: "HAPPY BIRTHDAY UMAMA" */}
            <div className="absolute top-7 inset-x-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-xl border border-amber-300/80 bg-slate-950/80 px-5 py-2 shadow-[0_0_25px_rgba(251,191,36,0.7)] backdrop-blur-md">
                <span className="font-serif text-sm sm:text-lg font-black tracking-widest text-amber-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  HAPPY BIRTHDAY {BIRTHDAY_GIRL}
                </span>
              </div>
            </div>

            {/* Candle Flames Overlay */}
            {candlesLit && (
              <div className="absolute top-16 inset-x-0 flex justify-center items-center pointer-events-none">
                <div className="relative h-6 w-16 flex justify-around">
                  <div className="h-4 w-2.5 rounded-full bg-gradient-to-t from-red-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-flame" />
                  <div className="h-5 w-3 rounded-full bg-gradient-to-t from-red-500 via-amber-300 to-yellow-100 shadow-[0_0_18px_rgba(251,191,36,1)] animate-flame" />
                  <div className="h-4 w-2.5 rounded-full bg-gradient-to-t from-red-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-flame" />
                </div>
              </div>
            )}

            {/* Active Cutting Incision Line */}
            {isCutting && (
              <div className="absolute top-28 bottom-20 left-1/2 w-1.5 -translate-x-1/2 bg-gradient-to-b from-amber-200 via-white to-pink-200 shadow-[0_0_20px_rgba(251,191,36,1)] z-30 animate-pulse" />
            )}

            {/* Realistic Sliced Layer Presentation Overlay (Revealed when Cut) */}
            {isCut && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-500">
                <div className="relative w-full max-w-sm rounded-2xl border-2 border-amber-300/70 bg-slate-900 p-3 shadow-[0_15px_40px_rgba(0,0,0,0.9)] text-center">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950">
                    {/* Gourmet Layered Cake Slice Asset */}
                    <img
                      src={sliceImg || '/assets/images/luxury_cake_slice.jpg'}
                      alt="Gourmet Sliced Cake Piece"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackApplied) {
                          target.dataset.fallbackApplied = 'true';
                          target.src = '/assets/images/luxury_cake_slice.jpg';
                        }
                      }}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 inset-x-2 rounded-lg bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                      First Slice for {BIRTHDAY_GIRL} 🍰
                    </div>
                  </div>

                  <p className="mt-3 font-serif text-lg font-bold text-white">
                    Fresh Vanilla Sponge & Strawberry Cream
                  </p>
                  <p className="font-script text-xl text-pink-300">
                    With endless love, {CREATOR_NAME} ❤️
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Draggable Realistic Damascus Cake Knife */}
          {!isCut && (
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                touchAction: 'none',
                transform: isDraggingKnife
                  ? `translate(${knifePos.x}px, ${knifePos.y}px) rotate(-35deg)`
                  : 'translate(140px, -20px) rotate(-28deg)',
              }}
              className="absolute z-40 cursor-grab active:cursor-grabbing transition-transform duration-75 select-none"
              title="Drag me to cut the cake!"
            >
              {/* Luxury Damascus Golden Knife */}
              <div className="relative flex flex-col items-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
                {/* Golden Damascus Blade */}
                <div className="h-32 w-6 rounded-t-full border border-amber-200 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
                {/* Gold Bolster */}
                <div className="h-2.5 w-8 rounded-sm bg-amber-500 shadow-md" />
                {/* Mother of pearl / Rose Handle */}
                <div className="h-20 w-6 rounded-b-2xl border border-pink-400/60 bg-gradient-to-b from-rose-200 via-pink-400 to-rose-700 shadow-inner flex items-center justify-center">
                  <div className="text-[10px] font-bold text-amber-100">✦</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Post-Cut Celebration Banner */}
        {isCut && (
          <div className="mt-6 animate-in zoom-in-95 duration-500 max-w-xl text-center">
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              YAY! HAPPY BIRTHDAY{' '}
              <span className="shimmer-gold">{BIRTHDAY_GIRL}!</span> 🎉
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-pink-200 leading-relaxed">
              May your year be as wonderful, joyous and sweet as this royal celebration.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isCut ? (
            <button
              onClick={executeCakeCut}
              disabled={isCutting}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-9 py-4 text-sm sm:text-base font-extrabold text-white shadow-[0_10px_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-5 w-5 text-amber-200" />
              <span>CUT THE CAKE 🎂</span>
              <Sparkles className="h-5 w-5 text-amber-200" />
            </button>
          ) : (
            <>
              <button
                onClick={handleResetCut}
                className="flex items-center gap-2 rounded-full border border-pink-400/40 bg-slate-900/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-pink-200 shadow-lg backdrop-blur-md transition-all hover:bg-pink-950/50 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Cut Again</span>
              </button>

              <button
                onClick={onProceedToFinale}
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_35px_rgba(251,191,36,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <span>EXPERIENCE GRAND FINALE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
