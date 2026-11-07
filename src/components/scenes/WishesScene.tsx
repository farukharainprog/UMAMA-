import React, { useState, useRef } from 'react';
import {
  Download,
  FileText,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Cake,
} from 'lucide-react';
import { FIFTEEN_WISHES, BIRTHDAY_GIRL, CREATOR_NAME } from '../../types';
import { downloadElementAsPng, downloadWishesAsPdf } from '../../utils/download';

interface WishesSceneProps {
  onProceedToCake: () => void;
  onDownloadSuccess: (filename: string, isPdf?: boolean) => void;
}

export const WishesScene: React.FC<WishesSceneProps> = ({
  onProceedToCake,
  onDownloadSuccess,
}) => {
  const [activeWishIndex, setActiveWishIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const wishCardRef = useRef<HTMLDivElement | null>(null);

  const currentWish = FIFTEEN_WISHES[activeWishIndex];
  const isFinalWish = activeWishIndex === FIFTEEN_WISHES.length - 1;

  // The NEXT button strictly advances through wishes 1 to 15 one by one with smooth fade
  const handleNextWish = () => {
    if (activeWishIndex < FIFTEEN_WISHES.length - 1) {
      setIsFading(true);
      setTimeout(() => {
        setActiveWishIndex((prev) => prev + 1);
        setIsFading(false);
      }, 220);
    }
  };

  const handlePrevWish = () => {
    if (activeWishIndex > 0) {
      setIsFading(true);
      setTimeout(() => {
        setActiveWishIndex((prev) => prev - 1);
        setIsFading(false);
      }, 220);
    }
  };

  const handleDownloadSingleImage = async () => {
    if (!wishCardRef.current || isExporting) return;
    setIsExporting(true);
    const filename = `Wish_${currentWish.id}_for_${BIRTHDAY_GIRL}.png`;
    const res = await downloadElementAsPng(wishCardRef.current, filename, 2.5);
    setIsExporting(false);
    if (res.success) {
      onDownloadSuccess(filename, false);
    }
  };

  const handleDownloadAllPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    const res = await downloadWishesAsPdf();
    setIsExporting(false);
    if (res.success) {
      onDownloadSuccess(res.filename, true);
    }
  };

  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-12 text-center select-none">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute -top-12 h-[550px] w-[550px] rounded-full bg-pink-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 h-[550px] w-[550px] rounded-full bg-amber-500/10 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 mb-6 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-pink-950/30 to-amber-950/40 px-5 py-1.5 text-xs font-bold tracking-[0.2em] text-amber-300 shadow-xl backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>SPECIAL BIRTHDAY WISHES</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>

        <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          15 Heartfelt Prayers for {BIRTHDAY_GIRL}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Sent with sincere love and warmest duas from{' '}
          <span className="text-pink-300 font-bold">{CREATOR_NAME}</span>
        </p>

        {/* Progress Tracker (e.g. Wish 3 of 15) */}
        <div className="mt-4 mx-auto max-w-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1.5 px-1">
            <span>Wish {activeWishIndex + 1} of {FIFTEEN_WISHES.length}</span>
            <span>{Math.round(((activeWishIndex + 1) / FIFTEEN_WISHES.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-amber-400/30">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${((activeWishIndex + 1) / FIFTEEN_WISHES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Wish Card */}
      <div className="relative z-10 w-full max-w-xl">
        <div
          ref={wishCardRef}
          className={`group relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-300/50 bg-gradient-to-br from-slate-900 via-pink-950/40 to-slate-900 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-left transition-all duration-300 ${
            isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Double Golden Decorative Filigree Border */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-400/30" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-pink-500/20" />

          {/* Corner flourish */}
          <div className="absolute top-5 left-5 text-amber-300/60 text-xs">✦</div>
          <div className="absolute top-5 right-5 text-amber-300/60 text-xs">✦</div>

          {/* Card Header */}
          <div className="relative mb-6 flex items-center justify-between border-b border-pink-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-xs font-black text-slate-950 shadow-md">
                {currentWish.id}
              </span>
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                {currentWish.category}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {currentWish.id} / {FIFTEEN_WISHES.length}
            </span>
          </div>

          {/* Wish Text */}
          <div className="my-6 min-h-[120px] flex items-center justify-center text-center px-2">
            <p className="font-serif text-2xl sm:text-3xl font-extrabold leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              "{currentWish.text}"
            </p>
          </div>

          {/* Card Footer */}
          <div className="relative mt-6 flex items-center justify-between border-t border-pink-500/20 pt-4 text-xs">
            <span className="font-script text-2xl text-pink-300">
              For {BIRTHDAY_GIRL} ❤️
            </span>
            <span className="text-amber-200/90 font-medium">
              From {CREATOR_NAME}
            </span>
          </div>
        </div>

        {/* Wish Navigation Controls Below Card */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!isFinalWish ? (
            <div className="flex items-center gap-3">
              {activeWishIndex > 0 && (
                <button
                  onClick={handlePrevWish}
                  className="flex h-12 items-center gap-1.5 rounded-full border border-pink-500/30 bg-slate-900/80 px-5 text-xs font-bold text-pink-200 shadow-md hover:bg-slate-800 transition-all active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
              )}

              {/* The required NEXT button below each wish: strictly advances to next wish! */}
              <button
                onClick={handleNextWish}
                className="flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-9 text-sm font-extrabold text-white shadow-[0_10px_35px_rgba(244,63,94,0.45)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
              >
                <span>NEXT WISH</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* After the 15th wish is reached and viewed: */
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
              <p className="font-serif text-xl sm:text-2xl font-extrabold text-amber-300 tracking-wide drop-shadow mb-3">
                ALL YOUR WISHES ARE COMPLETE! ❤️
              </p>
              {/* The exact requested button: "LET'S CUT THE CAKE 🎂" */}
              <button
                onClick={onProceedToCake}
                className="flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 px-10 py-4 text-base sm:text-lg font-extrabold text-white shadow-[0_10px_35px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 hover:brightness-110"
              >
                <Cake className="h-5 w-5 text-yellow-100" />
                <span>LET'S CUT THE CAKE 🎂</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Download Button */}
      <div className="relative z-10 mt-10 flex items-center justify-center gap-3">
        <button
          onClick={handleDownloadSingleImage}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-full border border-pink-400/30 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-pink-300 hover:bg-slate-800 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Save Current Card (PNG)</span>
        </button>

        <button
          onClick={handleDownloadAllPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-slate-800 transition-colors"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Save All 15 as PDF</span>
        </button>
      </div>
    </div>
  );
};
